// backend/models/Application.js
const appSchema = new mongoose.Schema({
  job:   { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cvUrl: String,
  appliedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Application', appSchema);

