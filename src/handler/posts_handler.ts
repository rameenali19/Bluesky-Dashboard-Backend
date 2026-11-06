import pool from '../config/database.js'

async function postsHandler(evt: any,user_id: number) {

  try {

     if (evt.commit.operation === 'create' || evt.commit.operation === 'update') {

  const post_uri=`at://${evt.did}/app.bsky.feed.post/${evt.commit.rkey}`;
  const post_text = evt.commit.record.text;
  const record_key = evt.commit.rkey;
  const created_at = evt.time;

  const result = await pool.query(`
 
    INSERT INTO posts (post_uri,user_id,post_text,record_key,created_at)
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (user_id,record_key) 
    DO UPDATE SET 
    post_text = EXCLUDED.post_text,
    deleted = FALSE,
    postgres_updated = NOW()
    RETURNING *`,
    [post_uri,user_id,post_text,record_key,created_at]);

    return result.rows[0];
}

 else if(evt.commit.operation === 'delete'){
    const result = await pool.query(`
      
      `)
  }

  }
  catch (error) {
    console.error('Could not handle post:', error);
    throw error;
  }
};

export default postsHandler;