import { Worker } from "bullmq";
import redisConfig from "../redis/redisConfig.js";
import postsHandler from "../mongodbHandlers/postsHandler.js";
import statsHandler from "../mongodbHandlers/statsHandler.js";
import activityHandler from "../mongodbHandlers/activityHandler.js";
import keywordHandlers from "../mongodbHandlers/keywordHandler.js";
import updatingPostsStatus from "../postgresHandler/updatingPostsStatus.js";
import fetchUnsyncedPosts from "../unsyncedRowFetching/fetchUnsyncedPosts.js";
import { client } from "../databaseConfig/mongoConfig.js";

const worker = new Worker("postsQueue", async (job) => {

  console.log("Worker received job:", job.name);

  const posts = await fetchUnsyncedPosts();

  console.log("Fetched posts:", posts?.length);

  if (!posts?.length) return;

  const session = client.startSession();

  try {
    await session.withTransaction(async () => {

      await postsHandler(posts, session);
      console.log("Posts collection updated");

      await statsHandler("posts", posts.length, session);
      console.log("Stats collection updated");

      await activityHandler(posts, "posts", session);
      console.log("Activity collection updated");

      await keywordHandlers(posts, session);
      console.log("Keywords collection updated");
    })

    console.log("MongoDB transaction committed");

    await updatingPostsStatus(posts);
    console.log("PostgreSQL sync status updated");
  }
  catch (error) {
    console.log("Posts worker failed: ", error);
    throw error;
  }
  finally {
    await session.endSession();
  }

}, {
  connection: redisConfig,
  concurrency: 1
});

export default worker;