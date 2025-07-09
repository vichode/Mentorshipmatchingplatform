import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const loadSessions = useCallback(() => {
    axios.get('https://mentorship-api-iu4u.onrender.com/api/sessions', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setSessions(res.data))
    .catch(() => setMessage('❌ Could not load sessions'));
  }, [token]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`https://mentorship-api-iu4u.onrender.com/api/sessions/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadSessions();
    } catch {
      setMessage('❌ Failed to update session status');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>My Sessions</h2>
      {message && <p>{message}</p>}
      {sessions.length === 0 ? (
        <p>No sessions scheduled</p>
      ) : (
        <ul>
          {sessions.map(session => (
            <li key={session._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
              <strong>Topic:</strong> {session.topic}<br />
              <strong>Date:</strong> {new Date(session.dateTime).toLocaleString()}<br />
              <strong>Status:</strong> <b>{session.status}</b><br />
              <strong>Mentor:</strong> {session.mentor?.name} ({session.mentor?.email})<br />
              <strong>Mentee:</strong> {session.mentee?.name} ({session.mentee?.email})<br />
              {session.notes && <><strong>Notes:</strong> {session.notes}<br /></>}

              {role === 'mentor' && session.status === 'pending' && (
                <>
                  <button onClick={() => handleStatusChange(session._id, 'confirmed')}>Confirm</button>{' '}
                  <button onClick={() => handleStatusChange(session._id, 'cancelled')}>Cancel</button><br />
                </>
              )}

              {role === 'mentee' && session.status === 'completed' && !session.feedback && (
                <button onClick={() => navigate('/feedback', { state: { session } })}>
                  Leave Feedback
                </button>
              )}

              {session.feedback && (
                <>
                  <strong>Feedback:</strong> {session.feedback}<br />
                  <strong>Rating:</strong> {session.rating} ⭐<br />
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
