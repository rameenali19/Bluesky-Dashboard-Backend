import { Jetstream } from '@bsky/jetstream'

const jetstream = new Jetstream('https://jetstream.us-east.bsky.network')

for await (const evt of jetstream.live({ collections: ['app.bsky.feed.post'] })) {
  if (evt.kind === 'commit' && evt.commit.operation === 'create') {
    console.log(evt.commit.collection, evt.commit.record)
  }
}