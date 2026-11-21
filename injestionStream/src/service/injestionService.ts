import { Jetstream, type CursorStore } from '@bsky/jetstream'
import userHandler from '../postgresHandlers/userHandler.js';
import postsHandler from '../postgresHandlers/postsHandler.js';
import interactionsHandler from '../postgresHandlers/interactionsHandler.js';
import syncStateHandler from '../postgresHandlers/syncStateHandler.js';
import cursorHandler from '../postgresHandlers/cursorHandler.js';
import jetstreamEventhandler from '../postgresHandlers/jetstream_eventsHandler.js';

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

    const user_id = await userHandler(evt);

    if (evt.commit.collection === 'app.bsky.feed.post') {
      const post = await postsHandler(evt, user_id);
    }
    if (evt.commit.collection === 'app.bsky.feed.like') {
      const table = 'likes';
      const like = await interactionsHandler(evt, user_id, table);
    }
    if (evt.commit.collection === 'app.bsky.feed.repost') {
      const table = 'reposts';
      const repost = await interactionsHandler(evt, user_id, table);
    }

    const seq = await syncStateHandler(evt.seq);
    const event = await jetstreamEventhandler(evt, user_id);

    sequence = evt.seq;

  }
}
export default injestionService;