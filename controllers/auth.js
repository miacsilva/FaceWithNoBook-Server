import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

//Register user
export const register = async (req, res) =>{
    try {
        const{
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt(); // using the salt to encrypt the password
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile:  Math.floor(Math.random()*10000), //random number, not real 
            impressions:  Math.floor(Math.random()*10000),  //random number, not real
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser) //code 201 indicates that a new resource has been successfully created as a result of the client's request

    } catch (error) {
        res.status(500).json({error: error.message}) // I'm returning what mongoDB returns
    }
};

//LOGIN

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user) return res.status(400).json({msg: "User does not exist."});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)  return res.status(400).json({msg: "Invalid credentials."});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({token, user});
    }

    catch(error){
        console.error(error)
        res.status(500).json({ error: error.message})
    }
}
