import db from "../databaseConfig/mongoConfig.js"
import { ClientSession } from "mongodb"

interface DashboardStats {
  _id: number,
  posts: number,
  likes: number,
  reposts: number
}

async function statsHandler(table: "posts" | "likes" | "reposts", count: number, session: ClientSession) {

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
        { upsert: true, session }
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
        { upsert: true, session }
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
        { upsert: true, session }
      )
    }
  }
  catch (error) {
    console.log("handling stats", error);
    throw error;
  }
}

export default statsHandler;