import cron from 'node-cron';
import fetchUnsyncedLikes from '../cdc/fetchUnsyncedLikes.js';
import fetchUnsyncedPosts from '../cdc/fetchUnsyncedPosts.js';
import fetchUnsyncedReposts from '../cdc/fetchUnsyncedReposts.js';

async function cdcDispatcherService(){

  cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});

}
export default cdcDispatcherService;