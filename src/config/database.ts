import dotenv from 'dotenv'
import {Pool} from 'pg';

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

if (!(DB_HOST && DB_PORT && DB_USER && DB_PASSWORD && DB_NAME)) {
  throw new Error('Missing database configuration');
}

const pool = new Pool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export default pool;