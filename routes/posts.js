import express from "express";
import {getFeedPosts, getUserPosts, likePost} from "../controllers/posts.js" //importing controllers
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//READ 
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts); // grabbing only a specific user's posts

//UPDATE

router.patch("/:id/like", verifyToken, likePost);

export default router;




