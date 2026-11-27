import pool from "../databaseConfig/postgresConfig.js";
async function updatingStatus(data: any[]) {

  if (!data.length) return;

  try {

    const post_uri = data.map((d) => d.post_uri)

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