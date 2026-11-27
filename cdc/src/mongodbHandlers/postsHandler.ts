import db from "../databaseConfig/mongoConfig.js"
interface Posts {
  _id: string,
  like_count: number,
  repost_count: number,
  post_text: string,
  created_at: Date,
  updated_at: Date
}

async function postsHandler(posts: any[]) {

  if (!posts.length) return;

  try {
    const operations = posts.map((p) => ({
      updateOne: {
        filter: { _id: p.post_uri },
        update: {
          $set: {
            post_text: p.post_text,
            created_at: p.created_at,
            updated_at: new Date()
          },
          $setOnInsert: {
            like_count: 0,
            repost_count: 0
          }
        },
        upsert: true
      }
    }))

    await db.collection<Posts>("posts").bulkWrite(operations);
  }
  catch (error) {
    console.log("post insertion in mongdb", error);
    throw error;
  }
}

export default postsHandler;