import pool from "../databaseConfig/postgresConfig.js";
import type { DeleteArr } from "../interface/arrayInterfaces.js";

async function deleteEvent(events: DeleteArr[], operation: string) {

  const user_id = events.map((event) => event.user_id);
  const record_key = events.map((event) => event.record_key);

  try {
    if (operation === 'like') {
      const result = await pool.query(`
        
        `);
    }

    else if (operation === 'post') {
      const result = await pool.query(`
        
        `);
    }

    else if (operation === 'repost') {
      const result = await pool.query(`
        
        `);
    }
  }

  catch (error) {
    console.log("Cannot handle delete: ", error);
  }
}

export default deleteEvent;