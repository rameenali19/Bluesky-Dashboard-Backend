import { Queue } from "bullmq";
import redisConfig from "../redis/redisConfig.js";

const likesQueue = new Queue("likesQueue",{
  connection: redisConfig
})

export default likesQueue;