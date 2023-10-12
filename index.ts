import axios from "axios";
import express from "express";
import redis from "redis";

const app = express();

let redisClient;

(async () => {
    redisClient = redis.createClient();
  
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
  
    await redisClient.connect();
  })();

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome!" });
});


app.get("/cached-users", async(req, res) => {
try {
const cacheKey = "users";
let isCached;
let results;
const cacheResults = await redisClient.get(cacheKey);
if (cacheResults) {
  isCached = true;
  results = JSON.parse(cacheResults);
} else {
  results = await axios.get("https://jsonplaceholder.typicode.com/users");
  if (results.length === 0) {
    throw "API returned an empty array";
  }
  await redisClient.set(cacheKey, JSON.stringify(results));
}

res.send({
  fromCache: isCached,
  data: results,
});

} catch (error) {
    res.status(500).json({Error:"Internal Server Error " + error.message});
} 
 });

 app.get("/users",()=>{
    
 })
    
 const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
 });