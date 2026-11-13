import pool from "../config/database.js";

async function cursorService() {

  try {
    const result = await pool.query(`
      SELECT last_cursor , postgres_updated
      FROM sync_state 
      WHERE id = 1
      `)

    if (result.rows.length === 0) return undefined;

    else {
      const postgresTime = result.rows[0].postgres_updated;
      const currentDate = new Date();
      const diffence = currentDate.getTime() - postgresTime.getTime();
      const seconds = 1000 * 60 * 60 * 36;

      if (diffence <= seconds) {
        return Number(result.rows[0].last_cursor);
      }

      else return undefined;
    }
  }
  
  catch (error) {
    console.error('Could not find cursor', error);
    throw error;
  }
}

export default cursorService;