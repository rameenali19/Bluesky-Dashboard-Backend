import pool from '../config/database.js'

async function postsHandler(evt: any) {

  try {

  }
  catch (error) {
    console.error('Could not handle post:', error);
    throw error;
  }
};

export default postsHandler;