import { Worker } from "bullmq"
import { client } from "../databaseConfig/mongoConfig.js";
import fetchUnsyncedLikes from "../unsyncedRowFetching/fetchUnsyncedLikes.js"
import redisConfig from "../redis/redisConfig.js"
import statsHandler from "../mongodbHandlers/statsHandler.js";
import activityHandler from "../mongodbHandlers/activityHandler.js";
import updatingLikesStatus from "../postgresHandler/updatingLikesStatus.js";
import likePostsHandler from "../mongodbHandlers/likePostsHandler.js";

const worker = new Worker("likesQueue", async (job) => {

  console.log("Worker received job:", job.name);

  const likes = await fetchUnsyncedLikes();

  console.log("Fetched likes:", likes?.length);

  if (!likes?.length) return;

  const session = client.startSession();

  try {
    await session.withTransaction(async () => {

      await likePostsHandler(likes, session);
      console.log("post's like count increased");

      await statsHandler("likes", likes.length, session);
      console.log("Stats collection updated");

      await activityHandler(likes, "likes", session);
      console.log("Activity collection updated");

    });

    console.log("MongoDB transaction committed");

    await updatingLikesStatus(likes);
    console.log("PostgreSQL sync status updated");
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
    connection: redisConfig,
    concurrency: 1
  }
);

export default worker;