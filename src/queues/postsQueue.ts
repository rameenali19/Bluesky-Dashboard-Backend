import { Queue } from "bullmq";
import redisConfig from "../redis/redisConfig.js";

const postsQueue = new Queue("postsQueue",{
  connection: redisConfig
})

export default postsQueue;