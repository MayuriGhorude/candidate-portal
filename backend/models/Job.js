const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract'], required: true },
  company: { type: String, default: 'Nottingham Building Society' },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
