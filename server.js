require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")
const session = require("express-session")
const morgan = require("morgan");
const passport = require("passport")
const cookieParser = require("cookie-parser")
const MONGO_URL = process.env.MONGO_URL
const userRouter = require("./Routes/userRoute")
const auth = require("./Routes/auth");
const videoRoute = require("./Routes/videoRoute")
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path")

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const app = express();

// passport config
require("./Config/passport")(passport);


// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 

//middleware
app.use(morgan("dev"))
  

// middleware for cookie
app.use(cookieParser());


 //Session
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: true,
})) 

//passport middleware
app.use(passport.initialize())
app.use(passport.session()) 

//Route
app.use("/user", userRouter);
app.use("/auth", auth);
app.use("/video", videoRoute)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// connecting to the database & port
(async() => {
 try {  await mongoose.connect(MONGO_URL);
 console.log(`Successfully connected to the database`);

 const port = process.env.PORT; 
 app.listen(port, () => { 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
 })
    
 } catch (err) {
    console.error("Error connecting to the database")
 }

})();