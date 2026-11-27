import { Worker } from "bullmq";
import redisConfig from "../redis/redisConfig.js";
import postsHandler from "../mongodbHandlers/postsHandler.js";
import statsHandler from "../mongodbHandlers/statsHandler.js";
import activityHandler from "../mongodbHandlers/activityHandler.js";
import keywordHandlers from "../mongodbHandlers/keywordHandler.js";
import updatingStatus from "../postgresHandler/updatingStatus.js";
import fetchUnsyncedPosts from "../unsyncedRowFetching/fetchUnsyncedPosts.js";

const worker = new Worker("postsQueue", async (job) => {

  const posts = await fetchUnsyncedPosts();

  if (!posts?.length) return;

  await postsHandler(posts);
  await statsHandler("posts", posts.length);
  await activityHandler(posts, "posts");
  // await keywordHandlers(job.data);
  await updatingStatus(posts);

},
  {
    connection: redisConfig,
    concurrency: 1
  }
);