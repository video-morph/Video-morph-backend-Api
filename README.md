Backend API Documentation
Overview
This backend application provides user authentication, video upload, and video transcoding functionalities. It is built using Node.js, Express, Mongoose, and Passport.js with Google OAuth 2.0 for authentication. The videos are uploaded to Cloudinary, and user data is stored in a MongoDB database.

Project Structure
bash
Copy code
.
├── Config
│   └── passport.js
├── Controllers
│   ├── userController.js
│   └── videoController.js
├── Middleware
│   └── loginMiddleware.js
├── Models
│   ├── userModel.js
│   └── videoModel.js
├── Routes
│   ├── auth.js
│   ├── userRoute.js
│   └── videoRoute.js
├── server.js
├── .env
├── package.json
└── README.md
Routes
User Routes
POST /user/signup
Registers a new user.

Request Body:
json
Copy code
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "password2": "password123"
}
Response:
json
Copy code
{
  "message": "Verification email sent.",
  "verificationToken": "token"
}
POST /user/verify
Verifies a user's email.

Request Body:
json
Copy code
{
  "verificationToken": "token"
}
Response:
json
Copy code
{
  "message": "Email verified successfully"
}
POST /user/login
Logs in a user.

Request Body:
json
Copy code
{
  "email": "john.doe@example.com",
  "password": "password123",
  "secret": "123456"
}
Response:
json
Copy code
{
  "message": "A token has been sent to your mail",
  "newSecret": "654321",
  "token": "jwt_token"
}
POST /user/verify-token
Verifies the two-factor authentication token.

Request Body:
json
Copy code
{
  "secret": "654321"
}
Response:
json
Copy code
{
  "message": "Login successful",
  "token": "jwt_token"
}
POST /user/forgot-password
Sends a password reset link to the user's email.

Request Body:
json
Copy code
{
  "email": "john.doe@example.com"
}
Response:
json
Copy code
{
  "message": "Password reset link sent",
  "resetToken": "token"
}
POST /user/reset-password
Resets the user's password.

Request Body:
json
Copy code
{
  "email": "john.doe@example.com",
  "resetToken": "token",
  "newPassword": "newpassword123"
}
Response:
json
Copy code
{
  "message": "Password reset successful"
}
GET /user/logout
Logs out the user.

Response:
json
Copy code
{
  "message": "Logout successful"
}
Video Routes
POST /video/upload
Uploads a video and transcodes it.

Request Body:
video: The video file to be uploaded (multipart/form-data)
description: Description of the video (optional)
Response:
json
Copy code
{
  "message": "Video uploaded successfully",
  "video": {
    "name": "video_name.mp4",
    "url": "https://cloudinary.com/video_url",
    "cloudinary_id": "cloudinary_id",
    "description": "Video description",
    "transcoded_videos": [
      {
        "format": "mp4",
        "url": "https://cloudinary.com/video_url.mp4"
      },
      {
        "format": "webm",
        "url": "https://cloudinary.com/video_url.webm"
      }
    ]
  }
}
Auth Routes
GET /auth/google
Initiates Google OAuth 2.0 authentication.

GET /auth/google/callback
Handles Google OAuth 2.0 callback and logs in the user.

Response:
json
Copy code
{
  "message": "success"
}
GET /auth/logout
Logs out the user.

Models
User Model
javascript
Copy code
const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetToken: String,
  resetTokenExpiration: Date,
  secret: { type: Number, default: undefined },
  password: { type: String, required: true },
  twoFactorVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
Video Model
javascript
Copy code
const videoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  cloudinary_id: { type: String, required: true },
  description: String,
  transcodedVideos: String
}, { timestamp: true });
Middleware
requireAuth Middleware
Ensures that the user is authenticated before allowing access to protected routes.

javascript
Copy code
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
Controllers
User Controller
Handles user registration, email verification, login, two-factor authentication, password reset, and logout functionalities.

Video Controller
Handles video upload, transcoding, and storage in Cloudinary.

Passport Configuration
Google OAuth 2.0 Strategy
Handles Google OAuth 2.0 authentication.

javascript
Copy code
const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    // Logic to handle user authentication with Google
  }
));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
Server Setup
server.js
Sets up the Express server, middleware, routes, and database connection.

javascript
Copy code
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const morgan = require("morgan");
const passport = require("passport");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const userRouter = require("./Routes/userRoute");
const authRouter = require("./Routes/auth");
const videoRouter = require("./Routes/videoRoute");

const app = express();

// Passport configuration
require("./Config/passport")(passport);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/video", videoRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database connection and server start
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Successfully connected to the database`);
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to the database");
  }
})();