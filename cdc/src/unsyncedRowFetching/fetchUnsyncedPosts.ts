import pool from "../databaseConfig/postgresConfig.js";

async function fetchUnsyncedPosts() {

  try {

    const posts = await pool.query(`
      UPDATE posts 
      SET queued_at = NOW()
      WHERE post_uri IN (
            SELECT post_uri 
            FROM posts
            WHERE (mongodb_synced_at IS NULL 
            OR
            postgres_updated > mongodb_synced_at) 
            AND 
            deleted = false
            AND 
            (queued_at IS NULL
            OR
            queued_at < NOW() - INTERVAL '5 minutes')
            ORDER BY postgres_updated
            LIMIT 10 )
            RETURNING *
      `)

    return posts.rows;

  }

  catch (error) {
    console.log("Unsynced Posts fetching failed: ", error);
    throw error;
  }

}

export default fetchUnsyncedPosts;