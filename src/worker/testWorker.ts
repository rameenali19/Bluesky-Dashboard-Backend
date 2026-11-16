import { Worker } from 'bullmq';
import redisConfig from '../redis/redisConfig.js';
const likesWorker = new Worker(
  'likesQueue',
  async (job) => {

    console.log('Processing like job:', job.id);

    console.log('Like data:', job.data);

    // MongoDB processing will go here

    return {
      success: true,
      likeId: job.data.id
    };
  },
  {
    connection: redisConfig,
    concurrency: 5
  }
);

// Listen for completed jobs
likesWorker.on('completed', (job) => {
  console.log(`Like job ${job.id} completed successfully`);
});

// Listen for failed jobs
likesWorker.on('failed', (job, error) => {
  console.error(`Like job ${job?.id} failed:`, error.message);
});

// Listen for worker errors
likesWorker.on('error', (error) => {
  console.error('Likes worker error:', error);
});

export default likesWorker;