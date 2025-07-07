const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Session = require('../models/Session');
const Request = require('../models/Request');

// Book a session (mentee only, with accepted mentor)
router.post('/', auth(['mentee']), async (req, res) => {
  const { mentorId, topic, dateTime, notes } = req.body;

  // Check if mentorship was accepted
  const existing = await Request.findOne({
    mentor: mentorId,
    mentee: req.user.id,
    status: 'accepted'
  });

  if (!existing) {
    return res.status(403).json({ msg: 'You can only book sessions with accepted mentors' });
  }

  try {
    const newSession = new Session({
      mentor: mentorId,
      mentee: req.user.id,
      topic,
      dateTime,
      notes
    });
    await newSession.save();
    res.status(201).json({ msg: 'Session booked', session: newSession });
  } catch (err) {
    res.status(500).json({ msg: 'Error booking session' });
  }
});

// Get all sessions for logged-in user
router.get('/', auth(), async (req, res) => {
  const filter = {
    $or: [
      { mentor: req.user.id },
      { mentee: req.user.id }
    ]
  };

  try {
    const sessions = await Session.find(filter)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email')
      .sort({ dateTime: 1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching sessions' });
  }
});

// Update session status or feedback (mentor only)
router.put('/:id/status', auth(['mentor']), async (req, res) => {
  const { status } = req.body;

  if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, mentor: req.user.id },
      { status },
      { new: true }
    );
    res.json({ msg: 'Status updated', session });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating session' });
  }
});

// Add feedback (mentee only, after completion)
router.put('/:id/feedback', auth(['mentee']), async (req, res) => {
  const { feedback, rating } = req.body;

  try {
    const session = await Session.findOneAndUpdate(
      {
        _id: req.params.id,
        mentee: req.user.id,
        status: 'completed'
      },
      { feedback, rating },
      { new: true }
    );
    res.json({ msg: 'Feedback added', session });
  } catch (err) {
    res.status(500).json({ msg: 'Error adding feedback' });
  }
});

module.exports = router;
