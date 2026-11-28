import db from "../databaseConfig/mongoConfig.js";
import { ClientSession } from "mongodb";
import fetchingPosts from "../postgresHandler/fetchingPosts.js";

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

  }
  catch (error) {
    console.log("Cannot handle likes increase: ", error);
    throw error;
  }
}

export default likePostsHandler;