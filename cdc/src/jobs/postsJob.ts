import postsQueue from "../queues/postsQueue.js";

async function postsJob() {
  console.log("Adding posts job to queue");
  const job = await postsQueue.add('postSignal',
    {
      type: "syncPosts"
    },
    {
      jobId: "post-syncing",
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000
      },
      removeOnComplete: true,
      removeOnFail: true
    })
      console.log("Posts job added:", job.id);
}

export default postsJob;