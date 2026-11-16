import pool from "../databaseConfigs/postgresConfig.js";

async function fetchUnsyncedReposts() {

  try {

    const reposts = await pool.query(`
      UPDATE reposts 
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
            RETURNING *
      `)

    return reposts.rows;

  }

  catch (error) {
    console.log("Unsynced Reosts fetching failed: ", error);
  }

}

export default fetchUnsyncedReposts;