import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MentorList() {
  const [mentors, setMentors] = useState([]);
  const [skillFilter, setSkillFilter] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/all?role=mentor', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setMentors(res.data))
    .catch(() => setMessage('Failed to load mentors'));
  }, [token]);

  const handleRequest = async (mentorId) => {
    try {
      await axios.post('http://localhost:5000/api/requests', {
        mentorId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Mentorship request sent!');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Error sending request';
      setMessage(`❌ ${msg}`);
    }
  };

  const filteredMentors = skillFilter
    ? mentors.filter(m => m.skills?.includes(skillFilter))
    : mentors;

  return (
    <div style={{ padding: 40 }}>
      <h2>Available Mentors</h2>
      {message && <p>{message}</p>}

      <label>
        Filter by Skill:
        <select onChange={e => setSkillFilter(e.target.value)} value={skillFilter}>
          <option value="">All</option>
          <option value="Marketing">Marketing</option>
          <option value="UI/UX">UI/UX</option>
          <option value="Backend Development">Backend Development</option>
          <option value="Frontend Development">Frontend Development</option>
          <option value="Product Management">Product Management</option>
          <option value="DevOps">DevOps</option>
          <option value="Data Science">Data Science</option>
          <option value="Blockchain">Blockchain</option>
        </select>
      </label>

      <ul>
        {filteredMentors.map(mentor => (
          <li key={mentor._id} style={{ marginBottom: '1rem' }}>
            <strong>{mentor.name}</strong><br />
            <em>{mentor.bio}</em><br />
            Skills: {mentor.skills?.join(', ')}<br />
            <button onClick={() => handleRequest(mentor._id)}>Request Mentorship</button><br />
            <button onClick={() => navigate('/book', { state: { mentor } })}>Book Session</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
