const mongoose = require("mongoose");
const videoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    cloudinary_id: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  },
  { timestamp: true }
);

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
