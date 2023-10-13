import * as redis from "redis";
import dotenv from "dotenv"
dotenv.config();

const redisUrl: string =process.env.REDIS_URL!;

export const redisClient = redis.createClient({
  url: redisUrl,
});

redisClient.on("error", (error: any) => console.error(`Error : ${error}`));
;
