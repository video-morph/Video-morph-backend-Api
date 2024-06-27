const Video = require("../Models/videoModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});


exports.uploadVideo = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: "No files were uploaded" });
    }

    const videoFile = req.files.video;

    // Check for the type of file user can upload to clodinary
    const filetypes = /mp4|avi|mkv|mov/;
    const extname = filetypes.test(path.extname(videoFile.name).toLowerCase());
    const mimetype = filetypes.test(videoFile.mimetype);

    if (!extname || !mimetype) {
      return res.status(400).json({ msg: "Error: Videos Only!" });
    }

    const uploadPath = path.join(__dirname, "../uploads", videoFile.name);

    videoFile.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message });
      };

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(uploadPath, {
          resource_type: "video",
          folder: "video",
        });

        

        // Save video details to database
        const upload = new Video({
          name: videoFile.name,
          url: result.url,
          cloudinary_id: result.public_id,
          description: req.body.description,
        });

        await upload.save();

        // Delete the file from the local server
        fs.unlinkSync(uploadPath);

        return res
          .status(200)
          .json({ message: "Video uploaded successfully", video: upload });
      } catch (uploadErr) {
        // Clean up file if Cloudinary upload fails
        fs.unlinkSync(uploadPath);
        return res
          .status(500)
          .json({ msg: uploadErr.message });
      }
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
