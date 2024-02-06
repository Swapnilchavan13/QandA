// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 8002;

// MongoDB Connection
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ origin: '*' }));

const Video = require('./models/videoModel.js'); // Import the Video model

let currentVideoIndex = 0;

// Routes

app.get('/', (req, res) => {
  res.json('Hello All');
});

app.get('/api/all-videos', async (req, res) => {
  try {
    const allVideos = await Video.find();
    res.json(allVideos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/current-video', async (req, res) => {
  try {
    const { video_id } = req.query;

    let currentVideo;
    
    if (video_id) {
      currentVideo = await Video.findById(video_id);
    } else {
      currentVideo = await Video.findOne({});
    }

    if (currentVideo) {
      res.json(currentVideo);
    } else {
      res.status(404).json({ error: 'Video not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/add-video', async (req, res) => {
  try {
    const newVideo = new Video(req.body);
    await newVideo.save();

    res.status(201).json({ success: true, message: 'Video added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add video' });
  }
});

app.put('/api/update-video-state', async (req, res) => {
  const { video_id, state, currentTime } = req.body;

  try {
    const video = await Video.findOneAndUpdate(
      { video_id: video_id },
      { $set: { state: state, currentTime: state === 'false' ? currentTime : 0 } },
      { new: true }
    );

    if (video) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Video not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/api/next-video', async (req, res) => {
  try {
    const videos = await Video.find({});
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    const nextVideo = videos[currentVideoIndex];
    res.json(nextVideo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/previous-video', async (req, res) => {
  try {
    const videos = await Video.find({});
    currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    const previousVideo = videos[currentVideoIndex];
    res.json(previousVideo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});