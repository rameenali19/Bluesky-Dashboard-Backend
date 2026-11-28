import { ClientSession } from "mongodb";
import db from "../databaseConfig/mongoConfig.js";

interface Hashtags {
  hashtag: string,
  start: Date,
  end: Date,
  post_count: number
}

async function hashtagsHandler(posts: any[], session: ClientSession) {

  if (!posts.length) return;

  try {



  }
  catch (error) {
    console.log("Cannot handle hashtags insertion: ", error);
    throw error;
  }
};

export default hashtagsHandler;