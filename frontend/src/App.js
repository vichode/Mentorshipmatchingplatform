import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ProfileEdit from './pages/ProfileEdit';
import MentorList from './pages/MentorList';
import RequestsPage from './pages/RequestsPage';
import BookSession from './pages/BookSession';
import FeedbackForm from './pages/FeedbackForm';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/profile/edit" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/mentors" element={<MentorList />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/book" element={<BookSession />} />
        <Route path="/feedback" element={<FeedbackForm />} />
      </Routes>
    </Router>
  );
}

export default App;
