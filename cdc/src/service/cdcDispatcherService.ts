import cron from 'node-cron';
import likesJob from '../jobs/likesJob.js';
import postsJob from '../jobs/postsJob.js';
import repostsJob from '../jobs/repostsJob.js';

async function cdcDispatcherService() {

  cron.schedule('* * * * *', async () => {

    try {

      postsJob();
      likesJob();
      repostsJob();

    }

    catch (error) {
      console.log("CDC Dispatcher failed: ", error);
    }

  });

}
export default cdcDispatcherService;