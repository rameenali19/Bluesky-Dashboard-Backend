import { Jetstream, type CursorStore } from '@bsky/jetstream'
import userHandler from '../handler/user_handler.js';
import postsHandler from '../handler/posts_handler.js';
import interactionsHandler from '../handler/interactions_handler.js';

async function ingestionStream() {

  const jetstream = new Jetstream('https://jetstream.us-east.bsky.network')
  let sequence: number | undefined;

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
    const post_uri = await postsHandler(evt,user_id);
    }
    if (evt.commit.collection==='app.bsky.feed.like'){
    const table = 'likes';
    const res = await interactionsHandler(evt,user_id);
    }
    if (evt.commit.collection==='app.bsky.feed.repost'){
    const table = 'reposts';
    const res = await interactionsHandler(evt,user_id);
    }

    sequence = evt.seq;

  }
}
export default ingestionStream;