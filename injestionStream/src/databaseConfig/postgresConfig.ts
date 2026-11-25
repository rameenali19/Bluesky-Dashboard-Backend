import dotenv from 'dotenv'
import { Pool } from 'pg';

dotenv.config({ path: '../.env' });

const {
  POSTGRES_DB_HOST,
  POSTGRES_DB_PORT,
  POSTGRES_DB_USER,
  POSTGRES_DB_PASSWORD,
  POSTGRES_DB_NAME,
} = process.env;

if (!(POSTGRES_DB_HOST && POSTGRES_DB_PORT && POSTGRES_DB_USER && POSTGRES_DB_PASSWORD && POSTGRES_DB_NAME)) {
  throw new Error('Missing database configuration');
}

const pool = new Pool({
  host: POSTGRES_DB_HOST,
  port: Number(POSTGRES_DB_PORT),
  user: POSTGRES_DB_USER,
  password: POSTGRES_DB_PASSWORD,
  database: POSTGRES_DB_NAME,
});

pool.on('error', (err) => console.error("pg client error: ", err));

export default pool;    