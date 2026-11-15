import cron from 'node-cron';
import fetchUnsyncedLikes from '../cdc/fetchUnsyncedLikes.js';
import fetchUnsyncedPosts from '../cdc/fetchUnsyncedPosts.js';
import fetchUnsyncedReposts from '../cdc/fetchUnsyncedReposts.js';

async function cdcDispatcherService() {

  cron.schedule('* * * * *', async () => {

    try {

      await fetchUnsyncedPosts();
      await fetchUnsyncedLikes();
      await fetchUnsyncedReposts();

    }

    catch(error){
      console.log("CDC Dispatcher failed: ", error);
    }

  });

}
export default cdcDispatcherService;