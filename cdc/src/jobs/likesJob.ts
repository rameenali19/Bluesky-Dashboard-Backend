import likesQueue from "../queues/likesQueue.js";

async function likesJob() {

  const job = await likesQueue.add('likeSignal', {
    type: "synclike"
  })
}

export default likesJob;