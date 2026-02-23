# Health Tracker - Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Update the following variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string
- `CLOUDINARY_*`: Your Cloudinary credentials (optional for MVP)
- `EMAIL_*`: Your email service credentials (optional for MVP)
- `GROQ_API_KEY`: Your Groq API key (for AI features)

### 3. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL if not already installed
# Create database
createdb healthtrack

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/healthtrack
```

**Option B: Cloud PostgreSQL (Recommended)**
- **Neon**: https://neon.tech (Free tier: 512MB)
- **Supabase**: https://supabase.com (Free tier: 500MB)
- **Railway**: https://railway.app

Create a database and copy the connection string to `.env`.

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`.

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /verify-email` - Verify email
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update profile (protected)

### Health Logs (`/api/health`)
- `POST /logs` - Create health log (protected)
- `GET /logs` - Get all logs with pagination (protected)
- `GET /logs/:id` - Get specific log (protected)
- `PUT /logs/:id` - Update log (protected)
- `DELETE /logs/:id` - Delete log (protected)
- `GET /stats` - Get health statistics (protected)

## Testing API

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create Health Log
```bash
curl -X POST http://localhost:5000/api/health/logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"systolic":120,"diastolic":80,"bloodSugar":95,"weight":72,"heartRate":75}'
```

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, CORS, Rate Limiting
- **AI**: Groq SDK

## Project Structure
```
server/
├── config/        # Database and service configurations
├── models/        # Sequelize models
├── controllers/   # Request handlers
├── routes/        # API routes
├── middleware/    # Custom middleware
├── services/      # Business logic (AI, reminders, etc.)
├── utils/         # Helper functions
└── server.js      # Main application entry
```

## Next Steps
1. ✅ Backend API setup complete
2. 🔄 Frontend React application
3. 🔄 AI integration (Groq chatbot)
4. 🔄 Data visualization
5. 🔄 Reminder system
6. 🔄 Production deployment
