import pool from '../config/database.js'

async function likesHandler(evt: any,user_id: number) {

  try {



  }

  catch (error) {
    console.error('Could not handle like:', error);
    throw error;
  }
};

export default likesHandler;