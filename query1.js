const { MongoClient } = require("mongodb");
const { createClient } = require("redis");

const URI = "mongodb://localhost:27017";
const mongo = new MongoClient(URI);
const redis = createClient();

async function main() {
  await mongo.connect();
  await redis.connect();

  const col = mongo.db("ieeevisTweets").collection("tweet");

  await redis.set("tweetCount", 0);

  const cursor = col.find({});
  for await (const tweet of cursor) {
    await redis.incr("tweetCount");
  }

  const count = await redis.get("tweetCount");
  console.log(`There were ${count} tweets`);

  await mongo.close();
  await redis.quit();
}

main().catch(console.error);
