const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Request = require('../models/Request');

// =========================
// ✅ Health check route
// =========================
router.get('/test', (req, res) => {
  res.send('API is running');
});

// =========================
// 🔐 AUTH ROUTES
// =========================

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user
router.get('/me', auth(), getMe);

// =========================
// 👤 PROFILE ROUTES
// =========================

// Update profile
router.put('/users/me/profile', auth(), async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        bio: req.body.bio,
        skills: req.body.skills,
        goals: req.body.goals
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update profile' });
  }
});

// Get users by role (e.g., mentors)
router.get('/users/all', auth(), async (req, res) => {
  const { role } = req.query;
  try {
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch users' });
  }
});

// =========================
// 📬 REQUEST ROUTES
// =========================

// Mentee sends mentorship request to a mentor
router.post('/requests', auth(['mentee']), async (req, res) => {
  try {
    const { mentorId } = req.body;

    // Check if request already exists
    const existing = await Request.findOne({
      mentor: mentorId,
      mentee: req.user.id
    });

    if (existing) {
      return res.status(400).json({ msg: 'You already requested this mentor' });
    }

    const newRequest = new Request({
      mentor: mentorId,
      mentee: req.user.id
    });

    await newRequest.save();

    res.status(201).json({ msg: 'Mentorship request sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error sending mentorship request' });
  }
});

// Mentor views incoming mentorship requests
router.get('/requests/incoming', auth(['mentor']), async (req, res) => {
  try {
    const requests = await Request.find({ mentor: req.user.id })
      .populate('mentee', 'name email skills bio')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load mentorship requests' });
  }
});

// Mentor accepts or rejects a mentorship request
router.put('/requests/:id/respond', auth(['mentor']), async (req, res) => {
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    const updated = await Request.findOneAndUpdate(
      { _id: req.params.id, mentor: req.user.id },
      { status },
      { new: true }
    ).populate('mentee', 'name');

    res.json({ msg: `Request ${status}`, request: updated });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update request' });
  }
});

module.exports = router;
