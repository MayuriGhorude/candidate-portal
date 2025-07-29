const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');

// Get user's favorite jobs
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites || []);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Add job to favorites
router.post('/:jobId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.jobId;

    if (!user.favorites.includes(jobId)) {
      user.favorites.push(jobId);
      await user.save();
    }

    res.json({ message: 'Job added to favorites' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Remove job from favorites
router.delete('/:jobId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.jobId;

    user.favorites = user.favorites.filter(fav => fav.toString() !== jobId);
    await user.save();

    res.json({ message: 'Job removed from favorites' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
