# Docker Deployment - Quick Reference

## 🎯 What's Included

### Docker Containers
- **Application**: Node 22 + Next.js (optimized multi-stage build)
- **Database**: PostgreSQL 16 (Alpine - minimal footprint)
- **Network**: Bridge network for inter-service communication

### Configuration Files
| File | Purpose |
|------|---------|
| `Dockerfile` | Production-ready Node 22 application image |
| `docker-compose.yml` | Development environment |
| `docker-compose.prod.yml` | Production environment |
| `.dockerignore` | Files excluded from Docker build |
| `.env.docker` | Environment variables template |
| `scripts/init-db.sql` | Database schema and initialization |

### Documentation
- `DOCKER_SETUP.md` - Complete setup guide with troubleshooting
- `DOCKER_CONFIG.md` - Configuration reference and details

---

## ⚡ Quick Commands

### Start Development
```bash
npm run docker:up        # Start all services
npm run docker:logs      # Stream logs
npm run docker:down      # Stop services
```

### Database Operations
```bash
npm run docker:psql      # Connect to database
docker-compose exec db pg_dump -U postgres expense_tracker > backup.sql
```

### Access Services
```bash
npm run docker:shell          # SSH into app container
npm run docker:logs:app       # App logs only
npm run docker:logs:db        # Database logs only
```

### Production
```bash
npm run docker:prod:up        # Start production environment
npm run docker:prod:down      # Stop production environment
```

---

## 📋 Configuration

### Environment Variables (`.env.docker`)
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:postgres@db:5432/expense_tracker
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Access Points
- **Application**: http://localhost:3000
- **Database**: localhost:5432
- **Credentials**: postgres / postgres

---

## 🗄️ Database Schema

### Tables
- `expenses` - Expense records
- `categories` - Category definitions

### Included Features
- Auto-initialization on startup
- Default categories (Food, Transport, Utilities, Shopping, Subscriptions)
- Optimized indexes for quick queries
- Automatic timestamp management
- Aggregated summary views

---

## 🔒 Security & Resources

### Container Limits
- CPU: 1 core (limit), 0.5 core (reserve)
- Memory: 512MB (limit), 256MB (reserve)

### Security Features
- Non-root user execution
- Health checks configured
- Signal handling (dumb-init)
- Alpine-based images (minimal surface)

---

## 📊 Useful Commands

```bash
# View container status
docker-compose ps

# View resource usage
docker stats

# View service logs
docker-compose logs --tail=50

# Restart a service
docker-compose restart app

# Execute command in container
docker-compose exec app npm run build

# View container details
docker-compose inspect app
```

---

## 🆘 Troubleshooting

### Port Already in Use
Edit `docker-compose.yml` and change port from `3000:3000` to `3001:3000`

### Database Connection Error
```bash
# Check database health
docker-compose logs db

# Restart database
docker-compose restart db
```

### Application Won't Start
```bash
# Check logs
npm run docker:logs

# Ensure DB is ready
docker-compose exec app npm run build
```

### Clean Up Everything
```bash
docker-compose down -v        # Remove volumes
docker system prune -a         # Clean up unused images
```

---

## 📖 Full Documentation

For comprehensive guides, see:
- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Complete setup instructions
- **[DOCKER_CONFIG.md](./DOCKER_CONFIG.md)** - Configuration details

## 🚀 First Time Setup

```bash
# 1. Build container images
npm run docker:build

# 2. Start all services
npm run docker:up

# 3. Verify services are running
docker-compose ps

# 4. Check logs
npm run docker:logs

# 5. Access application
open http://localhost:3000

# 6. Connect to database (optional)
npm run docker:psql
```

---

## ✅ Pre-Deployment Checklist

- [ ] Review `.env.docker` and set secure values
- [ ] Run `npm run docker:build` successfully
- [ ] Start with `npm run docker:up`
- [ ] Verify application loads at http://localhost:3000
- [ ] Test database connection with `npm run docker:psql`
- [ ] Review logs for any warnings
- [ ] Test a complete user flow (add/edit/delete expense)

---

## 🎓 Image Details

### Application Image
- **Base**: node:22-alpine
- **Size**: ~180MB
- **Build**: Multi-stage (builder + production)
- **User**: nextjs (non-root)

### Database Image
- **Base**: postgres:16-alpine
- **Size**: ~75MB
- **Data**: Persistent volume

---

## 📝 Common Tasks

### Backup Database
```bash
docker-compose exec db pg_dump -U postgres expense_tracker > backup.sql
```

### Restore Database
```bash
cat backup.sql | docker-compose exec -T db psql -U postgres expense_tracker
```

### Import Data
```bash
docker-compose exec -T db psql -U postgres expense_tracker < data.sql
```

### Update Application
```bash
docker-compose build app
docker-compose up -d app
```

---

## 🔗 References

- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Next.js Deployment](https://nextjs.org/docs/deployment)