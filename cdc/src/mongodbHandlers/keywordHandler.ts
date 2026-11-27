import type { ClientSession } from "mongodb";
import db from "../databaseConfig/mongoConfig.js"
import { extractKeywords } from "yake-ts";

interface Keywords {
  keyword: string,
  start: Date,
  end: Date,
  post_count: number
}

async function keywordHandler(posts: any[], session: ClientSession) {

  if (!posts.length) return;

  try {

    const keywordMap = new Map<string, {
      keyword: string,
      start: Date,
      end: Date,
      post_count: number
    }>();

    if (posts.length === 0) return;

    for (const p of posts) {

      if (!p.post_text || !p.created_at) continue;

      const result = extractKeywords(p.post_text);
      if (result.length === 0) continue;

      const trending = result[0]?.keyword;
      if (!trending) continue;

      const start = new Date(p.created_at);
      start.setUTCMinutes(0, 0, 0);

      const end = new Date(start);
      end.setUTCHours(end.getUTCHours() + 1);

      const key = JSON.stringify([trending, start.getTime()]);

      const exists = keywordMap.get(key);
      if (exists) {
        exists.post_count++;
      }
      else {
        keywordMap.set(key, {
          keyword: trending,
          start: start,
          end: end,
          post_count: 1
        })
      }
    }

    const operations = [...keywordMap.values()].map((value) => ({

      updateOne: {
        filter: { keyword: value.keyword, start: value.start },
        update: {
          $setOnInsert: {
            end: value.end
          },
          $inc: {
            post_count: value.post_count
          }
        },
        upsert: true
      }
    }))

    if (operations.length === 0) return;

    await db.collection<Keywords>("trending_keywords").bulkWrite(operations,{session});

  }
  catch (error) {
    console.log("keywords ", error);
    throw error;
  }
}

export default keywordHandler;