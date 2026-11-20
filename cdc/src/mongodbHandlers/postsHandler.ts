import db from "../databaseConfig/mongoConfig.js"
interface Posts {
  _id: string,
  like_count: number,
  repost_count: number,
  post_text: string,
  created_at: Date,
  updated_at: Date
}

async function postsHandler(data: any) {

  try {
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
  catch (error) {
    console.log("post insertion in mongdb", error);
  }
}

export default postsHandler;