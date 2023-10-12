import axios from "axios";
import express from "express";
import redis from "redis";

const app = express();

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome!" });
});


app.get("/users", async(req, res) => {
try {
    const users = await axios.get("https://jsonplaceholder.typicode.com/users")
    return res.status(200).json({ message: "Welcome!" });

} catch (error) {
    res.status(500).json({Error:"Internal Server Error " + error.message});
} 
 });
    
 const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
 });