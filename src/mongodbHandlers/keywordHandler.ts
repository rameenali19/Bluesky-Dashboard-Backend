import db from "../databaseConfigs/mongoConfig.js";

interface keywords {
}

async function keywordHandler(data: any) {

  await db.collection<keywords>("trending_keywords").updateOne(
    {},
    {},
    {}
  )
}

export default keywordHandler;