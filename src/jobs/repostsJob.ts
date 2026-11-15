import repostsQueue from "../queues/repostsQueue.js";

async function repostsJob(repostsData: any[]) {

  const job = await repostsQueue.addBulk(
    repostsData.map(repost => ({
      name: 'repostsJob',
      data: repost
    }))
  )
}

export default repostsJob;