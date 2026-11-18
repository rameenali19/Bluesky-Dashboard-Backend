import db from "../databaseConfigs/mongoConfig.js";

interface keywords {
  keyword: string,
  start: Date,
  end: Date,
  post_count: number
}

async function keywordHandler(data: any) {

  if (!data.created_at) return;

  const start = new Date(data.created_at);
  start.setUTCMinutes(0, 0, 0);
  const end = new Date(start);
  end.setUTCHours(end.getUTCHours() + 1);

  let keyword;

  await db.collection<keywords>("trending_keywords").updateOne(
    {
      keyword: keyword,
      start: start
    },
    {
      $setOnInsert: {
        end: end
      },
      $inc: {
        post_count: 1
      }
    },
    { upsert: true }
  )
}

export default keywordHandler;