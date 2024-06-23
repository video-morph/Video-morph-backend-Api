const Video = require("../Models/videoModel");
const cloudinary = require("cloudinary");
const upload = require("../Config/multer");
const fs = require("fs");
const path = require("path");

exports.uploadVideo = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const filePath = path.join(__dirname, "..", req.file.path);

      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "video",
        folder: "video",
      });
      
      // Remove the file after upload
      fs.unlinkSync(filePath); 

      const upload = new Video({
        name: req.file.originalname,
        url: result.url,
        cloudinary_id: result.public_id,
        description: req.body.description,
      });

      await upload.save();

      return res.status(200).json({ message: "Video uploaded successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  });
};
