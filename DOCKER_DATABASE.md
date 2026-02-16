# Docker PostgreSQL Setup for HealthTrack AI

## Quick Start

### 1. Start PostgreSQL Database
```powershell
# From project root directory
docker-compose up -d
```

This will:
- Download PostgreSQL 15 Alpine image (lightweight)
- Create a container named `healthtrack-postgres`
- Start database on port 5432
- Create database `healthtrack` with user credentials

### 2. Verify Database is Running
```powershell
docker ps
```

You should see:
```
CONTAINER ID   IMAGE                PORTS                    NAMES
xxxxx          postgres:15-alpine   0.0.0.0:5432->5432/tcp   healthtrack-postgres
```

### 3. Check Database Health
```powershell
docker-compose ps
```

Status should show "Up (healthy)"

### 4. Start Backend Server
```powershell
cd server
npm run dev
```

You should see:
```
✅ Database connection established
✅ Database initialized successfully
🚀 Server running on port 5000
```

## Docker Commands

### Stop Database
```powershell
docker-compose stop
```

### Start Database (if already created)
```powershell
docker-compose start
```

### Restart Database
```powershell
docker-compose restart
```

### Stop and Remove Database (deletes data!)
```powershell
docker-compose down
```

### Stop and Remove Database with Volume (complete cleanup)
```powershell
docker-compose down -v
```

## Database Access

### Connection Details
- **Host:** localhost
- **Port:** 5432
- **Database:** healthtrack
- **User:** healthtrack_user
- **Password:** healthtrack_password

### Connect with psql (inside container)
```powershell
docker exec -it healthtrack-postgres psql -U healthtrack_user -d healthtrack
```

### Common SQL Commands
```sql
-- List all tables
\dt

-- View users table
SELECT * FROM users;

-- View health logs
SELECT * FROM health_logs;

-- Count total logs
SELECT COUNT(*) FROM health_logs;

-- Exit psql
\q
```

### Connect with GUI Tool (optional)
You can use tools like:
- **pgAdmin** (https://www.pgadmin.org/)
- **DBeaver** (https://dbeaver.io/)
- **TablePlus** (https://tableplus.com/)

Use the connection details above.

## Troubleshooting

### Port Already in Use
If port 5432 is already in use:

1. **Option 1:** Stop existing PostgreSQL service
```powershell
# Windows
Stop-Service -Name postgresql*
```

2. **Option 2:** Change Docker port in docker-compose.yml
```yaml
ports:
  - "5433:5432"  # Use port 5433 instead
```
Then update `.env`:
```
DATABASE_URL=postgresql://healthtrack_user:healthtrack_password@localhost:5433/healthtrack
```

### Container Won't Start
```powershell
# View container logs
docker-compose logs postgres

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Database Connection Refused
```powershell
# Wait a few seconds for container to fully start
docker-compose ps

# Check if healthy
docker exec healthtrack-postgres pg_isready -U healthtrack_user
```

## Data Persistence

Database data is stored in a Docker volume named `postgres_data`. This means:
- ✅ Data persists when you stop/start the container
- ✅ Data persists across system restarts
- ❌ Data is deleted only when you run `docker-compose down -v`

## Backup & Restore

### Backup Database
```powershell
docker exec healthtrack-postgres pg_dump -U healthtrack_user healthtrack > backup.sql
```

### Restore Database
```powershell
docker exec -i healthtrack-postgres psql -U healthtrack_user -d healthtrack < backup.sql
```

## Production Deployment

For production, use:
- **Neon** (https://neon.tech) - Free tier, serverless PostgreSQL
- **Supabase** (https://supabase.com) - Free tier with extra features
- **Railway** (https://railway.app) - Simple deployment
- **AWS RDS** or **Google Cloud SQL** - Enterprise solutions

Docker is perfect for local development but not recommended for production deployment of databases.

---

**Ready to develop!** 🚀
