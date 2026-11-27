import { Worker } from "bullmq";
import redisConfig from "../redis/redisConfig.js";
import postsHandler from "../mongodbHandlers/postsHandler.js";
import statsHandler from "../mongodbHandlers/statsHandler.js";
import activityHandler from "../mongodbHandlers/activityHandler.js";
import keywordHandlers from "../mongodbHandlers/keywordHandler.js";
import updatingStatus from "../postgresHandler/updatingStatus.js";
import fetchUnsyncedPosts from "../unsyncedRowFetching/fetchUnsyncedPosts.js";

const worker = new Worker("postsQueue", async (job) => {

  console.log("Worker received job:", job.name);

  const posts = await fetchUnsyncedPosts();

  console.log("Fetched posts:", posts?.length);

  if (!posts?.length) return;

  await postsHandler(posts);
  console.log("Posts collection updated");

  await statsHandler("posts", posts.length);
  console.log("Stats collection updated");

  await activityHandler(posts, "posts");
  console.log("Activity collection updated");

  await keywordHandlers(posts);
  console.log("Keywords collection updated");

  await updatingStatus(posts);
  console.log("PostgreSQL sync status updated");

}, {
  connection: redisConfig,
  concurrency: 1
});

export default worker;