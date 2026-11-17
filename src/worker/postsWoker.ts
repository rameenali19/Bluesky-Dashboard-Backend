import { Worker } from "bullmq";
import redisConfig from "../redis/redisConfig.js";
import { ReturnDocument } from "mongodb";

const worker = new Worker("postsQueue", async (job) => {

},
  {
    connection: redisConfig
  }
);