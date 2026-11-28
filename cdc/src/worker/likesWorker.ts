import { Worker } from "bullmq"
import { client } from "../databaseConfig/mongoConfig.js";
import fetchUnsyncedLikes from "../unsyncedRowFetching/fetchUnsyncedLikes.js"
import redisConfig from "../redis/redisConfig.js"

const worker = new Worker("likesQueue", async (job) => {

  console.log("Worker received job:", job.name);

  const likes = await fetchUnsyncedLikes();

  console.log("Fetched posts:", likes?.length);

  if (!likes?.length) return;

  const session = client.startSession();

  try {
    await session.withTransaction(async () => {

    })
  }

  catch (error) {
    console.log("Likes worker failed: ", error)
    throw error;
  }
  finally {
    await session.endSession();
  }
},
  {
    connection: redisConfig
  }
);