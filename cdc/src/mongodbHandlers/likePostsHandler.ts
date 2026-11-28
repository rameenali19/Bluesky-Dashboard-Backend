import db from "../databaseConfig/mongoConfig.js";
import { ClientSession } from "mongodb";
import fetchingPosts from "../postgresHandler/fetchingPosts.js";
import postsHandler from "./postsHandler.js";

async function likePostsHandler(likes: any[], session: ClientSession) {

  if (!likes.length) return;

  try {

    let uniqueUri: string[] = [];
    for (const l of likes) {
      if (!uniqueUri.includes(l.target_post_uri)) {
        uniqueUri.push(l.target_post_uri);
      }
    }

    const posts = await fetchingPosts(uniqueUri);

    const result = await postsHandler(posts, session);

    const likeCountMap = new Map<string, number>();

    for (const l of likes) {
      likeCountMap.set(l.target_post_uri, (likeCountMap.get(l.target_post_uri) || 0) + 1);
    }

    const likesCount = [...likeCountMap].map(([postUri, count]) => ({ postUri, count }));

  }
  catch (error) {
    console.log("Cannot handle likes increase: ", error);
    throw error;
  }
}

export default likePostsHandler;