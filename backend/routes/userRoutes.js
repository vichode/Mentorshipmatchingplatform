const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { updateProfile, getMe } = require('../controllers/userController');
const User = require('../models/User');

// =========================
// 🔐 Authenticated Routes
// =========================

// Get current logged-in user
router.get('/me', auth(), getMe);

// Update user profile
router.put('/me/profile', auth(), updateProfile);

// Get all users (optionally filtered by role e.g., ?role=mentor)
router.get('/all', auth(), async (req, res) => {
  const { role } = req.query;

  try {
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch users' });
  }
});

module.exports = router;
