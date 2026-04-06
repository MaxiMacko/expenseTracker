# Docker Configuration Summary

## 📦 Docker Files Overview

This directory contains all necessary Docker configuration for containerizing the Expense Tracker application.

### Files Created

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build for Node 22 application image |
| `docker-compose.yml` | Development environment configuration |
| `docker-compose.prod.yml` | Production environment configuration |
| `.dockerignore` | Files excluded from Docker build |
| `.env.docker` | Environment variables template |
| `scripts/init-db.sql` | Database initialization script |
| `DOCKER_SETUP.md` | Complete Docker setup guide |

---

## 🚀 Quick Start

### Development Environment
```bash
# Build and start services
npm run docker:up

# Or using docker-compose directly
docker-compose up -d --build

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Production Environment
```bash
# Start production environment
npm run docker:prod:up

# Stop production environment
npm run docker:prod:down
```

---

## 🐳 Application Service

### Image Details
- **Base Image**: `node:22-alpine` (Node 22 LTS)
- **Size**: ~180MB (multi-stage build optimization)
- **Build Time**: ~3-5 minutes (first build)

### Architecture
- **Multi-stage Build**:
  1. Builder stage: Installs dependencies and builds application
  2. Production stage: Runs optimized production image

- **Security**:
  - Non-root user (nextjs:nextjs)
  - Read-only root filesystem capable
  - dumb-init for proper signal handling

- **Health Management**:
  - Health check endpoint: `/api/expenses`
  - Start period: 30 seconds
  - Interval: 10 seconds

### Ports
- **Development**: 3000
- **Production**: 3000 (configurable)

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:postgres@db:5432/expense_tracker
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

## 🗄️ PostgreSQL Service

### Image Details
- **Image**: `postgres:16-alpine`
- **Version**: PostgreSQL 16
- **Size**: ~75MB

### Features
- **Automatic Initialization**: Runs `init-db.sql` on first start
- **Data Persistence**: Named volume `postgres_data`
- **Health Check**: pg_isready verification
- **Alpine-based**: Minimal footprint

### Database Configuration
| Setting | Value |
|---------|-------|
| User | postgres |
| Password | postgres (configurable) |
| Database | expense_tracker |
| Port | 5432 |

### Schema Includes
- **Tables**: expenses, categories
- **Indexes**: For date, category, timestamps
- **Views**: expense_summary (aggregated data)
- **Default Categories**: Food, Transport, Utilities, Shopping, Subscriptions
- **Functions**: Auto-update timestamps
- **Triggers**: Maintain updated_at field

---

## 📋 npm Scripts for Docker

### Quick Commands
```bash
npm run docker:build       # Build all images
npm run docker:up         # Start services in background
npm run docker:down       # Stop and remove containers
npm run docker:stop       # Stop without removing
npm run docker:logs       # View all logs
npm run docker:logs:app   # View app logs only
npm run docker:logs:db    # View database logs only
npm run docker:shell      # Access app container shell
npm run docker:psql       # Connect to database
```

### Production Commands
```bash
npm run docker:prod:up    # Start production environment
npm run docker:prod:down  # Stop production environment
```

---

## 🌐 Networking

### Network Configuration
- **Name**: `expense-tracker-network`
- **Type**: Bridge network
- **Driver**: Bridge
- **Subnet**: 172.20.0.0/16 (production only)

### Service Communication
- **App → Database**: `postgresql://postgres@db:5432/expense_tracker`
- **Host → App**: `http://localhost:3000`
- **Host → Database**: `localhost:5432`

---

## 💾 Data Persistence

### Volumes

#### Development
- **Name**: `postgres_data`
- **Driver**: Local
- **Behavior**: Persists until `docker-compose down -v`

#### Production
- **Name**: `postgres_data_prod`
- **Driver**: Local with bind mount
- **Location**: `./data` directory
- **Behavior**: Persists on host filesystem

### Backup/Restore
```bash
# Backup database
docker-compose exec db pg_dump -U postgres expense_tracker > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U postgres expense_tracker
```

---

## 🔧 Development Workflow

### Initial Setup
```bash
# 1. Build images
npm run docker:build

# 2. Start services
npm run docker:up

# 3. Verify health
docker-compose ps

# 4. Check logs
npm run docker:logs
```

### During Development
```bash
# Terminal 1: View logs
npm run docker:logs

# Terminal 2: Hot reload (if configured)
npm run dev

# Run tests in container
docker-compose exec app npm test

# Access database
npm run docker:psql
```

### Troubleshooting
```bash
# Restart services
docker-compose restart

# View detailed logs
docker-compose logs --tail=50

# Check container status
docker-compose ps

# Inspect container
docker-compose inspect app
```

---

## 📊 Resource Limits (Production)

### Application Container
- **CPU Limit**: 1 core
- **CPU Reserve**: 0.5 core
- **Memory Limit**: 512MB
- **Memory Reserve**: 256MB

### Database Container
- **CPU Limit**: 1 core
- **CPU Reserve**: 0.5 core
- **Memory Limit**: 512MB
- **Memory Reserve**: 256MB

---

## 📝 Environment Files

### `.env.docker`
Default environment variables for Docker setup:
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:postgres@db:5432/expense_tracker
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

### `.env.local` (Development)
Override with local settings:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expense_tracker
```

---

## 🔐 Security Considerations

### Current Configuration
- ✅ Non-root user for application
- ✅ Alpine-based images (smaller attack surface)
- ✅ Signal handling (dumb-init)
- ✅ Health checks configured

### Recommended for Production
- 🔒 Change default database password
- 🔒 Use secrets management (Docker Secrets, Vault)
- 🔒 Enable SSL/TLS connections
- 🔒 Set up reverse proxy (nginx)
- 🔒 Configure firewall rules
- 🔒 Use private container registry
- 🔒 Regular security scanning
- 🔒 Enable audit logging

---

## 📈 Monitoring & Logs

### View Container Stats
```bash
docker stats
```

### View Service Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app
docker-compose logs db

# Follow logs
docker-compose logs -f

# Last N lines
docker-compose logs --tail=100
```

### JSON-file Logging (Production)
- **Max Size**: 10MB per file
- **Max Files**: 3 files
- **Format**: JSON for easy parsing

---

## 🎯 Common Tasks

### Port Conflicts
Change port in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use 3001 instead
```

### Database Persistence
Ensure volume exists:
```bash
docker volume ls | grep expense-tracker
```

### Force Rebuild
```bash
docker-compose build --no-cache
```

### Clean Up
```bash
# Stop and remove everything
docker-compose down -v

# Clean Docker system
docker system prune -a --volumes
```

---

## 📖 Full Documentation

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for comprehensive guide covering:
- Detailed command reference
- Troubleshooting guide
- Production best practices
- Advanced configurations
- Database management
- Performance optimization

---

## 🔗 Related Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment/docker)

---

## 📋 Checklist for Production Deployment

- [ ] Change `POSTGRES_PASSWORD` in production config
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure `NEXTAUTH_URL` correctly
- [ ] Set up SSL/TLS certificates
- [ ] Configure backup strategy
- [ ] Set up monitoring and alerting
- [ ] Review security settings
- [ ] Test disaster recovery
- [ ] Configure CI/CD pipeline
- [ ] Document deployment process