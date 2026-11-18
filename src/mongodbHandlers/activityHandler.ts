import db from "../databaseConfigs/mongoConfig.js";

interface Activity {
  _id: Date,
  posts: number,
  likes: number,
  reposts: number,
  total_activity: number
}

async function activityHandler(data: any, table: string) {

  if (!data.created_at) return

  const minutes = new Date(data.created_at);
  minutes.setSeconds(0, 0);

  if (table === "posts") {
    await db.collection<Activity>("activity_per_minute").updateOne(
      { _id: minutes },
      {
        $inc: {
          posts: 1,
          total_activity: 1
        },
        $setOnInsert: {
          likes: 0,
          reposts: 0
        }
      },
      { upsert: true }
    )
  }

  else if (table === "likes") {
    await db.collection<Activity>("activity_per_minute").updateOne(
      { _id: minutes },
      {
        $inc: {
          likes: 1,
          total_activity: 1
        },
        $setOnInsert: {
          posts: 0,
          reposts: 0
        }
      },
      { upsert: true }
    )
  }

  else if (table === "reposts") {
    await db.collection<Activity>("activity_per_minute").updateOne(
      { _id: minutes },
      {
        $inc: {
          reposts: 1,
          total_activity: 1
        },
        $setOnInsert: {
          likes: 0,
          posts: 0
        }
      },
      { upsert: true }
    )
  }

}

export default activityHandler;