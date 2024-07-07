const utilities = require("../utilities/")
const accountModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
      title: "Login",
      isLoggedIn: res.locals.loggedin,
      nav,
      errors: null
    })
  }

 /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/register", {
      title: "Register",
      isLoggedIn: res.locals.loggedin,
      nav,
      errors: null
    })
  } 

  /* ***************************
 *  Build account management view
 * ************************** */
  async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    const account_id = parseInt(res.locals.accountData.account_id)
    let accountData = await accountModel.getAccountById(account_id)
    res.render("./account/management", {
      title: "Manage Account",
      isLoggedIn: res.locals.loggedin,
      clientName: accountData.account_firstname,
      accountType: res.locals.accountData.account_type,
      nav,
      errors: null
    })
  }

  /* ***************************
 *  Build update account info view
 * ************************** */
  async function buildUpdateView(req, res, next) {
    let nav = await utilities.getNav()
    const account_id = parseInt(res.locals.accountData.account_id)
    let accountData = await accountModel.getAccountById(account_id)
    res.render("./account/update-account", {
      title: "Update Account",
      isLoggedIn: res.locals.loggedin,
      firstName: accountData.account_firstname,
      lastName: accountData.account_lastname,
      email: accountData.account_email,
      nav,
      errors: null
    })
  }

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      isLoggedIn: res.locals.loggedin,
      nav,
      errors: null,
    })
  }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        isLoggedIn: res.locals.loggedin,
        nav,
        errors: null
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        isLoggedIn: res.locals.loggedin,
        nav,
        errors: null
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log(accountData)
  console.log(account_email)
  console.log(account_password)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    isLoggedIn: res.locals.loggedin,
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 /* ***************************
 *  Update account info
 * ************************** */
 async function updateInfo(req, res) {
  
  let nav = await utilities.getNav()
  const id = parseInt(res.locals.accountData.account_id)
  let accountData = await accountModel.getAccountById(id)
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id} = req.body

  const regResult = await accountModel.updateInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (regResult) {
    req.flash("notice", `Your account was successfully updated.`)
    res.redirect("/account/")

  } else {
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("./account/update-account", {
      title: "Update Account",
      isLoggedIn: res.locals.loggedin,
      nav,
      classificationSelect,
      errors: null,
      firstname: accountData.account_firstname,
      lastname: accountData.account_lastname,
      email: accountData.account_email,
    })
  }
}

/* ***************************
 *  Change account password
 * ************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  let hashedPassword
  const id = parseInt(res.locals.accountData.account_id)
  let accountData = await accountModel.getAccountById(id)
  const {
    account_password,
    account_id} = req.body

    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/update-account", {
        title: "Update Account",
        isLoggedIn: res.locals.loggedin,
        firstName: accountData.account_firstname,
        lastName: accountData.account_lastname,
        email: accountData.account_email,
        nav,
        errors: null
      })
    }

  const regResult = await accountModel.changePassword(
    hashedPassword,
    account_id
  )

  if (regResult) {
    req.flash("notice", `Your password was successfully updated.`)
    res.redirect("/account/")

  } else {
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("./account/update-account", {
      title: "Update Account",
      isLoggedIn: res.locals.loggedin,
      firstName: accountData.account_firstname,
      lastName: accountData.account_lastname,
      email: accountData.account_email,
      nav,
      errors: null
    })
  }
}

/* ***************************
 *  Logout process
 * ************************** */
async function logout(req, res)
{
  console.log("Testing")
  res.clearCookie("jwt")
  res.redirect("/")
  res.locals.loggedin = 0
}
  
  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildUpdateView, updateInfo, changePassword, logout }