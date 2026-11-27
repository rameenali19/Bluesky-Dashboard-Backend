import db from "../databaseConfig/mongoConfig.js"
interface DashboardStats {
  _id: number,
  posts: number,
  likes: number,
  reposts: number
}

async function statsHandler(table: "posts" | "likes" | "reposts", count: number) {

  if (count === 0) return;

  try {

    if (table === "posts") {
      await db.collection<DashboardStats>("dashboard_stats").updateOne(
        { _id: 1 },
        {
          $inc: {
            posts: count
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
            likes: count
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
            reposts: count
          }
        },
        { upsert: true }
      )
    }
  }
  catch (error) {
    console.log("handling stats", error);
    throw error;
  }
}

export default statsHandler;