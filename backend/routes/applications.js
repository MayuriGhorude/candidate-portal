const express = require('express');
const router = express.Router();
const multer = require('multer');
const Application = require('../models/Application');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// POST: Apply for a job
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, jobId } = req.body;
        const resume = req.file.path;

        const application = new Application({ name, email, resume, jobId });
        await application.save();
        res.status(201).json(application);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET: All applications
router.get('/', async (req, res) => {
    try {
        const applications = await Application.find().populate('jobId');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
