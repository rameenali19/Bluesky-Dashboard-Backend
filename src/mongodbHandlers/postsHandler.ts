import db from "../databaseConfigs/mongoConfig.js";

async function postsHandler(data: any) {

  await db.collection("posts").updateOne(
    { post_uri: data.post_uri },
    {
      $set: {
        like_count: 0,
        repost_count: 0,
        post_text: data.post_text,
        created_at: data.created_at,
        updated_at: new Date()
      }
    }
  )

}

export default postsHandler;