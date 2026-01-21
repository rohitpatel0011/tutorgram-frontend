
# 🎓 Tutorgram — AI-Powered Learning Platform

> A next-generation Computer Science learning application powered by Google Gemini AI, designed to personalize education through dynamic content generation, interactive quizzes, and gamification.

![Status](https://img.shields.io/badge/Status-Live-success)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![AI](https://img.shields.io/badge/AI-Gemini%202.5-orange)

## 🚀 Live Demo
- **Frontend**: [Link to your Vercel App](https://tutorgram.vercel.app)
- **Backend**: [Link to your Render API](https://tutorgram-api.onrender.com)

---

## ✨ Key Features

### 🤖 AI-Driven Learning
- **Dynamic Explanations**: Regenerate any topic explanation instantly using Gemini 2.5 Flash.
- **Hinglish Mode**: Switch between English and Hinglish (Roman Hindi) explanations for better understanding.
- **AI Tutors**: "Veo" powered video generation for complex topics and "Kore" powered TTS for audio learning.

### 🎮 Gamification & Progress
- **XP System**: Earn Experience Points for reading topics and passing quizzes.
- **Streak Tracking**: Daily activity tracking to maintain learning momentum.
- **Leaderboard**: Compete with other students in real-time.

### 📝 Assessment
- **Topic Quizzes**: 5-question quick checks generated on the fly.
- **Module Exams**: Comprehensive 10-question exams for full chapters.
- **Instant Feedback**: Detailed AI-generated explanations for every answer.

### 🎨 Neubrutalism Design
- High-contrast, bold UI inspired by Gumroad and Neo-Brutalism trends.
- Fully responsive layout with Dark Mode support.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **TailwindCSS** (Styling)
- **Lucide React** (Icons)
- **Google GenAI SDK** (AI Integration)

### Backend
- **Node.js & Express**
- **MongoDB Atlas** (Database)
- **Mongoose** (ODM)
- **JWT** (Authentication)

---

## ⚡ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Connection String
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/tutorgram.git
cd tutorgram
```

### 2. Backend Setup
Navigate to the backend folder (if separated) or root:
```bash
# Install dependencies
npm install

# Create .env file
echo "PORT=8080" > .env
echo "MONGO_URI=your_mongodb_connection_string" >> .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "GEMINI_API_KEY=your_gemini_key" >> .env

# Start Server
npm run start
```

### 3. Frontend Setup
```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8080/api" > .env
echo "VITE_API_KEY=your_gemini_key" >> .env

# Start React Dev Server
npm run dev
```

---

## 🤝 Contribution
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
This project is open-source and available under the MIT License.
