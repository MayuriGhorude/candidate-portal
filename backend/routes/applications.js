// backend/routes/applications.js
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/:jobId', auth(['student']), upload.single('cv'), async (req, res) => {
  const application = await Application.create({
    job: req.params.jobId,
    user: req.user.id,
    cvUrl: `/uploads/${req.file.filename}`
  });
  res.status(201).json(application);
});
