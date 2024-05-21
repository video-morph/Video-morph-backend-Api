const express = require("express");
const router = express.Router();
const {
  register,
  accountVerification,
  verify,
  forgotPassword,
  resetPassword,
  login,
  logout,
} = require("../controller/userController");



router.post("/signup", register);
 router.post("/verify", accountVerification);
 router.post("/verify-token", verify)

//forgot and reset password link
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword)

//login and logout route
router.post("/login", login);
router.get("/logout", logout); 
module.exports = router;  