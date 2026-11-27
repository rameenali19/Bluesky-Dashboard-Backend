import db from "../databaseConfig/mongoConfig.js"
interface Activity {
  _id: Date,
  posts: number,
  likes: number,
  reposts: number,
  total_activity: number
}

async function activityHandler(data: any[], table: string) {

  try {

    const time = new Map<number, number>();

    for (const d of data) {
      if (!d.created_at) continue;
      const minutes = new Date(d.created_at);
      minutes.setSeconds(0, 0);
      const getTime = minutes.getTime();

      time.set(getTime, (time.get(getTime) || 0) + 1);
    };

    const totalTime = [...time].map(([minute, count]) => ({ minute, count }));

    const operation = totalTime.map((t) => ({
      updateOne: {
        filter: { _id: new Date(t.minute) },
        update: {
          $inc: {
            [table]: t.count,
            total_activity: t.count
          },
          $setOnInsert: {
            posts: 0,
            likes: 0,
            reposts: 0
          }
        },
        upsert: true
      }
    }))

    await db.collection<Activity>("activity_per_minute").bulkWrite(operation);
  }
  catch (error) {
    console.log("activity handling", error);
    throw error;
  }
}

export default activityHandler;