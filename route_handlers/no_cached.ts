import axios from "axios";
import { Request,Response } from "express";

export const noCache = async (req:Request, res:Response) => {
    const posts = await axios.get("https://jsonplaceholder.typicode.com/posts");
  
    res.status(200).json({
      posts: posts.data,
    });
  }