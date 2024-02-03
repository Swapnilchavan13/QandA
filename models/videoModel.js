// videoModel.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  video_id: Number,
  video: String,
  Date_time: Date,
  show_id: String,
  video_type: String,
  question_type: String,
  question: String,
  question_id: String,
  options: {
    option_1: String,
    option_2: String,
    option_3: String,
  },
  image: { type: String, default: null },
  state: String,
  currentTime: Number,
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
