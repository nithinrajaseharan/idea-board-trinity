# Commands Reference

Quick reference for common commands.

## Running the Application

### Docker (Recommended)

```powershell
# Start everything
docker-compose up --build

# Start in background
docker-compose up -d

# Stop
docker-compose down

# Stop and remove all data
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f web
docker-compose logs -f db

# Restart services
docker-compose restart
```

### Local Development

```powershell
# Install dependencies
npm install

# Start PostgreSQL (if not using Docker Compose)
docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ideaboard -p 5432:5432 -d postgres:16-alpine

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Database Commands

```powershell
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name description_here

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (visual database editor)
npx prisma studio

# Check migration status
npx prisma migrate status
```

## Code Quality

```powershell
# Run linter
npm run lint

# Format code
npm run format

# Check types
npm run build
```

## Docker Commands

### Container Management

```powershell
# List running containers
docker ps

# List all containers
docker ps -a

# Stop a container
docker stop ideaboard-web
docker stop ideaboard-db

# Start a container
docker start ideaboard-web
docker start ideaboard-db

# Remove a container
docker rm ideaboard-web
docker rm ideaboard-db

# View container logs
docker logs ideaboard-web
docker logs -f ideaboard-web  # follow logs
```

### Image Management

```powershell
# List images
docker images

# Build image manually
docker build -t ideaboard-web .

# Remove image
docker rmi ideaboard-web

# Remove unused images
docker image prune
```

### System Cleanup

```powershell
# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune

# Remove everything (WARNING: nuclear option)
docker system prune -a --volumes
```

## Kubernetes Commands

```powershell
# Apply all manifests
kubectl apply -f k8s/

# Apply specific file
kubectl apply -f k8s/namespace.yaml

# Get all resources in namespace
kubectl get all -n ideaboard

# Get pods
kubectl get pods -n ideaboard

# Get services
kubectl get svc -n ideaboard

# Describe a resource
kubectl describe pod <pod-name> -n ideaboard

# View logs
kubectl logs -f deployment/web -n ideaboard
kubectl logs -f deployment/postgres -n ideaboard

# Execute command in pod
kubectl exec -it <pod-name> -n ideaboard -- /bin/sh

# Port forward for testing
kubectl port-forward svc/web 3000:80 -n ideaboard

# Delete all resources in namespace
kubectl delete namespace ideaboard

# Scale deployment
kubectl scale deployment/web --replicas=5 -n ideaboard
```

## Troubleshooting Commands

### Port Issues

```powershell
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Check what's using port 5432
netstat -ano | findstr :5432
```

### Database Connection

```powershell
# Connect to PostgreSQL (from Docker)
docker exec -it ideaboard-db psql -U postgres -d ideaboard

# Inside PostgreSQL:
\dt              # List tables
\d "Idea"        # Describe table
SELECT * FROM "Idea";  # Query ideas
\q               # Quit
```

### Check Application Health

```powershell
# Test API endpoint
curl http://localhost:3000/api/ideas

# Test with PowerShell
Invoke-WebRequest http://localhost:3000/api/ideas

# Create an idea
curl -X POST http://localhost:3000/api/ideas -H "Content-Type: application/json" -d "{\"text\":\"Test idea\"}"
```

## Git Commands

```powershell
# Initialize repository
git init

# Add all files
git add .

# Commit
git commit -m "Complete full-stack assessment: The Idea Board"

# Add remote
git remote add origin https://github.com/USERNAME/REPO.git

# Push to GitHub
git push -u origin main

# Check status
git status

# View commit history
git log --oneline
```

## Testing Commands

```powershell
# Test API endpoints

# Get all ideas
curl http://localhost:3000/api/ideas

# Get top ideas
curl http://localhost:3000/api/ideas?sort=top

# Create idea
curl -X POST http://localhost:3000/api/ideas \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"This is a test idea\"}"

# Upvote (replace [ID] with actual ID)
curl -X POST http://localhost:3000/api/ideas/[ID]/upvote
```

### PowerShell Version

```powershell
# Get ideas
Invoke-RestMethod -Uri "http://localhost:3000/api/ideas" -Method Get

# Create idea
$body = @{ text = "Test idea" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/ideas" -Method Post -Body $body -ContentType "application/json"

# Upvote
Invoke-RestMethod -Uri "http://localhost:3000/api/ideas/[ID]/upvote" -Method Post
```

## Quick Reset Scripts

### Reset Docker Completely

```powershell
docker-compose down -v
docker system prune -f
docker volume prune -f
docker-compose up --build
```

### Reset Database Only

```powershell
docker-compose stop db
docker-compose rm -f db
docker volume rm idea-board_postgres_data
docker-compose up -d db
```

### Reset Application Only

```powershell
docker-compose stop web
docker-compose rm -f web
docker-compose up --build web
```

## Monitoring Commands

```powershell
# Docker container stats
docker stats

# Docker container resource usage
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check Docker disk usage
docker system df

# View container processes
docker top ideaboard-web
docker top ideaboard-db
```

## Common Workflows

### First Time Setup

```powershell
cd C:\Users\NITHI\Downloads\Trinity\idea-board
docker-compose up --build
# Wait for "Ready in X ms"
# Open http://localhost:3000
```

### Daily Development

```powershell
npm run dev
# Make changes
# Browser auto-refreshes
```

### Before Committing

```powershell
npm run lint
npm run format
npm run build
git add .
git commit -m "Your message"
```

### Fresh Deploy Test

```powershell
docker-compose down -v
docker-compose up --build
# Verify everything works
```

## Emergency Commands

### Everything is Broken

```powershell
# Nuclear reset
docker-compose down -v
docker system prune -a --volumes -f
rm -rf node_modules
rm package-lock.json
npm install
docker-compose up --build
```

### Database Corrupted

```powershell
docker-compose down -v
docker volume rm idea-board_postgres_data
docker-compose up -d db
npx prisma migrate deploy
```

### Port Conflicts

```powershell
# Kill all node processes
taskkill /F /IM node.exe

# Kill all Docker containers
docker stop $(docker ps -q)
docker rm $(docker ps -aq)
```

## Pre-Submission Checklist Commands

```powershell
# 1. Clean build
docker-compose down -v
docker-compose up --build

# 2. Test all endpoints
curl http://localhost:3000
curl http://localhost:3000/app
curl http://localhost:3000/api/ideas

# 3. Verify git
git status
git log --oneline

# 4. Push to GitHub
git push origin main

# 5. Test fresh clone (in different directory)
cd ..
git clone <your-repo-url>
cd <repo-name>
docker-compose up --build
```

## Useful Shortcuts

```powershell
# Open current directory in VS Code
code .

# Open file in VS Code
code README.md

# Open folder in Explorer
start .

# Clear PowerShell screen
cls
```


