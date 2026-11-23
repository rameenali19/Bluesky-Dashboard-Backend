import pool from '../databaseConfig/postgresConfig.js'
import type { UserArr } from '../interface/arrayInterfaces.js';

async function userHandler(user: UserArr[]) {

  try {
    const did = user.map((user) => user.id);

    const result = await pool.query(`
      INSERT INTO users (id)
        SELECT*
        FROM UNNEST (
        $1::TEXT[]
        )
        ON CONFLICT (id) 
        DO NOTHING`,
      [did]);
  }
  catch (error) {
    console.error('Could not handle user:', error);
    throw error;
  }
};

export default userHandler;