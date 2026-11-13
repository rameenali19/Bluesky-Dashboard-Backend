import dotenv from 'dotenv'

dotenv.config();

const {
  REDIS_HOST,
  REDIS_PORT
} = process.env;

const redisConfig = {
  host: REDIS_HOST,
  port: Number(REDIS_PORT)
}

export default redisConfig;