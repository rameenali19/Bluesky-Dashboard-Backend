import pool from "../databaseConfigs/postgresConfig.js";

async function fetchUnsyncedReposts() {

  try {

    const reposts = await pool.query(`
      SELECT * 
      FROM reposts
      WHERE mongodb_synced_at IS NULL 
      OR
      postgres_updated > mongodb_synced_at
      LIMIT 100;
      `)

    return reposts.rows;

  }

  catch (error) {
    console.log("Unsynced Reosts fetching failed: ", error);
  }

}

export default fetchUnsyncedReposts;