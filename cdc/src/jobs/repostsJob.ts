import repostsQueue from "../queues/repostsQueue.js";

async function repostsJob() {

  const job = await repostsQueue.add('repostSignal',
    {
      type: "syncReposts"
    },
    {
      jobId: "repost-syncing",
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000
      },
      removeOnComplete: true,
      removeOnFail: true
    })
}

export default repostsJob;