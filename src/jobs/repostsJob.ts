import repostsQueue from "../queues/repostsQueue.js";

async function repostsJob(repostsData: any[] | undefined) {

  if (repostsData === undefined) return;

  const job = await repostsQueue.addBulk(
    repostsData.map(repost => ({
      name: 'repostsJob',
      data: repost
    }))
  )
}

export default repostsJob;