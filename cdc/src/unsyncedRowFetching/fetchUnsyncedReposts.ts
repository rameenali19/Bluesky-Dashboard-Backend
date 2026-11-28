import pool from "../databaseConfig/postgresConfig.js";

async function fetchUnsyncedReposts() {

  try {

    const reposts = await pool.query(`
      UPDATE reposts 
      SET queued_at = NOW()
      WHERE id IN (
            SELECT id 
            FROM reposts
            WHERE (mongodb_synced_at IS NULL 
            OR
            postgres_updated > mongodb_synced_at) 
            AND 
            deleted = false
            AND 
            (queued_at IS NULL
            OR
            queued_at < NOW() - INTERVAL '5 minutes')
            AND target_post_uri IN ( 
            SELECT r.target_post_uri
            FROM reposts r
            JOIN posts p ON p.post_uri = r.target_post_uri AND p.deleted = false
            )
            LIMIT 100 )
            RETURNING *
      `)

    return reposts.rows;

  }

  catch (error) {
    console.log("Unsynced Reosts fetching failed: ", error);
  }

}

export default fetchUnsyncedReposts;