# Mentorship Matching Platform

A full-stack web application designed to connect **mentors** and **mentees**.  
The platform streamlines the mentorship journey, from making requests to scheduling sessions and sharing feedback.

---

## Features

- **User Authentication** – secure registration and login using JWT-based authentication  
- **Profile Management** – editable mentor and mentee profiles  
- **Mentorship Requests** – mentees can send requests directly to mentors  
- **Mentor Dashboard** – mentors can view, accept, or decline requests  
- **Session Booking** – built-in scheduling for mentorship sessions  
- **Feedback System** – mentees can provide feedback after each session  

---

## Tech Stack

### Backend
- Node.js  
- Express.js  
- MongoDB 
- JWT Authentication  

### Frontend
- React.js
- Axios for API communication  
- Tailwind CSS  

### Deployment
- Backend: Render  
- Frontend: Vercel  

---

## Project Structure
/backend
  models/ # Database models
  routes/ # API routes
  controllers/ # Request handlers
  server.js # App entry point
/frontend
  src/components # React components
  src/pages # Page components
  src/services # API calls


## Getting Started

1. Clone the Repository
git clone https://github.com/yourusername/mentorship-platform.git
cd mentorship-platform

2. Backend Setup
cd backend
npm install

Create a .env file inside /backend with:
PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key

Run the backend server:
npm run dev

3. Frontend Setup
cd frontend
npm install
npm start

🔗 Live Demo
Frontend: https://mentorshipmatchingplatform-it752o7pu-vichodes-projects.vercel.app
Backend API: https://mentorship-api-iu4u.onrender.com

👨‍💻 Author
Victor Shenayon
💼 LinkedIn: https://www.linkedin.com/in/victor-shenayon/
📧 Email: shenayonvictor@gmail.com
🐙 GitHub: https://github.com/vichode/
