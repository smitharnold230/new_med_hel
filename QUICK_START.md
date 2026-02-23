# Quick Commands - Health Tracker

## Start Everything (First Time)

```powershell
# 1. Start Database
docker-compose up -d

# 2. Install Dependencies (if not done)
npm install
cd server && npm install
cd ../client && npm install
cd ..

# 3. Start Both Servers
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

## Daily Development

```powershell
# Start Database (if stopped)
docker-compose start

# Start Backend (Terminal 1)
cd server && npm run dev

# Start Frontend (Terminal 2)
cd client && npm run dev
```

## Stop Everything

```powershell
# Stop Servers: Ctrl+C in both terminals

# Stop Database
docker-compose stop
```

## Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Database:** localhost:5432

## Useful Commands

```powershell
# Check if database is running
docker ps

# View database logs
docker-compose logs postgres

# Access database directly
docker exec -it healthtrack-postgres psql -U healthtrack_user -d healthtrack

# Reset database (WARNING: deletes all data!)
docker-compose down -v
docker-compose up -d
```
