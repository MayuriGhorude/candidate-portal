const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded resumes

// Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const appRoutes = require('./routes/applications');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', appRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Candidate Portal API is running');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));
