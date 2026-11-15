import postsQueue from "../queues/postsQueue.js";

async function postsJob(postsData: any[] | undefined) {

  if (postsData === undefined) return;

  const job = await postsQueue.addBulk(
    postsData.map(post => ({
      name: 'postsJob',
      data: post
    }))
  )
}

export default postsJob;