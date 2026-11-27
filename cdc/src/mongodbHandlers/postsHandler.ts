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

  }
  catch (error) {
    console.log("post insertion in mongdb", error);
    throw error;
  }
}

export default postsHandler;