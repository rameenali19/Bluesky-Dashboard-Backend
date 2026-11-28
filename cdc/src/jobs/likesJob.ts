import likesQueue from "../queues/likesQueue.js";

async function likesJob() {
  console.log("Adding likes job to queue");

  const job = await likesQueue.add("likeSignal",
    {
      type: "syncLikes"
    },
    {
      jobId: "like-syncing",
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000
      },
      removeOnComplete: true,
      removeOnFail: true
    }
  )
  console.log("Likes job added:", job.id);

}

export default likesJob;