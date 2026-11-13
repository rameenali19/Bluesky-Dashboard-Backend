import pool from '../config/database.js'

async function syncStateHandler(cursor: number) {

  try {

    const result = await pool.query(`
      INSERT INTO sync_state (last_cursor)
      VALUES ($1)
      ON CONFLICT (id)
      DO UPDATE SET 
      last_cursor = EXCLUDED.last_cursor,
      postgres_updated = NOW()
      RETURNING * `,[cursor])

      return result.rows[0].last_cursor;

  }

  catch (error) {
    console.error('Could not handle sequence:', error);
    throw error;
  }
}

export default syncStateHandler;