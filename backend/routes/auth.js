// backend/routes/auth.js
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const router = require('express').Router();

router.post('/register', async (req, res) => {
  const user = new User({ ...req.body, password: await bcrypt.hash(req.body.password, 10) });
  await user.save();
  res.status(201).json({ ok: true });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(400).json({ msg: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, role: user.role, firstName: user.firstName });
});

module.exports = router;
