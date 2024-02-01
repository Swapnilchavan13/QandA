const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors'); // Import the cors middleware

const port = 8001;

app.use(bodyParser.json());
app.use(cors());

let videos = [
  {
    video_id: 1,
    video:"https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    Date_time: new Date(),
    show_id: 'id_of_show_1',
    video_type: 'Ad',
    question_type: 'image',
    question: 'Did You Like The AD?',
    question_id: 'id_of_question_1',
    options: {
      option_1: 'Yes',
      option_2: 'No',
      option_3: 'Not Sure',
    },
    image: 'image_name_1',
    state: 'false',
    currentTime:0,

  },
  {
    video_id: 2,
    video:"https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    Date_time: new Date(),
    show_id: 'id_of_show_2',
    video_type: 'Content',
    question_type: 'text',
    question: 'Did You Like This Movie?',
    question_id: 'id_of_question_2',
    options: {
      option_1: 'Yes 2',
      option_2: 'No 2',
      option_3: 'Not Sure 2',
    },
    image: null,
    state: 'false',
    currentTime:0,

  },
  {
    video_id: 3,
    Date_time: new Date(),
    video:"https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    show_id: 'id_of_show_3',
    video_type: 'Content',
    question_type: 'text',
    question: 'Do you want to watch it again?',
    question_id: 'id_of_question_3',
    options: {
      option_1: 'Yes 3',
      option_2: 'No 3',
      option_3: 'Not Sure 3',
    },
    image: null,
    state: 'false',
    currentTime:0,
    },
];

let currentVideoIndex = 0;

app.get('/', (req, res) => {
  res.json("Hello All");
});

app.get('/api/current-video', (req, res) => {
  const currentVideo = videos[currentVideoIndex];
  res.json(currentVideo);
});


app.put('/api/update-video-state', (req, res) => {
  const { video_id, state, currentTime } = req.body;

  const videoIndex = videos.findIndex(video => video.video_id === video_id);
  if (videoIndex !== -1) {
    videos[videoIndex].state = state;
    if (state === 'false') {
      videos[videoIndex].currentTime = currentTime;
    }
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Video not found' });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
