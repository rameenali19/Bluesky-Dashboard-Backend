import repostsQueue from "../queues/repostsQueue.js";

async function repostsJob() {
  console.log("Adding reposts job to queue");

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

    console.log("Reposts job added:", job.id);
}

export default repostsJob;