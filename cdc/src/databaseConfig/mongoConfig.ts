import { MongoClient } from "mongodb";
import dotenv from 'dotenv'

dotenv.config();

const {
  MONGO_DB_HOST,
  MONGO_DB_PORT,
  MONGO_DB_PASSWORD,
  MONGO_DB_USER,
  MONGO_DB_NAME
} = process.env;

if (!(MONGO_DB_HOST && MONGO_DB_PORT && MONGO_DB_PASSWORD && MONGO_DB_USER && MONGO_DB_NAME)) {
  throw new Error('Missing database configuration');
}

const client = new MongoClient(`mongodb://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}?authSource=admin`);

await client.connect();

const db = client.db(MONGO_DB_NAME);

export default db;