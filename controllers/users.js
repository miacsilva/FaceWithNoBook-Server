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
        const {id, friendId} = req.params;
        const user = await User.findById(id); //grabbing the current user
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)) { // if the friend is already added (if its included), it will be removed
            user.friend= user.friends.filter((id) => id !== friendId) // removing friend by filtering in case the id of "friend" matches the id of "friendsId", in other words, if they are friends
            friend.friends = user.friends.filter((id) => id !== id) // removing also on the friend's db ou "friend.friends = friend.friends.filter((id) => id !== friendId);"
            
        } else { //adding  

            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map( //"formatedFriends" is turning the needed info into a obj to send to the frontend 
            ({ _id, firstName, lastName, occupation, location, picturePath }) =>{
                return {  _id, firstName, lastName, occupation, location, picturePath}
            }
        );
        logger.info("Request processed successfully");
        res.status(200).json(formattedFriends);
        
    } catch (error) {
        logger.error(`An error occurred: ${error.message}`);
        console.error(error);
        res.status(404).json({ message: error.message});
    }
}