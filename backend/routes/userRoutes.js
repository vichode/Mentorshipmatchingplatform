const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // import default

const { updateProfile, getMe } = require('../controllers/userController');

// Use auth() instead of protect
router.get('/me', auth(), getMe);
router.put('/me/profile', auth(), updateProfile);

module.exports = router;
