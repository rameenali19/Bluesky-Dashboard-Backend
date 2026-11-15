import likesQueue from "../queues/likesQueue.js";

async function likesJob(likesData: any[]) {

  const job = await likesQueue.addBulk(
    likesData.map(like => ({
      name: 'likesJob',
      data: like
    }))
  )
}

export default likesJob;