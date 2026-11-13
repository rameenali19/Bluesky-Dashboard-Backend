import pool from "../config/database.js";

async function cursorService(){

  try {
    const result = await pool.query(`
      SELECT last_cursor
      FROM sync_state 
      WHERE id = 1;
      `)
      
      if(result.rows.length===0) return undefined;
      
     else  return Number(result.rows[0].last_cursor);
  }
  
  catch(error){
    console.error('Could not find cursor', error);
    throw error;
  }
}

export default cursorService;