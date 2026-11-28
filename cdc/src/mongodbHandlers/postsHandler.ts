import db from "../databaseConfig/mongoConfig.js"
import { ClientSession } from "mongodb"

interface Posts {
  _id: string,
  like_count: number,
  repost_count: number,
  post_text: string,
  created_at: Date,
  updated_at: Date
}

async function postsHandler(posts: any[], session: ClientSession) {

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

    await db.collection<Posts>("posts").bulkWrite(operations, { session });
  }
  catch (error) {
    console.log("Cannot handle post insertion in mongdb", error);
    throw error;
  }
}

export default postsHandler;