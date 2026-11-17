import { Worker } from "bullmq";
import redisConfig from "../redis/redisConfig.js";
import postsHandler from "../mongodbHandlers/postsHandler.js";
import statsHandler from "../mongodbHandlers/statsHandler.js";
import activityHandler from "../mongodbHandlers/activityHandler.js";

const worker = new Worker("postsQueue", async (job) => {

  await postsHandler(job.data);
  await statsHandler("posts");
  await activityHandler(job.data, "posts");

},
  {
    connection: redisConfig
  }
);