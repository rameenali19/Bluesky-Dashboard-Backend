import pool from "../config/database.js";

async function jetstreamEventhandler(evt:any,user_id:number){

  try {

    const cursor = evt.seq;
    const event_time = evt.time;
    const event_type = 'commit';
    const collection_name = evt.commit.collection;
    const operation = evt.commit.operation;
    const record_key = evt.commit.rkey;
    const event_data = JSON.stringify(evt);

    const result = await pool.query(`
      INSERT INTO jetstream_events (user_id,cursor,event_time,event_type,
      collection_name,operation,record_key,event_data)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (cursor) 
      DO NOTHING;`,
      [user_id,cursor,event_time,event_type,collection_name,operation,record_key,event_data]);

      return result.rows[0];

  }

  catch(error){
    console.error('Could not handle event:', error);
    throw error;
  }

}

export default jetstreamEventhandler;