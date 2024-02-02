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
    video:"https://vod-progressive.akamaized.net/exp=1706867390~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4678%2F6%2F173394975%2F560155890.mp4~hmac=475a5f3ded9982ca11195c3704665266d2f27bb81fe0f4115311f2dfee83a4a4/vimeo-prod-skyfire-std-us/01/4678/6/173394975/560155890.mp4",
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
    video:"https://vod-progressive.akamaized.net/exp=1706867300~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F2150%2F8%2F210754025%2F722786080.mp4~hmac=6bbbcb411905cee67f397edd1abdad5c5a3fac7d6ef368cc9da99850eea97f90/vimeo-prod-skyfire-std-us/01/2150/8/210754025/722786080.mp4",
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

app.get('/api/next-video', (req, res) => {
  currentVideoIndex = (currentVideoIndex + 1) % videos.length;
  const nextVideo = videos[currentVideoIndex];
  res.json(nextVideo);
});

app.get('/api/previous-video', (req, res) => {
  currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
  const previousVideo = videos[currentVideoIndex];
  res.json(previousVideo);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
