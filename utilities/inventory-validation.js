
const accountModel = require("../models/account-model")

const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Make must be at least 3 characters."), // on error this message is sent.
  
      // lastname is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Model must be at least 3 characters."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please insert a description"),

        body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a path for the image"), // on error this message is sent.

        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a path for the thumbnail"), // on error this message is sent.

        body('inv_price')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please provide a price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),

    body('inv_year')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please provide a year')
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage('Year must be a valid 4-digit year'),

    body('inv_miles')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please provide the miles')
        .isInt({ min: 0 })
        .withMessage('Miles must be a non-negative integer'),

    body('inv_color')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please provide a color')
    ]
  }

  validate.checkRegData = async (req, res, next) => {
    const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color,
        errors: null
      })
      return
    }
    next()
  }
  
  module.exports = validate