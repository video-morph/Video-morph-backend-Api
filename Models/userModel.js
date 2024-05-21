const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
   
  },
  displayName: {
    type: String,
   
  },
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isVerified:{
    type: Boolean,
    default:false
  },
  verificationToken:{
    type: String
  },
 resetToken:{
  type:String
  },
 resetTokenExpiration:{
  type: Date
  },
  secret:{
    type: Number,
    default: undefined
  },
  password: {
    type: String,
    required: true, 
  },
  twoFactorVerified:{
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});




const User = mongoose.model("User", userSchema);

module.exports = User;