import jwt from "jsonwebtoken";
import logger from "../logger.js";


//this next "verifyToken" variable will be used as a middleware to any action only allowed for users that are logged in

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

       /*  logger.debug(" 10 Request processed successfully", {token}); */

        if (!token){
        
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer ")){
           
            token= token.slice(7, token.length ).trimLeft(); //Here I only keep the token number on the token variable
            
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
       
        req.user = verified;
        

        next();
       
        
    } catch (error) {
        logger.debug(" 17 Request processed successfully" , { error: error.message, error: error.stack});
        res.status(500).json({ error: error.message})
    }
}