import pool from "../databaseConfigs/postgresConfig.js";

async function fetchUnsyncedLikes() {

  try {

    const likes = await pool.query(`
      UPDATE likes 
      SET queued_at = NOW()
      WHERE id IN (
            SELECT id 
            FROM likes
            WHERE (mongodb_synced_at IS NULL 
            OR
            postgres_updated > mongodb_synced_at) 
            AND 
            deleted = false
            AND 
            (queued_at IS NULL
            OR
            queued_at < NOW() - INTERVAL '5 minutes')
            LIMIT 10 )
            RETURNING *`)

    return likes.rows;

  }

  catch (error) {
    console.log("Unsynced Likes fetching failed: ", error);
  }

}

export default fetchUnsyncedLikes;