import type { PostArr } from '../interface/arrayInterfaces.js';
import type { LikeArr } from '../interface/arrayInterfaces.js';
import type { UserArr } from '../interface/arrayInterfaces.js';
import type { RepostArr } from '../interface/arrayInterfaces.js';
import type { HistoryArr } from '../interface/arrayInterfaces.js';
import postsHandler from '../postgresHandlers/postsHandler.js';
import userHandler from '../postgresHandlers/userHandler.js';
import syncStateHandler from '../postgresHandlers/syncStateHandler.js';
import jetstreamEventhandler from '../postgresHandlers/jetstream_eventsHandler.js';
import interactionsHandler from '../postgresHandlers/interactionsHandler.js';

const postArr: PostArr[] = [];
const likeArr: LikeArr[] = [];
const repostArr: RepostArr[] = [];
const userArr: UserArr[] = [];
const historyArr: HistoryArr[] = [];

function insertionHandler(event: any[]) {

  for (const evt of event) {
    const userData = {
      id: evt.did
    }
    userArr.push(userData);

    if (evt.commit.collection === 'app.bsky.feed.post') {
      const postData = {
        user_id: evt.did,
        post_uri: `at://${evt.did}/app.bsky.feed.post/${evt.commit.rkey}`,
        post_text: evt.commit.record.text,
        record_key: evt.commit.rkey,
        created_at: new Date(evt.commit.record.createdAt)
      }
      postArr.push(postData);
    }

    if (evt.commit.collection === 'app.bsky.feed.like') {
      const likeData = {
        user_id: evt.did,
        target_post_uri: evt.commit.record.subject.uri,
        record_key: evt.commit.rkey,
        created_at: new Date(evt.commit.record.createdAt)
      }
      likeArr.push(likeData);
    }

    if (evt.commit.collection === 'app.bsky.feed.repost') {
      const repostData = {
        user_id: evt.did,
        target_post_uri: evt.commit.record.subject.uri,
        record_key: evt.commit.rkey,
        created_at: new Date(evt.commit.record.createdAt)
      }
      repostArr.push(repostData);
    }

    const historyData = {
      user_id: evt.did,
      cursor: evt.seq,
      event_time: evt.time,
      event_type: 'commit',
      collection_name: evt.commit.collection,
      operation: evt.commit.operation,
      record_key: evt.commit.rkey,
      event_data: JSON.stringify(evt)
    }
    historyArr.push(historyData);
  }


};

export default insertionHandler;