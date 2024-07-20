const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* ***************************
 *  Retreive account info by id
 * ************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching id found")
  }
}

async function getReviewsByAccountId (account_id) {
  try{
    const result = await pool.query(
      'SELECT review.review_text, review.review_date, inventory.inv_make, inventory.inv_model, inventory.inv_year, review.review_id FROM review INNER JOIN inventory on review.inv_id = inventory.inv_id WHERE account_id = $1',
      [account_id])
    console.log(result.rows)
    return result.rows
  } catch (error) {
    return new Error("No matching id found")
  }
}

async function getReviewById (review_id) {
  try{
    const result = await pool.query(
      'SELECT * FROM review WHERE review_id = $1',
      [review_id])
      return result.rows[0]
  } catch (error) {
    return new Error("No matching id found")
  }
}

async function getReviewName (account_id) {
  try{
    const result = await pool.query(
      'SELECT UPPER(SUBSTRING(account_firstname, 1, 1)) as first_initial, account_lastname FROM account WHERE account_id = $1',
      [account_id])
      return result.rows[0]
  } catch (error) {
    return new Error("No matching id found")
  }
}

/* ***************************
 *  Update account info
 * ************************** */
async function updateInfo (
  account_firstname,
  account_lastname,
  account_email,
  account_id
)
{
    try{
      const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
      const data = await pool.query(sql, [
        account_firstname,
        account_lastname,
        account_email,
        account_id
        ])
        return data.rows[0]
    } catch (error) {
      return error.message
    }
}

async function updateReview (
  review_text,
  review_id
)
{
  try{
  const sql = "UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *"
  const data = await pool.query(sql, [
    review_text,
    review_id
  ])
  return data.rows[0]
} catch (error) {
  return error.message
}
}

async function deleteReview(
  review_id
)
{
try{
  const sql = "DELETE FROM review WHERE review_id = $1";
      const data = await pool.query(sql, [
        review_id])
        return data
    } catch (error) {
      return error.message
    }
}

/* ***************************
 *  Change account password
 * ************************** */
async function changePassword (
  account_password,
  account_id
)
{
    try{
      const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
      const data = await pool.query(sql, [
        account_password,
        account_id
        ])
        return data.rows[0]
    } catch (error) {
      return error.message
    }
}
  module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, updateInfo, getAccountById, changePassword, getReviewsByAccountId, getReviewById, updateReview, deleteReview, getReviewName}