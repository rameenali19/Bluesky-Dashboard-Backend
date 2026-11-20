import { Worker } from "bullmq";
import redisConfig from "../redis/redisConfig.js";
import postsHandler from "../mongodbHandlers/postsHandler.js";
import statsHandler from "../mongodbHandlers/statsHandler.js";
import activityHandler from "../mongodbHandlers/activityHandler.js";
import keywordHandlers from "../mongodbHandlers/keywordHandler.js";
import updatingStatus from "../postgresHandler/updatingStatus.js";

const worker = new Worker("postsQueue", async (job) => {

  await postsHandler(job.data);
  await statsHandler("posts");
  await activityHandler(job.data, "posts");
  await keywordHandlers(job.data);
  await updatingStatus(job.data.post_uri);

},
  {
    connection: redisConfig
  }
);