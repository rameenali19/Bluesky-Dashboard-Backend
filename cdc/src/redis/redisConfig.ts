import dotenv from 'dotenv'

dotenv.config({path: '../.env'});

const {
  REDIS_HOST,
  REDIS_PORT
} = process.env;

if (!(REDIS_HOST && REDIS_PORT)) {
  throw new Error('Missing Redis configuration');
}

const redisConfig = {
  host: REDIS_HOST,
  port: Number(REDIS_PORT)
}

export default redisConfig;