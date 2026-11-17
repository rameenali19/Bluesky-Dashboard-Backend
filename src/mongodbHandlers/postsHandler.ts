import db from "../databaseConfigs/mongoConfig.js";

interface Posts {
  _id: string,
  like_count: number,
  repost_count: number,
  post_text: string,
  created_at: Date,
  updated_at: Date
}

async function postsHandler(data: any) {

  await db.collection<Posts>("posts").updateOne(
    { _id: data.post_uri },
    {
      $set: {
        like_count: 0,
        repost_count: 0,
        post_text: data.post_text,
        created_at: data.created_at,
        updated_at: new Date()
      }
    },
    { upsert: true }
  )
}

export default postsHandler;