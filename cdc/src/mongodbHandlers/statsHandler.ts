import db from "../databaseConfig/mongoConfig.js"
interface DashboardStats {
  _id: number,
  posts: number,
  likes: number,
  reposts: number
}

async function statsHandler(table: string) {

  try {

    if (table === "posts") {
      await db.collection<DashboardStats>("dashboard_stats").updateOne(
        { _id: 1 },
        {
          $inc: {
            posts: 1
          }
        },
        { upsert: true }
      )
    }

    else if (table === "likes") {
      await db.collection<DashboardStats>("dashboard_stats").updateOne(
        { _id: 1 },
        {
          $inc: {
            likes: 1
          }
        },
        { upsert: true }
      )
    }

    else if (table === "reposts") {
      await db.collection<DashboardStats>("dashboard_stats").updateOne(
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
  catch (error) {
    console.log("handling stats", error);
  }
}

export default statsHandler;