const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    name: String,
    email: String,
    resume: String, // File path
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', ApplicationSchema);
