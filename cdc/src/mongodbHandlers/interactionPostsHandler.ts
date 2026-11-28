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

async function interactionPostsHandler(likes: any[], session: ClientSession, table: "likes" | "reposts") {

  if (!likes.length) return;

  if (table === "likes") {
    const count = "like_count";
  }
  else {
    const count = "repost_count";
  }

  try {

    let uniqueUri: string[] = [];
    for (const l of likes) {
      if (!uniqueUri.includes(l.target_post_uri)) {
        uniqueUri.push(l.target_post_uri);
      }
    }

    const posts = await fetchingPosts(uniqueUri);

    await postsHandler(posts, session);

    const likeCountMap = new Map<string, number>();

    for (const l of likes) {
      likeCountMap.set(l.target_post_uri, (likeCountMap.get(l.target_post_uri) || 0) + 1);
    }

    const likesCount = [...likeCountMap].map(([postUri, count]) => ({ postUri, count }));

    const operations = likesCount.map((l) => ({

      updateOne: {
        filter: { _id: l.postUri },
        update: {
          $inc: {
            like_count: l.count
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