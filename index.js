// // server.js

// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const cors = require('cors');

// const app = express();
// const port = 8002;

// // MongoDB Connection
// mongoose.set('strictQuery', false);

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(cors({ origin: '*' }));

// const Video = require('./models/videoModel.js'); // Import the Video model

// let currentVideoIndex = 0;

// // Routes

// app.get('/', (req, res) => {
//   res.json('Hello All');
// });

// app.get('/api/all-videos', async (req, res) => {
//   try {
//     const allVideos = await Video.find();
//     res.json(allVideos);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.get('/api/current-video', async (req, res) => {
//   try {
//     const { video_id } = req.query;

//     let currentVideo;
    
//     if (video_id) {
//       currentVideo = await Video.findById(video_id);
//     } else {
//       currentVideo = await Video.findOne({});
//     }

//     if (currentVideo) {
//       res.json(currentVideo);
//     } else {
//       res.status(404).json({ error: 'Video not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.post('/api/add-video', async (req, res) => {
//   try {
//     const newVideo = new Video(req.body);
//     await newVideo.save();

//     res.status(201).json({ success: true, message: 'Video added successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Failed to add video' });
//   }
// });

// app.put('/api/update-video-state', async (req, res) => {
//   const { video_id, state, currentTime } = req.body;

//   try {
//     const video = await Video.findOneAndUpdate(
//       { video_id: video_id },
//       { $set: { state: state, currentTime: state === 'false' ? currentTime : 0 } },
//       { new: true }
//     );

//     if (video) {
//       res.json({ success: true });
//     } else {
//       res.json({ success: false, message: 'Video not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// });

// app.get('/api/next-video', async (req, res) => {
//   try {
//     const videos = await Video.find({});
//     currentVideoIndex = (currentVideoIndex + 1) % videos.length;
//     const nextVideo = videos[currentVideoIndex];
//     res.json(nextVideo);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.get('/api/previous-video', async (req, res) => {
//   try {
//     const videos = await Video.find({});
//     currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
//     const previousVideo = videos[currentVideoIndex];
//     res.json(previousVideo);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// connectDB().then(() => {
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// });


const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 8010;

// MySQL Connection
const Connection = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: "Swapnil@123",
  database: 'Firstdb',
});

Connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ origin: '*' }));

Connection.query('SELECT * FROM Videodata', (err, results) => {
app.get('/', (req, res) => {
  res.json('Hello All');
});

app.get('/api/allVideos', (req, res) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/current-video', (req, res) => {
  const { video_id } = req.query;

  let query = 'SELECT * FROM video_table';
  if (video_id) {
    query += ` WHERE video_id = ${Connection.escape(video_id)}`;
  }

  Connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Video not found' });
    }
  });
});

// POST endpoint to save scheduler data
app.post('/api/saveSchedulerData', (req, res) => {
  const schedulerData = req.body;

  // Convert video links array to JSON string
  schedulerData.video_links = JSON.stringify(schedulerData.video_links);

  // Insert data into the MySQL table
  Connection.query('INSERT INTO scheduler_data1 SET ?', schedulerData, (err, result) => {
    if (err) {
      console.error('Error saving data to MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Data saved to MySQL:', result);
      res.status(200).json({ success: true });
    }
  });
});


// Update the route to handle form data
app.post('/api/add-video', (req, res) => {
  const {
    video,
    Date_time,
    show_id,
    video_type,
    question_type,
    question,
    video_id,
    question_id,
    options_option_1,
    options_option_2,
    options_option_3,
    image,
    state,
    currentTime,
  } = req.body;

  const query = `
    INSERT INTO Videodata (
      video_id,
      video,
      Date_time,
      show_id,
      video_type,
      question_type,
      question,
      question_id,
      options_option_1,
      options_option_2,
      options_option_3,
      image,
      state,
      currentTime
    ) VALUES (
      ${Connection.escape(video_id)},
      ${Connection.escape(video)},
      ${Connection.escape(Date_time)},
      ${Connection.escape(show_id)},
      ${Connection.escape(video_type)},
      ${Connection.escape(question_type)},
      ${Connection.escape(question)},
      ${Connection.escape(question_id)},
      ${Connection.escape(options_option_1)},
      ${Connection.escape(options_option_2)},
      ${Connection.escape(options_option_3)},
      ${Connection.escape(image)},
      ${Connection.escape(state)},
      ${Connection.escape(currentTime)}
    )`;
  Connection.query(query, (err) => {
    
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to add video' });
    } else {
      res.status(201).json({ success: true, message: 'Video added successfully' });
    }
  });
});

app.put('/api/update-video-state', (req, res) => {
  const { video_id, state, currentTime } = req.body;

  const query = `UPDATE videos SET state = ${Connection.escape(state)}, currentTime = ${state === 'false' ? Connection.escape(currentTime) : 0} WHERE video_id = ${Connection.escape(video_id)}`;

  Connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (results.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Video not found' });
    }
  });
});

app.get('/api/next-video', (req, res) => {
  Connection.query('SELECT * FROM videos', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results[0]);
    }
  });
});

app.get('/api/previous-video', (req, res) => {
  Connection.query('SELECT * FROM videos', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results[results.length - 1]);
    }
  });
});


// GET request to retrieve all scheduler data
app.get('/api/allSchedulerData', (req, res) => {
  Connection.query('SELECT * FROM scheduler_data1', (err, results) => {
    if (err) {
      console.error('Error fetching scheduler data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Scheduler data fetched successfully');
      res.status(200).json(results);
    }
  });
});

//PUT UPDATE DISPLAY TOGGLE DATA
app.put('/api/changeDisplayToggle', async (req, res) => {
  const { displayToggle, videoID } = req.body;
  console.log("req.body",req.body)
    const query = 'UPDATE videoData SET displayToggle = ? WHERE videoID =?';
 
   const values = [displayToggle,videoID];

    // Execute the update query
    Connection.query(query, values, (error, result) => {
      if (error) {
            console.error('Error executing selectQueryTwo query:', error);
            return res.status(500).json({ error: 'Error adding data plese try again' });
      }else {
        console.log(values)
        console.log("update successful",result)
      res.status(200).json({ message: 'Record found' });
    }
  }); 
 
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
