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
    const tweetId = tweet.id_str;
    if (!screenName || !tweetId) continue;

    await redis.rPush(`tweets:${screenName}`, tweetId);

    await redis.hSet(`tweet:${tweetId}`, {
      user_name: tweet.user?.name || "",
      screen_name: screenName,
      text: tweet.text || "",
      created_at: tweet.created_at || "",
      favorite_count: String(tweet.favorite_count || 0),
      retweet_count: String(tweet.retweet_count || 0),
    });
  }

  // Demo: print tweets for the first user found
  const firstKey = await redis.keys("tweets:*");
  if (firstKey.length > 0) {
    const user = firstKey[0].replace("tweets:", "");
    const ids = await redis.lRange(`tweets:${user}`, 0, -1);
    console.log(`\nTweets for @${user}: [${ids.join(", ")}]`);
    const details = await redis.hGetAll(`tweet:${ids[0]}`);
    console.log(`\nDetails for tweet ${ids[0]}:`, details);
  }

  await mongo.close();
  await redis.quit();
}

main().catch(console.error);
