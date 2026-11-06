// npm install @bsky/jetstream
import { Jetstream, type CursorStore } from '@bsky/jetstream'
import userHandler from '../handler/user_handler.js';

async function ingestionStream() {

  const jetstream = new Jetstream('https://jetstream.us-east.bsky.network')
  let sequence: number | undefined;

  const cursor: CursorStore = {
    load: async () => sequence,   // number | undefined
    save: async (seq) => { sequence = seq },
  }

  for await (const evt of jetstream.live({
    collections: ['app.bsky.feed.post', 'app.bsky.feed.like', 'app.bsky.feed.repost'],
    kinds: ['commit'], cursor
  })) {
    if (evt.kind !== 'commit') continue;

    await userHandler(evt);
    sequence = evt.seq;

  }
}
export default ingestionStream;