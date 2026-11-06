import pool from '../config/database.js'

async function userHandler(evt: any) {

  try {
    const did = evt.did;

    const result = await pool.query(`
      INSERT INTO users (
        account_id
      )
        VALUES ($1)
        RETURNING *
      `, [did]);

      return result.rows[0];
  } 
  catch(error){
    console.error('Could not handle user:', error);
        throw error;
  }
};

export default userHandler;