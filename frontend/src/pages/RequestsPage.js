import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const loadRequests = () => {
    axios.get('http://localhost:5000/api/requests/incoming', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setRequests(res.data))
    .catch(() => setMessage('Failed to load requests'));
  };

  useEffect(() => {
  axios.get('http://localhost:5000/api/requests/incoming', {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setRequests(res.data))
  .catch(() => setMessage('Failed to load requests'));
}, [token]); // include token


  const respond = async (id, action) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/respond`, {
        status: action
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadRequests(); // refresh list
    } catch {
      setMessage('Failed to update request');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Mentorship Requests</h2>
      {message && <p>{message}</p>}
      {requests.length === 0 ? (
        <p>No mentorship requests</p>
      ) : (
        <ul>
          {requests.map(req => (
            <li key={req._id} style={{ marginBottom: '1rem' }}>
              <strong>{req.mentee.name}</strong> ({req.mentee.email})<br />
              Skills: {req.mentee.skills?.join(', ')}<br />
              Status: <b>{req.status}</b><br />
              {req.status === 'pending' && (
                <>
                  <button onClick={() => respond(req._id, 'accepted')}>Accept</button>
                  <button onClick={() => respond(req._id, 'rejected')}>Reject</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
