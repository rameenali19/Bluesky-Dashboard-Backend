import pool from "../databaseConfigs/postgresConfig.js";

async function fetchUnsyncedPosts() {

  try {

    const posts = await pool.query(`
      SELECT * 
      FROM posts
      WHERE mongodb_synced_at IS NULL 
      OR
      postgres_updated > mongodb_synced_at
      LIMIT 100;
      `)

    return posts.rows;

  }

  catch (error) {
    console.log("Unsynced Posts fetching failed: ", error);
  }

}

export default fetchUnsyncedPosts;