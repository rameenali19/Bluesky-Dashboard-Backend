import cron from 'node-cron';
import fetchUnsyncedLikes from '../unsyncedRowFetching/fetchUnsyncedLikes.js';
import fetchUnsyncedPosts from '../unsyncedRowFetching/fetchUnsyncedPosts.js';
import fetchUnsyncedReposts from '../unsyncedRowFetching/fetchUnsyncedReposts.js';
import likesJob from '../jobs/likesJob.js';
import postsJob from '../jobs/postsJob.js';
import repostsJob from '../jobs/repostsJob.js';

async function cdcDispatcherService() {

  cron.schedule('* * * * *', async () => {

    try {

      postsJob();

    }

    catch (error) {
      console.log("CDC Dispatcher failed: ", error);
    }

  });

}
export default cdcDispatcherService;