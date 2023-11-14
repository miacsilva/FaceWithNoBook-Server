import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import logger from "./logger.js";


const __filename = fileURLToPath(import.meta.url); //expression for me to grab the file URL
const __dirname = path.dirname(__filename); //this line and line 12 is only needed because I'm using type "modules"

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // setting the directory on where I keep my images (I store them locally)


//FILE STORAGE
//When someone saves a file it stores them into the "/public/assets" destination
//Following code is from Multer Repo

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // I will use this variable when uploading a file

//Routes w/ files = registation and creating posts

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost); // the "upload.single("picture")" is grabbing the pictures with it is uploaded from the frontend and uploading it

//Routes

app.use("/auth", authRoutes); // setting auth routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);



//MONGOOSE SETUP
const PORT = process.env.PORT || 3001 || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* User.insertMany(users); //inserting manually data
    Post.insertMany(posts); //inserting manually data */
  })
  .catch((error) => console.log(`${error} did not connect`));
