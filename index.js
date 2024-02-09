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
const port = 8002;

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: "Swapnil@123",
  database: 'Firstdb',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.json('Hello All');
});

app.get('/api/allVideos', (req, res) => {
  db.query('SELECT * FROM Videodata', (err, results) => {
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
    query += ` WHERE video_id = ${db.escape(video_id)}`;
  }

  db.query(query, (err, results) => {
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

// Update the route to handle form data
app.post('/api/add-video', (req, res) => {
  const {
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
      ${db.escape(video_id)},
      ${db.escape(video)},
      ${db.escape(Date_time)},
      ${db.escape(show_id)},
      ${db.escape(video_type)},
      ${db.escape(question_type)},
      ${db.escape(question)},
      ${db.escape(question_id)},
      ${db.escape(options_option_1)},
      ${db.escape(options_option_2)},
      ${db.escape(options_option_3)},
      ${db.escape(image)},
      ${db.escape(state)},
      ${db.escape(currentTime)}
    )`;
  db.query(query, (err) => {
    
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

  const query = `UPDATE videos SET state = ${db.escape(state)}, currentTime = ${state === 'false' ? db.escape(currentTime) : 0} WHERE video_id = ${db.escape(video_id)}`;

  db.query(query, (err, results) => {
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
  db.query('SELECT * FROM videos', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results[0]);
    }
  });
});

app.get('/api/previous-video', (req, res) => {
  db.query('SELECT * FROM videos', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results[results.length - 1]);
    }
  });
});

app.post('/api/saveSchedulerData', async (req, res) => {
  try {
    const { theater_id, schedulers } = req.body;

    // Check if schedulers is an array
    if (!Array.isArray(schedulers)) {
      return res.status(400).json({ error: 'Invalid schedulers format' });
    }

    // Create a MySQL connection pool directly in the route
    const connection = mysql.createPool({
      host: "localhost",
      user: 'root',
      password: "Swapnil@123",
      database: 'Firstdb',
      connectionLimit: 10, // Adjust as needed
    });

    // Iterate through schedulers and insert data into the database
    for (const scheduler of schedulers) {
      const {
        start_date,
        scheduler_index,
        selected_videos,
        errors,
      } = scheduler;

      // Build the SQL query
      const query = `
        INSERT INTO SchedulerData (theater_id, start_date, scheduler_index, video_1, video_2, video_3, video_4, video_5, video_6, video_7, video_8, video_9, video_10, video_11, video_12, video_13, video_14, video_15, errors)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      await connection.query(query, [
        theater_id,
        start_date,
        scheduler_index,
        ...selected_videos,
        errors,
      ]);
    }

    // Release the connection pool
    await connection.end();

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
