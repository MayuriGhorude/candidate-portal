// backend/routes/jobs.js
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = require('express').Router();

router.get('/', async (_, res) => res.json(await Job.find().sort({ postedAt: -1 })));

router.post('/', auth(['admin']), async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json(job);
});

router.put('/:id', auth(['admin']), async (req, res) => {
  res.json(await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
