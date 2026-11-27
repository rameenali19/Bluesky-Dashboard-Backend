import pool from "../databaseConfig/postgresConfig.js";
async function updatingStatus(post_uri: String[]) {

  try {

    const result = await pool.query(`
    UPDATE posts 
    SET mongodb_synced_at = queued_at,
    queued_at = NULL
    WHERE post_uri = ANY($1::TEXT[]);
    `, [post_uri])

  }

  catch (error) {
    console.error('Could not handle post:', error);
    throw error;
  }
};

export default updatingStatus;