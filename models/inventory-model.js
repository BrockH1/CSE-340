const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory item by id
 * ************************** */
async function getInventoryByInvId(inv_id){
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory  
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryItemById error " + error)
  }
    
  }

  async function getReviewDataByInvId(inv_id){
    try {
      const data = await pool.query(
        'SELECT review_text, review_date, UPPER(SUBSTRING(account_firstname, 1, 1)) as first_initial, account_lastname FROM review INNER JOIN account on review.account_id = account.account_id  WHERE inv_id = $1',
        [inv_id]
      )
      return data.rows
    } catch (error) {
      console.error("getReviewData error " + error)
    }
  }

  /* ***************************
 *  Make new classification
 * ************************** */
  async function createClassification(classification_name){
    try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
      return await pool.query(sql, [classification_name])
    } catch (error) {
      return error.message
    }
  }

  /* ***************************
 *  Make new inventory item
 * ************************** */
  async function createInventoryItem(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color){
    try{
      const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
      return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
    } catch (error) {
      return error.message
    }
  }

  /* ***************************
 *  Update inventory item
 * ************************** */
  async function updateInventoryItem(
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
    classification_id){
    try{
      const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
      const data = await pool.query(sql, [
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
        inv_id])
        return data.rows[0]
    } catch (error) {
      return error.message
    }
  }

  /* ***************************
 *  Delete inventory item
 * ************************** */
  async function deleteItem(
    inv_id){
    try{
      const sql = "DELETE FROM inventory WHERE inv_id = $1";
      const data = await pool.query(sql, [
        inv_id])
        return data
    } catch (error) {
      return error.message
    }
  }

  async function addReview(review_text, inv_id, account_id)
  {
    try{
      const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
      return await pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
      return error.message
    }
  }


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInvId, createClassification, createInventoryItem, updateInventoryItem, deleteItem, getReviewDataByInvId, addReview}