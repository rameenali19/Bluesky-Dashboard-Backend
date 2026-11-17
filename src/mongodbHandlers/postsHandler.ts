import type { Timestamp } from "mongodb";
import db from "../databaseConfigs/mongoConfig.js";

interface posts {
  _id: Text,
  like_count: number,
  repost_count: number,
  post_text: Text,
  created_at: Timestamp,
  updated_at: Timestamp
}

async function postsHandler(data: any) {

  await db.collection("posts").updateOne(
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