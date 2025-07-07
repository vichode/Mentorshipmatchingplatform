import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BookSession() {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const mentor = location.state?.mentor; // mentor passed from MentorList
  const navigate = useNavigate();

  const [form, setForm] = useState({
    topic: '',
    dateTime: '',
    notes: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/sessions', {
        mentorId: mentor._id,
        ...form
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Session booked!');
      setTimeout(() => navigate('/sessions'), 1500);
    } catch (err) {
      setMessage('❌ Booking failed');
    }
  };

  if (!mentor) return <p>Mentor info not provided</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Book a Session with {mentor.name}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="topic"
          placeholder="Session Topic"
          value={form.topic}
          onChange={handleChange}
          required
        /><br />

        <input
          type="datetime-local"
          name="dateTime"
          value={form.dateTime}
          onChange={handleChange}
          required
        /><br />

        <textarea
          name="notes"
          placeholder="Goals or questions"
          rows="3"
          value={form.notes}
          onChange={handleChange}
        /><br />

        <button type="submit">Book Session</button>
      </form>
    </div>
  );
}
