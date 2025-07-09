import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const navigate = useNavigate();
  const session = useLocation().state?.session;

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios.put(`https://mentorship-api-iu4u.onrender.com/api/sessions/${session._id}/feedback`, {
        feedback,
        rating
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Feedback submitted!');
      setTimeout(() => navigate('/sessions'), 1500);
    } catch {
      setMessage('❌ Failed to submit feedback');
    }
  };

  if (!session || session.status !== 'completed') {
    return <p>Invalid or incomplete session</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Leave Feedback for: {session.topic}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Rating (1 to 5):<br />
          <select value={rating} onChange={e => setRating(e.target.value)}>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label><br /><br />

        <textarea
          placeholder="Write your feedback"
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          rows="4"
          required
        /><br />

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}
