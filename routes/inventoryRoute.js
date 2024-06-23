// Needed Resources 
const utilities = require("../utilities/index")
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

router.get("/", utilities.handleErrors(invController.buildManagementView));

router.get("/add-classification", utilities.handleErrors(invController.buildClassificationForm));

router.get("/add-inventory", utilities.handleErrors(invController.buildInventoryForm));

router.post(
    "/add-classification",
    utilities.handleErrors(invController.addClassification)
  )

  router.post(
    "/add-inventory",
    utilities.handleErrors(invController.addInventory)
  )

  module.exports = router;