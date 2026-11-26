import postsQueue from "../queues/postsQueue.js";

async function postsJob() {

  const job = await postsQueue.add('postSignal', {
    type: "syncPosts"
  })
}

export default postsJob;