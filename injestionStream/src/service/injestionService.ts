import { Jetstream, type CursorStore } from '@bsky/jetstream'
import batchProcessor from '../batchProcessor/batchProcessor.js';
import cursorHandler from '../postgresHandlers/cursorHandler.js';

const eventArr: any[] = [];

export async function injestionService() {

  const jetstream = new Jetstream('https://jetstream.us-east.bsky.network');

  let isInserting = false;
  let sequence: number | undefined;
  sequence = await cursorHandler();

  const cursor: CursorStore = {
    load: async () => sequence,   // number | undefined
    save: async (seq: number) => { sequence = seq },
  }

  setInterval(() => {

    const length = eventArr.length;

    if (length < 500 && length > 0 && !isInserting) {
      isInserting = true;

      const batch = eventArr.splice(0, length);

      batchProcessor(batch)

        .catch((error) => {
          console.log("Insertion failed: ", error);
          eventArr.unshift(...batch);
        })
        .finally(() => {
          isInserting = false
        })
    }

  }, 120000);


  for await (const evt of jetstream.live({
    collections: ['app.bsky.feed.post', 'app.bsky.feed.like', 'app.bsky.feed.repost'],
    kinds: ['commit'], cursor,
  })) {

    if (evt.kind !== 'commit') continue;

    eventArr.push(evt);

    const length = eventArr.length;

    if (length >= 500 && !isInserting) {
      isInserting = true;

      const batch = eventArr.splice(0, Math.min(500, length));

      batchProcessor(batch)

        .catch((error) => {
          console.log("Insertion failed: ", error);
          eventArr.unshift(...batch);
        })
        .finally(() => {
          isInserting = false
        })
    }

    sequence = evt.seq;

  }
}