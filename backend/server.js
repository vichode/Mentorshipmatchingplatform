// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));

// ✅ Add test route here
app.get('/api/auth/test', (req, res) => {
  res.send('API is running');
});

// ✅ For Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT}`)
);
