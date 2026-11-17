import db from "../databaseConfigs/mongoConfig.js";

async function activityHandler() {

  await db.collection("activity_per_minute").updateOne(
    {},
    {},
    {}
  )

}

export default activityHandler;