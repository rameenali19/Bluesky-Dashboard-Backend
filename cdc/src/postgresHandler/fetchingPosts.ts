import { connect } from "node:http2";
import pool from "../databaseConfig/postgresConfig.js";

async function fetchingPosts(postUri: any[]) {

  if (!postUri.length) return;

  try {


  }
  catch (error) {
    console.log("Cannot fetch the posts: ", error);
    throw error;
  }
}

export default fetchingPosts;