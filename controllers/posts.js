import Post from "../models/Post.js";
import User from "../models/User.js";
import logger from "../logger.js";

//CREATE

export const createPost = async (req, res) => {
   
    logger.debug("0 Request processed successfully");
  try {
    const { userId, description, picturePath } = req.body; // the frontend is going to send this data
    

    const user = await User.findById(userId); //getting user info
   

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.PicturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    

    await newPost.save();
    

    const post = await Post.find(); //return updated list of all posts with the new added on
  
    res.status(201).json({
      message: "Post created successfully",
      post, 
    });
  } catch (error) {
    
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//READ

export const getFeedPosts = async (req, res) => {
   
  try {

    console.log("Success: Hello Server!");
    
    const post = await Post.find();

    
    res.status(200).json(post);
  } catch (error) {
   
    console.debug(error);
    res.status(404).json({ message: error.message });
  }
};





export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    

    const post = await Post.find({ userId });
    
    
    res.status(200).json(post);
  } catch (error) {

   
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

//UPDATE

export const likePost = async (req, res) => {
    //logger.debug("8 Request processed successfully");
  try {
    const { id } = req.params;
  
    const { userId } = req.body;
   
    const post = await Post.findById(id); //grabbing post info
   
    const isLiked = post.likes.get(userId); // checking is the likes if the userId exists, if so, that person liked the post
   

    if (isLiked) {
      post.likes.delete(userId); //if it's liked here the like is deleted
      
    } else {
      post.likes.set(userId, true); //the like is set if it wasn't before
      
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    

    res.status(200).json(updatedPost); //updating frontend

  } catch (error) {

    //logger.debug(`17 An error occurred: ${error.message}`);
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};
