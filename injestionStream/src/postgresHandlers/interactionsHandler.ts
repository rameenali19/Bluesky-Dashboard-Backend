import pool from '../databaseConfig/postgresConfig.js'
import type { InteractionArr } from '../interface/arrayInterfaces.js';

async function interactionHandler(events: InteractionArr[], eventType: string) {

  try {
    const user_id = events.map((event) => event.user_id);
    const target_post_uri = events.map((event) => event.target_post_uri);
    const record_key = events.map((event) => event.record_key);
    const created_at = events.map((event) => event.created_at);

    const tableObj: Record<string, string> = {
      like: 'likes',
      repost: 'reposts'
    }

    const table = tableObj[eventType];

    if (!table) {
      throw new Error("Invalid delete operation");
    }

    const result = await pool.query(`
      INSERT INTO ${table} (user_id, target_post_uri, record_key, created_at)
        SELECT *
        FROM UNNEST (
        $1::TEXT[],
        $2::TEXT[],
        $3::TEXT[],
        $4::TIMESTAMPTZ[]
        )
        ON CONFLICT (user_id, record_key) 
        DO NOTHING`,
      [user_id, target_post_uri, record_key, created_at]);
  }
  catch (error) {
    console.error('Could not handle interaction:', error);
    throw error;
  }
};

export default interactionHandler;