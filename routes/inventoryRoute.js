// Needed Resources 
const utilities = require("../utilities/index")
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by id view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build inventory management view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));

// Route to build inventory by classification view
router.get("/add-classification", utilities.checkAccountType,utilities.handleErrors(invController.buildClassificationForm));

// Route to build add-inventory view
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildInventoryForm));

// Route to generate inventory by classification id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build inventory by classification view
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditPage))

// Route to build delete inventory view
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteView))

// Route to handle delete process
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteItem)
)

// Route to handle add classification process
router.post(
    "/add-classification",
    utilities.handleErrors(invController.addClassification)
  )

  // Route to handle add inventory process
  router.post(
    "/add-inventory",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.addInventory)
  )

  // Route to handle update inventory process
  router.post("/update/", 
    regValidate.registationRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))
  
  router.post("/review",
    utilities.handleErrors(invController.addReview)
  )

  module.exports = router;