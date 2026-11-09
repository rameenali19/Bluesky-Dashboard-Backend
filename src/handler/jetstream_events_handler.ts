import pool from "../config/database.js";

async function jetstreamEventhandler(evt:any){

  try {

  }

  catch(error){
    console.error('Could not handle event:', error);
    throw error;
  }

}

export default jetstreamEventhandler;