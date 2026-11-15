import { Queue } from "bullmq";
import redisConfig from "../redis/redisConfig.js";

const repostsQueue = new Queue("repostsQueue",{
  connection: redisConfig
})

export default repostsQueue;