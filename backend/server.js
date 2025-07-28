const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5050;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded resumes

// Routes
const jobRoutes = require('./routes/jobs');
const appRoutes = require('./routes/applications');

app.use('/api/jobs', jobRoutes);
app.use('/api/applications', appRoutes);


// Add this after your middleware and before MongoDB connection
app.get('/', (req, res) => {
    res.send('API is running');
});

// ...existing code...


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
    });
}).catch(err => console.error('❌ MongoDB connection failed:', err));
