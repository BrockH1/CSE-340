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
    isLoggedIn: res.locals.loggedin,
    nav,
    grid,
    errors: null
  })
}

/* ***************************
 *  Build inventory item page
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getInventoryByInvId(inv_id)
  const page = await utilities.buildDetailPage(data)
  const reviewData = await invModel.getReviewDataByInvId(inv_id)
  const reviews = await utilities.displayReviewsByInvId(reviewData)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model,
    isLoggedIn: res.locals.loggedin,
    nav,
    page,
    reviews,
    inv_id: inv_id,
    errors: null
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    isLoggedIn: res.locals.loggedin,
    nav,
    classificationSelect,
    errors: null
  })

}

/* ***************************
 *  Build view for adding classification
 * ************************** */
invCont.buildClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    isLoggedIn: res.locals.loggedin,
    nav,
    errors: null
  })

}

/* ***************************
 *  Build inventory form
 * ************************** */
invCont.buildInventoryForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  const dropdown = await utilities.buildInventoryForm()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    isLoggedIn: res.locals.loggedin,
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
      isLoggedIn: res.locals.loggedin,
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      isLoggedIn: res.locals.loggedin,
      nav,
      errors: null
    })
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
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
      isLoggedIn: res.locals.loggedin,
      nav,
      dropdown,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      isLoggedIn: res.locals.loggedin,
      
      nav,
      dropdown,
      errors: null
    })
  }
}

/* ***************************
 *  Add review
 * ************************** */
invCont.addReview = async function (req, res) {
  const {review_text, inv_id, review_name} = req.body
  const account_id = res.locals.accountData.account_id

  const regResult = await invModel.addReview(
    review_text, inv_id, account_id, review_name
  )

  if (regResult) {
    const redirectRoute = "/inv/detail/" + inv_id
    req.flash(
      "notice",
      `Review has been added`
    )
  res.redirect(redirectRoute)
  } else {
    let nav = await utilities.getNav()
    const data = await invModel.getInventoryByInvId(inv_id)
    const page = await utilities.buildDetailPage(data)
    const reviewData = await invModel.getReviewDataByInvId(inv_id)
    const reviews = await utilities.displayReviewsByInvId(reviewData)
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("./inventory/detail", {
      title: data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model,
      isLoggedIn: res.locals.loggedin,
      nav,
      page,
      reviews,
      errors: null
    })
  }

}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit page
 * ************************** */
invCont.buildEditPage = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let itemData = await invModel.getInventoryByInvId(inv_id)
  // itemData = itemData[0]
  const classificationSelect = await utilities.buildClassList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    isLoggedIn: res.locals.loggedin,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update inventory
 * ************************** */
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,} = req.body

  const regResult = await invModel.updateInventoryItem(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  )

  const itemName = `${inv_make} ${inv_model}`
  let classifications = await invModel.getClassifications()
  const classificationSelect = await utilities.buildClassList(classifications)

  if (regResult) {
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")

  } else {
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("./inventory/edit-inventory", {
      title: "Edit" + itemName,
      isLoggedIn: res.locals.loggedin,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    })
  }
}

/* ***************************
 *  Build confirmation page for deleting item
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let itemData = await invModel.getInventoryByInvId(inv_id)
  // itemData = itemData[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    isLoggedIn: res.locals.loggedin,
    nav,
    errors: null,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    inv_id: inv_id
  })
}

/* ***************************
 *  Delete inventory item
 * ************************** */
invCont.deleteItem = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
} = req.body

  const regResult = await invModel.deleteItem(
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  )

  const itemName = `${inv_make} ${inv_model}`

  if (regResult) {
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")

  } else {
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("./inventory/delete-confirm", {
      title: "Delete" + itemName,
      isLoggedIn: res.locals.loggedin,
      nav,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_id
    })
  }
}

module.exports = invCont