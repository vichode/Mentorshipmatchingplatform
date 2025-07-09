const express = require('express');
const router = express.Router();
const { updateProfile, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.put('/me/profile', protect, updateProfile);

module.exports = router;
