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
    if (screenName) await redis.zIncrBy("leaderboard", 1, screenName);
  }

  const top10 = await redis.zRangeWithScores("leaderboard", 0, 9, { REV: true });
  console.log("Top 10 users by tweet count:");
  top10.forEach((entry, i) =>
    console.log(`${i + 1}. @${entry.value} — ${entry.score} tweets`)
  );

  await mongo.close();
  await redis.quit();
}

main().catch(console.error);
