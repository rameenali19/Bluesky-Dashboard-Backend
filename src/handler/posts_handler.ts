import pool from '../config/database.js'

async function postsHandler(evt: any) {

  try {
  const post_uri=`at://${evt.did}/app.bsky.feed.post/${evt.commit.rkey}`;
  const user_id = evt.did;
  const post_text = evt.commit.record.text;
  const record_key = evt.commit.rkey;

  const result = await pool.query(`
    INSERT INTO posts (post_uri,user_id,post_text,record_key)
    VALUES ($1,$2,$3,$4)
    ON CONFLICT (user_id,record_key) DO NOTHING
    RETURNING *`,
    [post_uri,user_id,post_text,record_key]);

    return result.rows[0];
    
  }
  catch (error) {
    console.error('Could not handle post:', error);
    throw error;
  }
};

export default postsHandler;