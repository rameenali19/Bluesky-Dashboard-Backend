import pool from '../databaseConfig/postgresConfig.js'
import type { HistoryArr } from '../interface/arrayInterfaces.js';

async function interactionHandler(events: HistoryArr[]) {

  try {
    const user_id = events.map((event) => event.user_id);
    const cursor = events.map((event) => event.cursor);
    const event_time = events.map((event) => event.event_time);
    const event_type = events.map((event) => event.event_type);
    const collection_name = events.map((event) => event.collection_name);
    const operation = events.map((event) => event.operation);
    const record_key = events.map((event) => event.record_key);
    const event_data = events.map((event) => event.event_data);

    const result = await pool.query(`
      INSERT INTO jetstream_events (user_id,cursor,event_time,event_type,collection_name,operation,record_key,event_data)
        SELECT *
        FROM UNNEST (
        $1::TEXT[],
        $2::BIGINT[],
        $3::TIMESTAMPTZ[],
        $4::TEXT[],
        $5::TEXT[],
        $6::TEXT[],
        $7::TEXT[],
        $8::JSONB[]
        )
        ON CONFLICT (cursor) 
        DO NOTHING`,
      [user_id, cursor, event_time, event_type, collection_name, operation, record_key, event_data]);
  }
  catch (error) {
    console.error('Could not handle event:', error);
    throw error;
  }
};

export default interactionHandler;
// import pool from "../databaseConfig/postgresConfig.js";

// async function jetstreamEventhandler(evt:any,user_id:number){

//   try {

//     const cursor = evt.seq;
//     const event_time = evt.time;
//     const event_type = 'commit';
//     const collection_name = evt.commit.collection;
//     const operation = evt.commit.operation;
//     const record_key = evt.commit.rkey;
//     const event_data = JSON.stringify(evt);

//     const result = await pool.query(`
//       INSERT INTO jetstream_events (user_id,cursor,event_time,event_type,
//       collection_name,operation,record_key,event_data)
//       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
//       ON CONFLICT (cursor)
//       DO NOTHING;`,
//       [user_id,cursor,event_time,event_type,collection_name,operation,record_key,event_data]);

//       return result.rows[0];

//   }

//   catch(error){
//     console.error('Could not handle event:', error);
//     throw error;
//   }

// }

// export default jetstreamEventhandler;