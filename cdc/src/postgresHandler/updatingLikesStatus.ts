import pool from "../databaseConfig/postgresConfig.js";

async function updatingLikesStatus(data: any[]) {

  if (!data.length) return;

  try {
    const id = data.map((d) => d.id)

    await pool.query(`
      UPDATE likes 
      SET mongodb_synced_at = queued_at,
      queued_at = NULL
      WHERE id = ANY($1::BIGINT[]);
    `, [id])
  }

  catch (error) {
    console.log("Could not update Likes status: ", error);
    throw error;
  }
}

export default updatingLikesStatus;
