import cron from 'node-cron';
import likesJob from '../jobs/likesJob.js';
import postsJob from '../jobs/postsJob.js';
import repostsJob from '../jobs/repostsJob.js';

async function cdcDispatcherService() {

  cron.schedule('* * * * *', async () => {

    postsJob().catch((error) => {
      console.log("postsJob failed: ", error);
    });
    // likesJob().catch((error) => {
    //   console.log("likesJob failed: ", error);
    // });
    // repostsJob().catch((error) => {
    //   console.log("repostsJob failed: ", error);
    // });
  });

}
export default cdcDispatcherService;