import db from "../databaseConfig/mongoConfig.js";
import { ClientSession } from "mongodb";
import fetchingPosts from "../postgresHandler/fetchingPosts.js";
import postsHandler from "./postsHandler.js";

interface Posts {
  _id: string,
  like_count: number,
  repost_count: number,
  post_text: string,
  created_at: Date,
  updated_at: Date
}

async function interactionPostsHandler(data: any[], session: ClientSession, 
  table: "like_count" | "repost_count") {

  if (!data.length) return;

  try {

    let uniqueUri: string[] = [];
    for (const d of data) {
      if (!uniqueUri.includes(d.target_post_uri)) {
        uniqueUri.push(d.target_post_uri);
      }
    }

    const posts = await fetchingPosts(uniqueUri);

    await postsHandler(posts, session);

    const countMap = new Map<string, number>();

    for (const d of data) {
      countMap.set(d.target_post_uri, (countMap.get(d.target_post_uri) || 0) + 1);
    }

    const totalCount = [...countMap].map(([postUri, count]) => ({ postUri, count }));

    const operations = totalCount.map((t) => ({

      updateOne: {
        filter: { _id: t.postUri },
        update: {
          $inc: {
            [table]: t.count
          }
        }
      }
    }))

    await db.collection<Posts>("posts").bulkWrite(operations, { session });
  }
  catch (error) {
    console.log("Cannot handle likes increase: ", error);
    throw error;
  }
}

export default interactionPostsHandler;