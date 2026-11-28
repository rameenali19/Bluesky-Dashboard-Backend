import type { ClientSession } from "mongodb";
import db from "../databaseConfig/mongoConfig.js";

interface Hashtags {
  hashtag: string,
  start: Date,
  end: Date,
  post_count: number
}

async function hashtagsHandler(posts: any[], session: ClientSession) {

  if (!posts.length) return;

  try {

    const hashtagMap = new Map<string, {
      hashtag: string,
      start: Date,
      end: Date,
      post_count: number
    }>();

    for (const p of posts) {

      if (!p.post_text || !p.created_at) continue;

      const hashtag = p.post_text.match(/#[\p{L}\p{N}_]+/gu) || [];


      const start = new Date(p.created_at);
      start.setUTCMinutes(0, 0, 0);

      const end = new Date(start);
      end.setUTCHours(end.getUTCHours() + 1);

      const unique: string[] = [];
      for (const h of hashtag) {
        if (!unique.includes(h)) {
          const lowercase = h.toLowerCase();
          unique.push(lowercase);
        }
      }

      for (const u of unique) {

        const key = JSON.stringify([u, start.getTime()]);

        const exists = hashtagMap.get(key);
        if (exists) {
          exists.post_count++;
        }
        else {
          hashtagMap.set(key, {
            hashtag: u,
            start: start,
            end: end,
            post_count: 1
          })
        }

      }
    }

    const operations = [...hashtagMap.values()].map((value) => ({

      updateOne: {
        filter: { hashtag: value.hashtag, start: value.start },
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

    await db.collection<Hashtags>("trending_hashtags").bulkWrite(operations, { session });

  }
  catch (error) {
    console.log("Cannot handle hashtags insertion: ", error);
    throw error;
  }
};

export default hashtagsHandler;