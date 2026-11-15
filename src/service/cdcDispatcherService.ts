import cron from 'node-cron';

async function cdcDispatcherService(){

  cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});

}
export default cdcDispatcherService;