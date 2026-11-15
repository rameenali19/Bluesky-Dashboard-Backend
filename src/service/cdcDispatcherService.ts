import cron from 'node-cron';
import fetchUnsyncedLikes from '../cdc/fetchUnsyncedLikes.js';
import fetchUnsyncedPosts from '../cdc/fetchUnsyncedPosts.js';
import fetchUnsyncedReposts from '../cdc/fetchUnsyncedReposts.js';
import likesJob from '../jobs/likesJob.js';
import postsJob from '../jobs/postsJob.js';
import repostsJob from '../jobs/repostsJob.js';

async function cdcDispatcherService() {

  cron.schedule('* * * * *', async () => {

    try {

      const posts = await fetchUnsyncedPosts();
      if (posts?.length !== 0) {
        await postsJob(posts);
      }
      const likes = await fetchUnsyncedLikes();
      if (likes?.length !== 0) {
        await likesJob(likes);
      }
      const reposts = await fetchUnsyncedReposts();
      if (reposts?.length !== 0) {
        await repostsJob(reposts);
      }

    }

    catch (error) {
      console.log("CDC Dispatcher failed: ", error);
    }

  });

}
export default cdcDispatcherService;