import express from "express";

import { cached, noCache } from "./route_handlers";
import { redisClient } from "./redis";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome! to Redis" });
});

app.get("/cached-posts", cached);

app.get("/posts", noCache);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await redisClient.connect().then(() => console.log("redis connected ..."));
  console.log(`Server is running on port ${PORT}`);
});

