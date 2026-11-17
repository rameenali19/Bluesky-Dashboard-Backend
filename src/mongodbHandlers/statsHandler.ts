import db from "../databaseConfigs/mongoConfig.js";

interface dashboardStats {
  _id: number,
  posts: number,
  likes: number,
  reposts: number
}

async function statsHandler(table: string) {

  if (table === "posts") {
    await db.collection<dashboardStats>("dashboard_stats").updateOne(
      { _id: 1 },
      {
        $inc: {
          posts: 1
        }
      },
      { upsert: true }
    )
  }

  if (table === "likes") {
    await db.collection<dashboardStats>("dashboard_stats").updateOne(
      { _id: 1 },
      {
        $inc: {
          likes: 1
        }
      },
      { upsert: true }
    )
  }

  else {
    await db.collection<dashboardStats>("dashboard_stats").updateOne(
      { _id: 1 },
      {
        $inc: {
          reposts: 1
        }
      },
      { upsert: true }
    )
  }
}

export default statsHandler;