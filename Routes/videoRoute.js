// videoRoute.js
const express = require("express");
const { uploadVideo } = require("../controller/VideoController");


const router = express.Router();

router.post("/upload", uploadVideo);

module.exports = router;

