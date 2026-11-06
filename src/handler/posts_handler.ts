import pool from '../config/database.js'

async function postsHandler(evt: any) {
  const post_uri=`at://${evt.did}/app.bsky.feed.post/${evt.commit.rkey}`;
  const user_id = evt.did;
  const post_text = evt.commit.record.text;
  const record_key = evt.commit.rkey;

  try {

    

  }
  catch (error) {
    console.error('Could not handle post:', error);
    throw error;
  }
};

export default postsHandler;