import postsQueue from "../queues/postsQueue.js";

async function postsJob() {

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
}

export default postsJob;