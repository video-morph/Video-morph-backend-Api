// videoRoute.js
const express = require("express");
const { uploadVideo } = require("../controller/VideoController");
const { requireAuth } = require("../Middleware/loginMiddleware")

const router = express.Router();

router.post("/upload", requireAuth, uploadVideo);

module.exports = router;

