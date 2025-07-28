const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET: All jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Add new job
router.post('/', async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
