# HealthTrack AI 🏥

A full-stack AI-powered health tracking application built with modern web technologies. Track your daily health metrics, visualize trends, and get AI-powered insights about your wellness journey.

![Tech Stack](https://img.shields.io/badge/Stack-PERN-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features (MVP)

### ✅ Implemented
- **User Authentication**: Secure registration and login with JWT
- **Health Logging**: Track BP, blood sugar, weight, heart rate, temperature, oxygen level
- **Dashboard**: View recent health logs and statistics
- **Health Metrics Summary**: See average values with health status badges
- **Protected Routes**: Secure API endpoints and frontend pages
- **Modern UI**: Glassmorphism design with dark mode support
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🚧 Coming Soon
- Data Visualization (Charts)
- Doctor Management
- Reminder System
- AI Health Assistant (Groq API)
- Risk Prediction
- PDF Export
- Mobile App (React Native)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Email**: Nodemailer
- **AI**: Groq SDK (upcoming)

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js (upcoming)
- **State Management**: React Context API

### DevOps
- **Frontend**: Vercel
- **Backend**: Render / Railway
- **Database**: Neon / Supabase (PostgreSQL)

## 📁 Project Structure

```
healthtrack-ai/
├── server/              # Backend API
│   ├── config/          # Database & services config  
│   ├── models/          # Sequelize models
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
└── client/              # Frontend React app
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── context/     # React context
    │   ├── utils/       # Utilities
    │   └── App.jsx      # Main app component
    └── public/          # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+) OR cloud database account (Neon/Supabase)
- npm or yarn

### 1. Clone & Install

```bash
# Clone repository
cd "c:\Users\arnold.smith\Downloads\New folder (4)"

# Install backend dependencies
cd server
npm install

# Install frontend dependencies  
cd ../client
npm install
```

### 2. Set Up Database

**Option A: Docker PostgreSQL (Recommended for Development)**
```bash
# Start PostgreSQL in Docker
docker-compose up -d

# Verify it's running
docker ps
```

**Option B: Local PostgreSQL**
```bash
createdb healthtrack
```

**Option C: Cloud Database (Recommended for Production)**
- Sign up at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
- Create a new database
- Copy the connection string

### 3. Configure Environment

**Backend** (`server/.env`):
```env
# Copy from .env.example
cp .env.example .env

# Edit .env and update:
DATABASE_URL=postgresql://user:pass@host:5432/healthtrack
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:5173

# Optional for email (can skip for MVP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional for AI features (upcoming)
GROQ_API_KEY=your-groq-api-key
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

### 5. Test the Application

1. Open http://localhost:5173
2. Click "Register now" to create an account
3. Fill in your details and register
4. You'll be redirected to the dashboard
5. Click "+ Log Health Data" to add your first health entry

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login
POST   /api/auth/verify-email - Verify email
GET    /api/auth/profile      - Get profile (protected)
PUT    /api/auth/profile      - Update profile (protected)
```

### Health Logs
```
POST   /api/health/logs       - Create health log (protected)
GET    /api/health/logs       - Get all logs (protected)
GET    /api/health/logs/:id   - Get specific log (protected)
PUT    /api/health/logs/:id   - Update log (protected)
DELETE /api/health/logs/:id   - Delete log (protected)
GET    /api/health/stats      - Get statistics (protected)
```

## 🎨 Design System

### Colors
- **Primary**: Teal (#14b8a6) - Medical/health theme
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)

### Components
- Glassmorphism cards
- Animated transitions
- Dark mode toggle (upcoming)
- Responsive grid layouts

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT authentication with expiration
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ SQL injection prevention

## 🧪 Testing

```bash
# Backend (when tests are added)
cd server
npm test

# Frontend (when tests are added)
cd client
npm run test
```

## 📦 Production Deployment

### Backend (Render)
1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Frontend (Vercel)
1. Create account on [Vercel](https://vercel.com)
2. Import project
3. Set `VITE_API_URL` to production API URL
4. Deploy

### Database (Neon/Supabase)
1. Already set up in development
2. Use the same DATABASE_URL in production

## 🗺️ Roadmap

### Phase 3 (Next)
- [ ] Data visualization with Chart.js
- [ ] Doctor management module
- [ ] Appointment tracking

### Phase 4
- [ ] Reminder system with cron jobs
- [ ] Email notifications

### Phase 5
- [ ] AI chatbot integration (Groq API)
- [ ] Health risk prediction
- [ ] Smart insights generator

### Future
- [ ] Mobile app (React Native)
- [ ] Wearable integration (Fitbit, Apple Health)
- [ ] Family account management
- [ ] Voice input for elderly users
- [ ] Telemedicine integration

## 📝 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

Contributions welcome! This is a portfolio/academic project.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for better health tracking**
