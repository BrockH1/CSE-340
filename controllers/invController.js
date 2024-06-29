const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInvId(inventory_id)
  const page = await utilities.buildDetailPage(data)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model,
    nav,
    page,
    errors: null
  })
}

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null
  })

}

invCont.buildClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })

}

invCont.buildInventoryForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  const dropdown = await utilities.buildInventoryForm()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    dropdown,
    errors: null
  })

}

/* ****************************************
*  Insert new classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  const {classification_name} = req.body

  const regResult = await invModel.createClassification(
    classification_name
  )

  if (regResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `${classification_name} has been added`
    )
    res.status(201).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}

invCont.addInventory = async function (req, res) {
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body

  const regResult = await invModel.createInventoryItem(
    classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  )

  let classifications = await invModel.getClassifications()
  const dropdown = await utilities.buildInventoryForm(classifications)

  if (regResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Item has been added`
    )
    res.status(201).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      dropdown,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      dropdown,
      errors: null
    })
  }
}
module.exports = invCont