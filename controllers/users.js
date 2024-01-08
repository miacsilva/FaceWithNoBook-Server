import User from "../models/User.js";
import logger from "../logger.js";

//READ

export const getUser = async (req, res) => {
    try {
        
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch (error) {
        logger.error(`An error occurred: ${error.message}`);
        console.error(error)
        res.status(404).json({ message: error.message});
        
    }
}; 

export const getUserFriends = async (req, res) => {

    try {

        const {id} = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map( //"formatedFriends" is turning the needed info into a obj to send to the frontend 
            ({ _id, firstName, lastName, occupation, location, picturePath }) =>{
                return {  _id, firstName, lastName, occupation, location, picturePath}
            }
        );
        logger.info("Request processed successfully");
        res.status(200).json(formattedFriends)

    } catch (error) {
        logger.error(`An error occurred: ${error.message}`);
        console.error(error)
        res.status(404).json({ message: error.message});
    }

};

//UPDATE

export const addRemoveFriend = async (req, res) => {
    try {
      const { id, friendId } = req.params;
  
      // fetch the current user and the friend
      const user = await User.findById(id);
      const friend = await User.findById(friendId);
  
      if (!user || !friend) {
        // if either user or friend is not found
        return res.status(404).json({ message: "User or friend not found" });
      }

     /*    // Check if the friend ID is the same as the current user's ID
    if (user._id.toString() === friendId) {
        return res.status(400).json({ message: "Cannot add yourself as a friend" });
      } */
  
      if (user.friends.includes(friendId)) {
        // if the friend is already added, remove them
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) => id !== id); // This line had a typo, corrected it to friendId
  
      } else {
        // if the friend is not added, add them
        user.friends.push(friendId);
        friend.friends.push(id);
      }
  
      // save changes to the database
      await user.save();
      await friend.save();
  
      // fetch and format the updated list of friends
      const updatedFriends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
  
      const formattedFriends = updatedFriends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => ({
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        })
      );
  
      logger.info("Request processed successfully");
      res.status(200).json(formattedFriends);
  
    } catch (error) {
      logger.error(`An error occurred: ${error.message}`);
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };