import { MongoClient } from "mongodb";
import dotenv from 'dotenv'

dotenv.config();

const {
  MONGO_DB_URL
} = process.env;

if (!MONGO_DB_URL) {
  throw new Error('Missing database configuration');
}

const client = new MongoClient(MONGO_DB_URL);

export default client;