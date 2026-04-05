const { MongoClient } = require("mongodb");
const { createClient } = require("redis");

const URI = "mongodb://localhost:27017";
const mongo = new MongoClient(URI);
const redis = createClient();

async function main() {
  await mongo.connect();
  await redis.connect();

  const col = mongo.db("ieeevisTweets").collection("tweet");

  const cursor = col.find({});
  for await (const tweet of cursor) {
    const screenName = tweet.user?.screen_name;
    if (screenName) await redis.sAdd("screen_names", screenName);
  }

  const count = await redis.sCard("screen_names");
  console.log(`Distinct users: ${count}`);

  await mongo.close();
  await redis.quit();
}

main().catch(console.error);
