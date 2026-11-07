import pool from '../config/database.js'

async function likesHandler(evt: any,user_id:number) {

  try {

  const target_post_uri = evt.record.subject.uri;
  const record_key = evt.commit.rkey;
  const created_at = new Date(evt.commit.record.createdAt);

    //Checking if the event is create like 
    if (evt.commit.operation === 'create') {   

      //Does this post exist in posts table?
      const exist = await pool.query(`
        SELECT id 
        FROM posts
        WHERE post_uri = $1`, [target_post_uri]);

      //If post doesn't exist in post table 
      if (exist.rows.length === 0) {
        const did = target_post_uri.split('/')[2];   //Extracting post's creator's did 
        const record_key = target_post_uri.split('/')[4];   //Extracting post's record key
        let user_id :number;

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
           user_id = adding_user.rows[0].id;  //Store the user id
        }

        //If it exists in users table
        else {
           user_id = existing_user.rows[0].id;  //Store the user id
        }

        //Store the posts using user id
        const adding_post = await pool.query(`
            INSERT INTO posts (post_uri,user_id,record_key)
            VALUES ($1,$2,$3)
            RETURNING *`,[target_post_uri, user_id, record_key]);
      }

      //Inserting like in likes table
      const result = await pool.query(`
        INSERT INTO likes (user_id, target_post_uri,record_key,created_at)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT 
        DO UPDATE SET 
        target_post_uri = EXCLUDED.target_post_uri,
        deleted = FALSE,
        postgres_updated = NOW()
        RETURNING * `,[user_id,target_post_uri,record_key,created_at])

        return result.rows[0];
    }

    else if (evt.commit.operation === 'delete') {
      
    }
  }

  catch (error) {
    console.error('Could not handle like:', error);
    throw error;
  }
};

export default likesHandler;