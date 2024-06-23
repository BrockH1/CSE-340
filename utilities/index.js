const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul id='menu'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img id="inv-image" src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* **************************************
* Build the datail page
* ************************************ */
Util.buildDetailPage = async function(data){
  let page
  if(data != null){ 
    page = '<div id="detail-display">'
    page += '<img id="detail-img" src="' + data.inv_image + ' "alt="Image of '+ data.inv_make + ' ' + data.inv_model 
        +' on CSE Motors" />'
    page += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details'
    page += '<h3>Price: $' + data.inv_price + '</h3>'
    page += '<div><h3>Description: </h3><p id="detail-description">' + data.inv_description + '</p></div>'
    page += '<div><h3>Color: </h3><p>' + data.inv_color + '</p></div>' 
    page += '<div><h3>Miles: </h3><p id="miles">' + data.inv_miles + '</p></div>'
    page += '</div>'
  } else { 
    page += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return page
}

Util.buildInventoryForm = async function(classification_id = null){
  let data = await invModel.getClassifications()
  let dropdown = '<select id="inv-dropdown" name="classification_id" required>'
  dropdown += '<option value="">Select a classification</option>'
  data.rows.forEach((row) => {
    dropdown += '<option value="' + row.classification_id +'"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ){
      dropdown += " selected "
    }
    dropdown += ">" + row.classification_name + "</option>"
  })
  dropdown += '</select>'

  return dropdown
}

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util