const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", isLoggedIn: res.locals.loggedin, nav, errors: null})
}

module.exports = baseController