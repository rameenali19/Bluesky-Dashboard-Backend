import pool from "../databaseConfig/postgresConfig.js";

async function fetchingPosts(postUri: string[]) {

  if (!postUri.length) return [];

  try {

    const posts = await pool.query(`
      SELECT * 
      FROM posts
      WHERE post_uri = ANY ($1::TEXT[])
      AND 
      deleted = FALSE;
      `, [postUri]);

    return posts.rows;

  }
  catch (error) {
    console.log("Cannot fetch the posts: ", error);
    throw error;
  }
}

export default fetchingPosts;