import pool from "../databaseConfig/postgresConfig.js";
async function updatingPostsStatus(data: any[]) {

  if (!data.length) return;

  try {

    const post_uri = data.map((d) => d.post_uri)

    await pool.query(`
      UPDATE posts 
      SET mongodb_synced_at = queued_at,
      queued_at = NULL
      WHERE post_uri = ANY($1::TEXT[]);
    `, [post_uri])

  }

  catch (error) {
    console.error('Could not update Posts status:', error);
    throw error;
  }
};

export default updatingPostsStatus;