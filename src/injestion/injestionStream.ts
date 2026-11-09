import { Jetstream, type CursorStore } from '@bsky/jetstream'
import userHandler from '../handler/user_handler.js';
import postsHandler from '../handler/posts_handler.js';
import interactionsHandler from '../handler/interactions_handler.js';
import syncStateHandler from '../handler/sync_state_handler.js';
import cursorService from '../config/services/cursor_service.js';
import jetstreamEventhandler from '../handler/jetstream_events_handler.js';

async function ingestionStream() {

  const jetstream = new Jetstream('https://jetstream.us-east.bsky.network');
  let sequence : number | undefined;
   sequence = await cursorService();

  const cursor: CursorStore = {
    load: async () => sequence,   // number | undefined
    save: async (seq) => { sequence = seq },
  }

  for await (const evt of jetstream.live({
    collections: ['app.bsky.feed.post', 'app.bsky.feed.like', 'app.bsky.feed.repost'],
    kinds: ['commit'], cursor,
  })) {
    
    if (evt.kind !== 'commit') continue;

   const user_id = await userHandler(evt);

    if (evt.commit.collection==='app.bsky.feed.post'){
    const post = await postsHandler(evt,user_id);
    }
    if (evt.commit.collection==='app.bsky.feed.like'){
    const table = 'likes';
    const like = await interactionsHandler(evt,user_id,table);
    }
    if (evt.commit.collection==='app.bsky.feed.repost'){
    const table = 'reposts';
    const repost = await interactionsHandler(evt,user_id,table);
    }

    const seq = await syncStateHandler(evt.seq);
    const event = await jetstreamEventhandler(evt,user_id);
    
    sequence = evt.seq;

  }
}
export default ingestionStream;