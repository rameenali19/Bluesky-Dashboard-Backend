import db from "../databaseConfigs/mongoConfig.js";
import { extractKeywords } from "yake-ts";

interface keywords {
  keyword: string,
  start: Date,
  end: Date,
  post_count: number
}

async function keywordHandler(data: any) {

  try {

    if (!data.created_at) return;

    const result = extractKeywords(data.text);
    if (result.length === 0) return;

    const trending = result[0].keyword;

    const start = new Date(data.created_at);
    start.setUTCMinutes(0, 0, 0);
    const end = new Date(start);
    end.setUTCHours(end.getUTCHours() + 1);

    await db.collection<keywords>("trending_keywords").updateOne(
      {
        keyword: trending,
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
  catch (error) {
    console.log("keywords ", error);
  }
}

export default keywordHandler;