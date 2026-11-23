import { Jetstream, type CursorStore } from '@bsky/jetstream'
import userHandler from '../postgresHandlers/userHandler.js';
import postsHandler from '../postgresHandlers/postsHandler.js';
import interactionsHandler from '../postgresHandlers/interactionsHandler.js';
import syncStateHandler from '../postgresHandlers/syncStateHandler.js';
import cursorHandler from '../postgresHandlers/cursorHandler.js';
import jetstreamEventhandler from '../postgresHandlers/jetstream_eventsHandler.js';

interface PostArr {
  user_id: string,
  post_uri: string;
  post_text: string,
  record_key: string,
  created_at: Date
}

interface UserArr {
  id: string,
}

interface LikeArr {
  user_id: string,
  target_post_uri: string,
  record_key: string,
  created_at: Date
}

interface RepostArr {
  user_id: string,
  target_post_uri: string,
  record_key: string,
  created_at: Date
}

interface CursorArr {
  last_cursor: number
}

interface HistoryArr {
  user_id: string,
  cursor: number,
  event_time: Date,
  event_type: string,
  collection_name: string,
  operation: string,
  record_key: string,
  event_data: Record<string, unknown>
}

const postArr: PostArr[] = [];
const likeArr: LikeArr[] = [];
const repostArr: RepostArr[] = [];
const userArr: UserArr[] = [];
const cursorArr: CursorArr[] = [];
const historyArr: HistoryArr[] = [];

async function injestionService() {

  const jetstream = new Jetstream('https://jetstream.us-east.bsky.network');

  let sequence: number | undefined;
  sequence = await cursorHandler();

  const cursor: CursorStore = {
    load: async () => sequence,   // number | undefined
    save: async (seq: number) => { sequence = seq },
  }

  for await (const evt of jetstream.live({
    collections: ['app.bsky.feed.post', 'app.bsky.feed.like', 'app.bsky.feed.repost'],
    kinds: ['commit'], cursor,
  })) {

    if (evt.kind !== 'commit') continue;

    const userData = {
      id: evt.did
    }

    userArr.push(userData);

    // const user_id = await userHandler(evt);

    // if (evt.commit.collection === 'app.bsky.feed.post') {
    //   const post = await postsHandler(evt, user_id);
    // }
    // if (evt.commit.collection === 'app.bsky.feed.like') {
    //   const table = 'likes';
    //   const like = await interactionsHandler(evt, user_id, table);
    // }
    // if (evt.commit.collection === 'app.bsky.feed.repost') {
    //   const table = 'reposts';
    //   const repost = await interactionsHandler(evt, user_id, table);
    // }

    // const seq = await syncStateHandler(evt.seq);
    // const event = await jetstreamEventhandler(evt, user_id);

    sequence = evt.seq;

  }
}

async function bulkInsert() {

  if (userArr.length === 500) {
    await userHandler(userArr);
    userArr.length = 0;
  }

}
export default injestionService;