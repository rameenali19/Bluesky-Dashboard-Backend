import likesQueue from "../queues/likesQueue.js";

async function likesJob() {

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

}

export default likesJob;