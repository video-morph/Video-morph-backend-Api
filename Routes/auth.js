const express = require("express");
const passport = require("passport")
const router = express.Router();

//@desc Auth with google
//@ route GET/ auth/gooogle
router.get("/google", passport.authenticate("google",  { scope: ["profile"]}));


//@desc Google auth callback
//@route GET /google/callback
router.get("/google/callback", passport.authenticate("google", { 
    failureRedirect: "/"
}), (req, res) => {
    res.send("success")
});


//@desc Logout user
//@route /auth/logout 


router.get("/logout", (req, res) => {
    req.logout();
})
module.exports = router;
