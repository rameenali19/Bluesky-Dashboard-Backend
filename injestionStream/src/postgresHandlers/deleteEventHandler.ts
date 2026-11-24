import pool from "../databaseConfig/postgresConfig.js";
import type { DeleteArr } from "../interface/arrayInterfaces.js";

async function deleteEvent(events: DeleteArr[], operation: string) {

  const user_id = events.map((event) => event.user_id);
  const record_key = events.map((event) => event.record_key);

  const tableObj: Record<string, string> = {
    like: 'likes',
    post: 'posts',
    reposts: 'reposts'
  }

  const table = tableObj[operation];

  try {

    const result = await pool.query(`
        UPDATE ${table} AS l
        SET
        deleted = TRUE,
        postgres_updated = NOW()
        FROM UNNEST(
        $1::TEXT[],F
        $2::TEXT[],
        ) AS d(user_id,record_key)
         WHERE d.user_id = l.user_id 
         AND
         d.record_key = l.record_key
        `);
  }

  catch (error) {
    console.log("Cannot handle delete: ", error);
  }
}

export default deleteEvent;