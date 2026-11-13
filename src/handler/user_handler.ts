import pool from '../database/database.js'

async function userHandler(evt: any) {

  try {
    const did = evt.did;

    const result = await pool.query(`
      INSERT INTO users (account_id)
        VALUES ($1)
        ON CONFLICT (account_id) 
        DO UPDATE SET account_id = EXCLUDED.account_id
        RETURNING *`,
         [did]);

    return result.rows[0].id;
  }
  catch (error) {
    console.error('Could not handle user:', error);
    throw error;
  }
};

export default userHandler;