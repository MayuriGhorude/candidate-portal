const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST: Apply for a job
router.post('/:jobId', auth(['student']), upload.single('cv'), async (req, res) => {
  try {
    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      user: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      job: req.params.jobId,
      user: req.user.id,
      cvUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await application.save();
    await application.populate(['job', 'user']);
    
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET: User's applications
router.get('/my-applications', auth(['student']), async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate('job')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: All applications (admin only)
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const applications = await Application.find()
      .populate(['job', 'user'])
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
