import repostsQueue from "../queues/repostsQueue.js";

async function repostsJob() {

  const job = await repostsQueue.add('repostSignal', {
    type: "syncReposts"
  })
}

export default repostsJob;