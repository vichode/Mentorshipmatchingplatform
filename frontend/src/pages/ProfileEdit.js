import React, { useState, useEffect } from 'react';
import axios from 'axios';

const skillOptions = [
  'Marketing', 'UI/UX', 'Backend Development', 'Frontend Development',
  'Product Management', 'DevOps', 'Data Science', 'Blockchain'
];

export default function ProfileEdit() {
  const [form, setForm] = useState({
    name: '',
    bio: '',
    skills: [],
    goals: ''
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setMessage('You are not logged in.');
      return;
    }

    axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setForm(prev => ({
        ...prev,
        name: res.data.name || '',
        bio: res.data.bio || '',
        skills: res.data.skills || [],
        goals: res.data.goals || ''
      }));
    })
    .catch(() => setMessage('Error fetching user info'));
  }, [token]); // ✅ token added as dependency

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = skill => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/users/me/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      setMessage('❌ Error updating profile');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Edit Profile</h2>
      {message && <p>{message}</p>}

      {!token ? (
        <p style={{ color: 'red' }}>Access denied. Please login.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          /><br />

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Short Bio"
            rows="3"
          /><br />

          <strong>Skills:</strong><br />
          {skillOptions.map(skill => (
            <label key={skill} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={form.skills.includes(skill)}
                onChange={() => handleSkillToggle(skill)}
              />
              {skill}
            </label>
          ))}<br />

          <textarea
            name="goals"
            value={form.goals}
            onChange={handleChange}
            placeholder="Your Goals"
            rows="3"
          /><br />

          <button type="submit">Save Profile</button>
        </form>
      )}
    </div>
  );
}
