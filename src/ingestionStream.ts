// npm install @bsky/jetstream
import { Jetstream } from '@bsky/jetstream'

const jetstream = new Jetstream('https://jetstream.us-east.bsky.network')
let count=0;
const collections={
  post:0,
  like:0,
  repost:0
};

 setInterval(()=>{
console.log("Total events are :", count);
console.log("The total Posts are: " ,collections.post);
console.log("The total Likes area: " ,collections.like);
console.log("The total Reposts are: " ,collections.repost);
  },5000)
  

for await (const evt of jetstream.live({
   collections: ['app.bsky.feed.post','app.bsky.feed.like','app.bsky.feed.repost'],
   kinds: ['commit'] 
  })) {
  if (evt.kind !== 'commit') continue

   let type:'post'|'repost'|'like';
   if(evt.commit.collection==='app.bsky.feed.like') type = 'like';
   else if (evt.commit.collection==='app.bsky.feed.post') type= 'post';
   else type='repost';

   if(type) collections[type]++;
    count++;

  console.log(`type: ${evt.commit.collection}, operation: ${evt.commit.operation}, time: ${evt.time}, `);
  if (evt.commit.collection === 'app.bsky.feed.post' && evt.commit.operation !== 'delete') {
  console.log(evt.commit.record.text)
  }

}
