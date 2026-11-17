import db from "../databaseConfigs/mongoConfig.js";

async function statsHandler() {

  await db.collection("dashboard_stats").updateOne(
    { id: "main" },
    {
      $inc: {
        posts: 1
      }
    },
    { upsert: true }
  )
}

export default statsHandler;