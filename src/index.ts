// npm install @bsky/jetstream
import { Jetstream } from '@bsky/jetstream'

const jetstream = new Jetstream('https://jetstream.us-east.bsky.network')
let count=0;
const eventNumber=100;
const collections: Record<string,number>={
  'app.bsky.feed.post':0,
  'app.bsky.feed.like':0,
  'app.bsky.feed.repost':0
};

for await (const evt of jetstream.live({
   collections: ['app.bsky.feed.post','app.bsky.feed.like','app.bsky.feed.repost'],
   kinds: ['commit'] 
  })) {
  if (evt.kind !== 'commit') continue
   const type = evt.commit?.collection ;
   if(type) collections[type]++;
    count++;
    if(count>=eventNumber) break;

  console.log(evt.commit.collection);
}

console.log("Stream finished and total events are :", count);
console.log("The total likes are: " ,collections['app.bsky.feed.post']);
console.log("The total likes are: " ,collections['app.bsky.feed.like']);
console.log("The total likes are: " ,collections['app.bsky.feed.repost']);