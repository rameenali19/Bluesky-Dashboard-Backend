import pool from '../config/database.js'

async function likesHandler(evt: any, user_id: number) {

  try {
    const record_key = evt.commit.rkey;

    //Checking if the event is create like 
    if (evt.commit.operation === 'create') {

      const target_post_uri = evt.record.subject.uri;
      const created_at = new Date(evt.commit.record.createdAt);

      //Does this post exist in posts table?
      const exist = await pool.query(`
        SELECT id 
        FROM posts
        WHERE post_uri = $1`, [target_post_uri]);

      //If post doesn't exist in post table 
      if (exist.rows.length === 0) {
        const did = target_post_uri.split('/')[2];   //Extracting post's creator's did 
        const post_record_key = target_post_uri.split('/')[4];   //Extracting post's record key
        let post_user_id: number;

        //Post's creator exists in users table?
        const existing_user = await pool.query(`
          SELECT id 
          FROM users
          WHERE account_id = $1`, [did]);

        //If no then save the post's creator inside the users table
        if (existing_user.rows.length === 0) {
          const adding_user = await pool.query(`
               INSERT INTO users (account_id)
                VALUES ($1)
                RETURNING *`, [did]);
          post_user_id = adding_user.rows[0].id;  //Store the user id
        }

        //If it exists in users table
        else {
          post_user_id = existing_user.rows[0].id;  //Store the user id
        }

        //Store the posts using user id
        const adding_post = await pool.query(`
            INSERT INTO posts (post_uri,user_id,record_key)
            VALUES ($1,$2,$3)
            ON CONFLICT (post_uri) 
            DO NOTHING
            RETURNING *`, [target_post_uri, post_user_id, post_record_key]);
      }

      //Inserting like in likes table
      const result = await pool.query(`
        INSERT INTO likes (user_id, target_post_uri,record_key,created_at)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (user_id, record_key)
        DO UPDATE SET 
        target_post_uri = EXCLUDED.target_post_uri,
        deleted = FALSE,
        postgres_updated = NOW()
        RETURNING * `, [user_id, target_post_uri, record_key, created_at])

      return result.rows[0];
    }

    //Deleting the like from the database if that like already exists
    else if (evt.commit.operation === 'delete') {
      const result = await pool.query(`
      UPDATE likes
      SET deleted = TRUE,
      postgres_updated = NOW()  
      WHERE record_key = $1 AND user_id = $2
      RETURNING *`, [user_id,record_key]);

      return result.rows[0];
    }
  }

  catch (error) {
    console.error('Could not handle like:', error);
    throw error;
  }
};

export default likesHandler;