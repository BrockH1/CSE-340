const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateView))

router.get("/logout", utilities.handleErrors(accountController.logout))

router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request
router.post(
  "/login",
  utilities.handleErrors(accountController.accountLogin)
)

router.post(
  "/update-info/",
  utilities.handleErrors(accountController.updateInfo)
)

router.post(
  "/change-password/",
  utilities.handleErrors(accountController.changePassword)
)

// router.post(
//   "/logout",
//   utilities.handleErrors(accountController.logout)
// )


module.exports = router;