import pool from "../databaseConfigs/postgresConfig.js";

async function fetchUnsyncedLikes() {

  try {

    const likes = await pool.query(`
      SELECT * 
      FROM likes
      WHERE mongodb_synced_at IS NULL 
      OR
      postgres_updated > mongodb_synced_at; 
      `)

    return likes;

  }

  catch (error) {
    console.log("Unsynced Likes fetching failed: ", error);
  }

}

export default fetchUnsyncedLikes;