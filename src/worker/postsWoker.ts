import { Worker } from "bullmq";
import redisConfig from "../redis/redisConfig.js";
import postsHandler from "../mongodbHandlers/postsHandler.js";

const worker = new Worker("postsQueue", async (job) => {
  await postsHandler(job.data);
},
  {
    connection: redisConfig
  }
);