// backend/models/Job.js
const jobSchema = new mongoose.Schema({
  title:       String,
  description: String,
  location:    String,
  type:        { type: String, enum: ['Full-Time', 'Part-Time', 'Contract'] },
  postedAt:    { type: Date, default: Date.now }
});
module.exports = mongoose.model('Job', jobSchema);
