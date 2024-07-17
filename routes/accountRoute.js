const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build register account view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to build manage account view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Route to build update account view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateView))

// Route to handle logout process
router.get("/logout", utilities.handleErrors(accountController.logout))

router.get("/review/delete/:review_id", utilities.handleErrors(accountController.buildDeleteReviewView))

router.get("/review/edit/:review_id", utilities.handleErrors(accountController.buildEditReviewView))

// Route to handle register acount process
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

// Route to handle update account info process
router.post(
  "/update-info/",
  utilities.handleErrors(accountController.updateInfo)
)

// Route to handle change password process
router.post(
  "/change-password/",
  utilities.handleErrors(accountController.changePassword)
)

router.post(
  "/review/update/",
  utilities.handleErrors(accountController.updateReview)
)

router.post(
  "/review/delete/",
  utilities.handleErrors(accountController.deleteReview)
)

// router.post(
//   "/logout",
//   utilities.handleErrors(accountController.logout)
// )


module.exports = router;