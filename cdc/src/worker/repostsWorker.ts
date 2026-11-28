import { Worker } from "bullmq"
import fetchUnsyncedReposts from "../unsyncedRowFetching/fetchUnsyncedReposts.js";
import redisConfig from "../redis/redisConfig.js"
import { client } from "../databaseConfig/mongoConfig.js";
import interactionPostsHandler from "../mongodbHandlers/interactionPostsHandler.js";
import statsHandler from "../mongodbHandlers/statsHandler.js";
import activityHandler from "../mongodbHandlers/activityHandler.js";
import updatingInteractionsStatus from "../postgresHandler/updatingInteractionsStatus.js";

const worker = new Worker("repostsQueue", async (job) => {

  console.log("Worker received job:", job.name);

  const reposts = await fetchUnsyncedReposts();

  console.log("Fetched reposts:", reposts?.length);

  if (!reposts?.length) return;

  const session = client.startSession();

  try {
    await session.withTransaction(async () => {

      await interactionPostsHandler(reposts, session, "repost_count");
      console.log("Post's repost count increased");

      await statsHandler("reposts", reposts.length, session);
      console.log("Stats collection updated");

      await activityHandler(reposts, "reposts", session);
      console.log("Activity collection updated");

    });

    console.log("MongoDB transaction committed");

    await updatingInteractionsStatus(reposts, "reposts");
    console.log("PostgreSQL sync status updated");
  }
  catch (error) {
    console.log("Repost worker failed: ", error)
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