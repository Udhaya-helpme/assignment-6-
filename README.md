# assignment-6-
# Assignment 6 – Redis Queries on ieeevis2020 Tweets

## Setup

**1. Make sure MongoDB and Redis are running locally**

**2. Install dependencies**
```bash
npm install
```

## Running the Queries

```bash
node query1.js
node query2.js
node query3.js
node query4.js
node query5.js
```

## Queries

- **Query1** – Total number of tweets stored in a Redis `tweetCount` key using SET/INCR/GET
- **Query2** – Total number of favorites stored in a Redis `favoritesSum` key using SET/INCRBY/GET
- **Query3** – Number of distinct users stored in a Redis set called `screen_names`
- **Query4** – Top 10 users by tweet count stored in a Redis sorted set called `leaderboard`
- **Query5** – All tweet IDs per user stored in Redis lists (e.g. `tweets:screen_name`), with tweet details stored in hashes (e.g. `tweet:id_str`)
