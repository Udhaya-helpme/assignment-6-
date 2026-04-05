const { MongoClient } = require("mongodb");
const { createClient } = require("redis");

const URI = "mongodb://localhost:27017";
const mongo = new MongoClient(URI);
const redis = createClient();

async function main() {
  await mongo.connect();
  await redis.connect();

  const col = mongo.db("ieeevisTweets").collection("tweet");

  await redis.set("favoritesSum", 0);

  const cursor = col.find({});
  for await (const tweet of cursor) {
    const favs = tweet.favorite_count || 0;
    if (favs > 0) await redis.incrBy("favoritesSum", favs);
  }

  const total = await redis.get("favoritesSum");
  console.log(`Total favorites: ${total}`);

  await mongo.close();
  await redis.quit();
}

main().catch(console.error);
