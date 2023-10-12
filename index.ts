import axios from "axios";
import express from "express";
import * as redis from "redis";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const redisUrl: string ="redis://localhost:6379";

const redisClient = redis.createClient({
  url: redisUrl,
});

redisClient.on("error", (error: any) => console.error(`Error : ${error}`));

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome!" });
});

app.get("/cached-users", async (req, res) => {
  try {
    const cacheKey = "users";
    let isCached = false;
    let results: any;
    const cacheResults = await redisClient.get(cacheKey);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await axios.get("https://jsonplaceholder.typicode.com/users");
      if (results.data.length === 0) {
        throw "API returned an empty array";
      }
      await redisClient.set(cacheKey, JSON.stringify(results.data));
    }

    res.status(200).json({
      fromCache: isCached,
      users: results,
    });
  } catch (error: any) {
    res.status(500).json({ Error: "Internal Server Error " + error.message });
  }
});

app.get("/users", async (req, res) => {
  const users = await axios.get("https://jsonplaceholder.typicode.com/users");

  res.status(200).json({
    data: users.data,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await redisClient.connect()
  .then(() => 
  console.log("redis connected ..."));
  console.log(`Server is running on port ${PORT}`);
});
