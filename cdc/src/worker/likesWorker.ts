import { Worker } from "bullmq"
import fetchUnsyncedLikes from "../unsyncedRowFetching/fetchUnsyncedLikes.js"
import redisConfig from "../redis/redisConfig.js"

const worker = new Worker("likesQueue", async (job) => {

  const posts = await fetchUnsyncedLikes();

},
  {
    connection: redisConfig
  }
);