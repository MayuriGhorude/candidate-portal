const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Updated CORS configuration to allow your server IP
app.use(cors({
  origin: [
    'http://localhost:3000',           // Local development
    'http://34.44.127.42:3000',       // Your server IP
    'http://127.0.0.1:3000'           // Localhost alternative
  ],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Your existing routes...
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const appRoutes = require('./routes/applications');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', appRoutes);

app.get('/', (req, res) => {
  res.send('Candidate Portal API is running');
});

// MongoDB Connection and server start...
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(port, '0.0.0.0', () => {  // Listen on all interfaces
      console.log(`🚀 Server running on http://0.0.0.0:${port}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));
