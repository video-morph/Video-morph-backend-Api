const mongoose = require("mongoose");
const videoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    url: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
    description: {
      type: String
    }
  },
  { timestamp: true }
);

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
