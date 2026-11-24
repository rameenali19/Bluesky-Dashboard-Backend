import { Jetstream, type CursorStore } from '@bsky/jetstream'
import batchProcessor from '../batchProcessor/batchProcessor.js';
import cursorHandler from '../postgresHandlers/cursorHandler.js';

const eventArr: any[] = [];

export async function injestionService() {

  const jetstream = new Jetstream('https://jetstream.us-east.bsky.network');

  let sequence: number | undefined;
  sequence = await cursorHandler();

  const cursor: CursorStore = {
    load: async () => sequence,   // number | undefined
    save: async (seq: number) => { sequence = seq },
  }
  let time = Date.now();
  let isInserting = false;

  for await (const evt of jetstream.live({
    collections: ['app.bsky.feed.post', 'app.bsky.feed.like', 'app.bsky.feed.repost'],
    kinds: ['commit'], cursor,
  })) {

    if (evt.kind !== 'commit') continue;

    eventArr.push(evt);

    const length = eventArr.length;
    const TwoMinute = Date.now() - time >= 120000;

    if ((length >= 500 || (length > 0 && TwoMinute)) && !isInserting) {
      isInserting = true;

      const batch = eventArr.splice(0, Math.min(500, length));

      batchProcessor(batch)

        .catch((error) => {
          console.log("Insertion failed: ", error);
          eventArr.unshift(...batch);
        })
        .finally(() => {
          isInserting = false
          time = Date.now();
        })
    }

    sequence = evt.seq;

  }
}