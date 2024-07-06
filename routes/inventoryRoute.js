// Needed Resources 
const utilities = require("../utilities/index")
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));

router.get("/add-classification", utilities.checkAccountType,utilities.handleErrors(invController.buildClassificationForm));

router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildInventoryForm));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditPage))

router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteView))

router.post(
  "/delete",
  utilities.handleErrors(invController.deleteItem)
)
router.post(
    "/add-classification",
    utilities.handleErrors(invController.addClassification)
  )

  router.post(
    "/add-inventory",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.addInventory)
  )

  router.post("/update/", 
    regValidate.registationRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

  module.exports = router;