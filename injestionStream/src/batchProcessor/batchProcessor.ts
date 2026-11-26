import type { PostArr } from '../interface/arrayInterfaces.js';
import type { UserArr } from '../interface/arrayInterfaces.js';
import type { InteractionArr } from '../interface/arrayInterfaces.js';
import type { HistoryArr } from '../interface/arrayInterfaces.js';
import type { DeleteArr } from '../interface/arrayInterfaces.js';
import postsHandler from '../postgresHandlers/postsHandler.js';
import userHandler from '../postgresHandlers/userHandler.js';
import syncStateHandler from '../postgresHandlers/syncStateHandler.js';
import jetstreamEventhandler from '../postgresHandlers/jetstream_eventsHandler.js';
import interactionsHandler from '../postgresHandlers/interactionsHandler.js';
import deleteEventHandler from '../postgresHandlers/deleteEventHandler.js';
import pRetry from 'p-retry';

async function batchProcessor(event: any[]) {

  const postArr: PostArr[] = [];
  const likeArr: InteractionArr[] = [];
  const repostArr: InteractionArr[] = [];
  const userArr: UserArr[] = [];
  const historyArr: HistoryArr[] = [];
  const deletePostArr: DeleteArr[] = [];
  const deleteLikeArr: DeleteArr[] = [];
  const deleteRepostArr: DeleteArr[] = [];
  const uri: any[] = [];
  let extraPostArr: PostArr[] = [];
  let filteredArr: PostArr[] = [];

  for (const evt of event) {
    try {

      if (evt.commit.operation === 'create' || evt.commit.operation === 'update') {

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

        if (evt.commit.collection === 'app.bsky.feed.like' || evt.commit.collection === 'app.bsky.feed.repost') {
          const postId = evt.commit.record.subject.uri.split('/')[2];
          const postRecordKey = evt.commit.record.subject.uri.split('/')[4];
          const userData = {
            id: postId
          }
          userArr.push(userData);

          const postData = {
            user_id: postId,
            post_uri: evt.commit.record.subject.uri,
            post_text: null,
            record_key: postRecordKey,
            created_at: null
          }
          extraPostArr.push(postData);

          if (evt.commit.collection === 'app.bsky.feed.repost') {
            const repostData = {
              user_id: evt.did,
              target_post_uri: evt.commit.record.subject.uri,
              record_key: evt.commit.rkey,
              created_at: new Date(evt.commit.record.createdAt)
            }
            repostArr.push(repostData);
          }
          else if (evt.commit.collection === 'app.bsky.feed.like') {
            const likeData = {
              user_id: evt.did,
              target_post_uri: evt.commit.record.subject.uri,
              record_key: evt.commit.rkey,
              created_at: new Date(evt.commit.record.createdAt)
            }
            likeArr.push(likeData);
          }
        }
      }

      if (evt.commit.operation === 'delete') {

        const userData = {
          id: evt.did
        }
        userArr.push(userData);

        const deleteData = {
          user_id: evt.did,
          record_key: evt.commit.rkey
        }
        if (evt.commit.collection === 'app.bsky.feed.post') {
          deletePostArr.push(deleteData);
        }

        if (evt.commit.collection === 'app.bsky.feed.like') {
          deleteLikeArr.push(deleteData);
        }

        if (evt.commit.collection === 'app.bsky.feed.repost') {
          deleteRepostArr.push(deleteData);
        }
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
    catch (error) {
      console.log("Error in data insertion: ", error);
    }
  }

  //Inserting all extra post's (from likes and reposts) post_uri inside uri
  for (const post of extraPostArr) {
    uri.push(post.post_uri);
  }

  //removing duplicate uri from the uri
  let uniqueUri = [...new Set(uri)];

  for (const post of extraPostArr) {
    let postUri: string;
    for (const uri1 of uniqueUri) {
      if (post.post_uri === uri1) {
        filteredArr.push(post);
        postUri = uri1;
      }
    }
    uniqueUri = uniqueUri.filter((uri2) => uri2 != postUri)
  }

  for (const post of postArr) {
    filteredArr = filteredArr.filter((post1) => post1.post_uri !== post.post_uri)
  }
  const finalPostArr = [...filteredArr, ...postArr];


  if (userArr.length !== 0) {
    await pRetry(() => userHandler(userArr), {
      retries: 5,
      minTimeout: 500,
      factor: 2
    });
  }

  if (finalPostArr.length !== 0) {
    await pRetry(() => postsHandler(finalPostArr), {
      retries: 5,
      minTimeout: 500,
      factor: 2
    });
  }

  if (likeArr.length !== 0) {
    await pRetry(() => interactionsHandler(likeArr, 'like'), {
      retries: 5,
      minTimeout: 500,
      factor: 2
    });
  }

  if (repostArr.length !== 0) {
    await pRetry(() => interactionsHandler(repostArr, 'repost'), {
      retries: 5,
      minTimeout: 500,
      factor: 2
    });
  }

  if (historyArr.length !== 0) {
    await pRetry(() => jetstreamEventhandler(historyArr), {
      retries: 5,
      minTimeout: 500,
      factor: 2
    });
  }

  if (deleteLikeArr.length !== 0) {
    await pRetry(() => deleteEventHandler(deleteLikeArr, 'like'), {
      retries: 5,
      minTimeout: 500,
      factor: 2
    });
  }

  if (deleteRepostArr.length !== 0) {
    await pRetry(() => deleteEventHandler(deleteRepostArr, 'repost'), {
      retries: 5,
      minTimeout: 500,
      factor: 2
    });
  }

  if (deletePostArr.length !== 0) {
    await pRetry(() => deleteEventHandler(deletePostArr, 'post'), {
      retries: 5,
      minTimeout: 500,
      factor: 2
    });
  }

  if (event.length !== 0) {
    await pRetry(() => syncStateHandler(event[event.length - 1].seq), {
      retries: 5,
      minTimeout: 500,
      factor: 2
    });
  }

};

export default batchProcessor;