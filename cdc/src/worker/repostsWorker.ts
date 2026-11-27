import { Worker } from "bullmq"
import fetchUnsyncedReposts from "../unsyncedRowFetching/fetchUnsyncedLikes.js"
import redisConfig from "../redis/redisConfig.js"

const worker = new Worker("repostsQueue", async (job) => {

  const posts = await fetchUnsyncedReposts();

},
  {
    connection: redisConfig
  }
);