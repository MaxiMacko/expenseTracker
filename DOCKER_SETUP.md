# Docker Setup Guide for Expense Tracker

## Overview

This guide explains how to build and run the Expense Tracker application using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 1.29+)
- At least 2GB of free disk space

## Quick Start

### 1. Clone/Download the Repository
```bash
cd /path/to/expenseTracker
```

### 2. Build and Start Containers
```bash
docker-compose up --build
```

This command will:
- Build the Next.js application image
- Start the application container on port 3000
- Start the PostgreSQL database container on port 5432
- Initialize the database schema

### 3. Access the Application
```
Application: http://localhost:3000
Database:    localhost:5432
```

## Detailed Commands

### Start Services
```bash
# Build images and start all services
docker-compose up --build

# Start services in background (detached mode)
docker-compose up -d --build

# Start services without rebuilding
docker-compose up
```

### Stop Services
```bash
# Stop all running services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers, volumes, and networks
docker-compose down -v
```

### View Logs
```bash
# View logs from all services
docker-compose logs

# View logs from a specific service
docker-compose logs app
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f

# View last 50 lines
docker-compose logs --tail=50
```

### Access Services

#### Access Application Container
```bash
docker-compose exec app sh
```

#### Access Database Container
```bash
docker-compose exec db psql -U postgres -d expense_tracker
```

#### Query Database from Host
```bash
psql "$DATABASE_URL"
```

### Useful Commands

```bash
# Rebuild images
docker-compose build

# Rebuild a specific service
docker-compose build app

# Remove all images
docker-compose down --rmi all

# View service status
docker-compose ps

# Restart services
docker-compose restart

# View resource usage
docker stats
```

## Architecture

### Services

#### **app** (Next.js Application)
- **Image**: Custom Docker image (Node 22)
- **Port**: 3000
- **Build**: Multi-stage build for optimized production image
- **Dependencies**: PostgreSQL database
- **Health Check**: HTTP endpoint check every 10 seconds
- **Environment**: Production optimized

#### **db** (PostgreSQL Database)
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Volume**: `postgres_data` (persistent storage)
- **Health Check**: pg_isready check every 10 seconds
- **Initialization**: Automatic schema setup via `init-db.sql`
- **Data**: Persists across container restarts

### Network

- **Name**: `expense-tracker-network`
- **Type**: Bridge network
- **Purpose**: Allows services to communicate using service names

### Volumes

- **postgres_data**: Stores PostgreSQL data files
  - Location: Docker managed volume
  - Persists across restarts
  - Survives `docker-compose stop`
  - Removed only with `docker-compose down -v`

## Environment Variables

### Application Environment
Copy `.env.example` to `.env` and set the required values:

```env
NODE_ENV=${NODE_ENV}
DATABASE_URL=${DATABASE_URL}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=${NEXTAUTH_URL}
SENTRY_DSN=${SENTRY_DSN}
NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
```

### Database Environment
- `POSTGRES_USER`: Database user from `.env`
- `POSTGRES_PASSWORD`: Database password from `.env`
- `POSTGRES_DB`: Database name from `.env`

## Database Schema

The database is automatically initialized with:

### Tables
- **expenses**: Main expense records
  - id, name, category, date, price, description, created_at, updated_at
- **categories**: Expense categories
  - id, name, color, icon, created_at

### Indexes
- Date-based filtering
- Category-based filtering
- Timestamp-based queries

### Views
- **expense_summary**: Aggregated data by category

### Default Categories
- Food
- Transport
- Utilities
- Shopping
- Subscriptions

## Health Checks

Both services have health checks configured:

### Application Health Check
- **Command**: HTTP GET to `/api/expenses`
- **Interval**: 10 seconds
- **Start period**: 30 seconds (allows startup time)
- **Retries**: 3 before marking as unhealthy

### Database Health Check
- **Command**: `pg_isready`
- **Interval**: 10 seconds
- **Retries**: 5 before marking as unhealthy

## Troubleshooting

### Port Already in Use

If port 3000 or 5432 is in use:

```bash
# Change port in docker-compose.yml
# Modify the ports section:
# ports:
#   - "3001:3000"  # Use 3001 instead of 3000

# Then rebuild and start
docker-compose up --build
```

### Database Connection Issues

```bash
# Check if db service is running
docker-compose ps

# Check database logs
docker-compose logs db

# Verify connectivity
docker-compose exec app npm run prisma:migrate
```

### Application Crashes

```bash
# View application logs
docker-compose logs -f app

# Restart application
docker-compose restart app

# Rebuild and restart
docker-compose up --build
```

### Permission Issues

```bash
# Run with sudo if needed
sudo docker-compose up

# Or configure Docker to run without sudo
sudo usermod -aG docker $USER
```

## Performance Optimization

### Memory Usage
```bash
# Limit container memory
docker run -m 512m expense-tracker-app
```

### CPU Usage
```bash
# Limit CPU usage
docker run --cpus="1.5" expense-tracker-app
```

### Disk Space
```bash
# Clean up unused images and volumes
docker system prune -a --volumes

# Remove stopped containers
docker-compose down -v
```

## Production Considerations

### Security

1. **Change Default Passwords**
   ```env
   POSTGRES_PASSWORD=secure-password-here
   NEXTAUTH_SECRET=secure-secret-here
   ```

2. **Use Environment-Specific Configs**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
   ```

3. **Add SSL/TLS**
   - Configure reverse proxy (nginx)
   - Add SSL certificates

### Database Backups

```bash
# Backup database
docker-compose exec db pg_dump -U postgres expense_tracker > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres expense_tracker < backup.sql
```

### Monitoring

```bash
# View resource usage
docker stats

# Monitor container events
docker events
```

## Development vs Production

### Development Setup
- Use `docker-compose.yml` as-is
- Mount volumes for live code reloading
- Keep debug logging enabled

### Production Setup
- Separate `docker-compose.prod.yml`
- Use image registries (Docker Hub, ECR)
- Enable security hardening
- Add monitoring and logging
- Configure backups
- Use environment-specific configs

## Example Advanced Setup

```yaml
version: '3.8'
services:
  app:
    # ... (same as above)
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=error
  
  db:
    # ... (same as above)
    environment:
      - POSTGRES_INITDB_ARGS="-c log_statement=all"
```

## Useful Docker Commands

```bash
# List all containers
docker ps -a

# Remove container
docker rm container-id

# View container details
docker inspect container-id

# Export logs
docker-compose logs > logfile.txt

# Execute command in running container
docker-compose exec app npm run build
```

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment/docker)