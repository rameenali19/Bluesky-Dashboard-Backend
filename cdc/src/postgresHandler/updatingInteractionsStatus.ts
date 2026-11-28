import pool from "../databaseConfig/postgresConfig.js";

async function updatingInteractionsStatus(data: any[], table: "likes" | "reposts") {

  if (!data.length) return;

  try {
    const id = data.map((d) => d.id)

    await pool.query(`
      UPDATE ${table}
      SET mongodb_synced_at = queued_at,
      queued_at = NULL
      WHERE id = ANY($1::BIGINT[]);
    `, [id])
  }

  catch (error) {
    console.log("Could not update interaction status: ", error);
    throw error;
  }
}

export default updatingInteractionsStatus;
