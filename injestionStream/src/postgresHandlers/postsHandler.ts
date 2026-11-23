import pool from '../databaseConfig/postgresConfig.js'
import type { PostArr } from '../interface/arrayInterfaces.js';

async function userHandler(posts: PostArr[]) {

  try {
    const user_id = posts.map((post) => post.user_id);
    const post_uri = posts.map((post) => post.post_uri);
    const post_text = posts.map((post) => post.post_text);
    const record_key = posts.map((post) => post.record_key);
    const created_at = posts.map((post) => post.created_at);

    const result = await pool.query(`
      INSERT INTO posts (user_id,post_uri,post_text,record_key,created_at)
        SELECT*
        FROM UNNEST (
        $1::TEXT[],
        $2::TEXT[],
        $3::TEXT[],
        $4::TEXT[],
        $5::TIMESTAMPTZ[]
        )
        ON CONFLICT (user_id, record_key) 
        DO NOTHING`,
      [user_id, post_uri, post_text, record_key, created_at]);
  }
  catch (error) {
    console.error('Could not handle post:', error);
    throw error;
  }
};

export default userHandler;