import axios from "axios";
import express ,{Request,Response}from "express";
import * as redis from "redis";
import dotenv from "dotenv";
import { redisClient } from "../redis";
dotenv.config()

interface Iposts{
    userId:number,
    id: number,
    title:string,
    body:string
}




export const cached = async (req:Request, res:Response) => {
    try {
      const cacheKey = "poster";
      const cacheTimeInSeconds= 3600;
      let isCached = false;
      let results:{data:Iposts[]};
      const cacheResults = await redisClient.get(cacheKey);
  
  
      if (cacheResults) {
        isCached = true;
        results = JSON.parse(cacheResults);
        res.status(200).json({
          fromCache: isCached,
          posts: results,
        });
  
  
      } else {
        results = await axios.get("https://jsonplaceholder.typicode.com/posts");
        if (results.data.length === 0) {
          throw "API returned an empty array";
        }
        await redisClient.set(cacheKey, JSON.stringify(results.data));
        await redisClient.expire(cacheKey, cacheTimeInSeconds);
  
        res.status(200).json({
          fromCache: isCached,
          posts: results.data,
        });
      }
    } catch (error: any) {
      res.status(500).json({ Error: "Internal Server Error " + error.message });
    }
  }