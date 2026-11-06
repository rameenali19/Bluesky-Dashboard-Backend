import pool from '../config/database.js'

async function userHandler(evt:any){
const did = evt.did;

await pool.query(
  `INSERT INTO users (
    account_id
  )
    VALUES ($1)
  `, [did]
);

};

export default userHandler;