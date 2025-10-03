# The Idea Board

A full-stack web application featuring a marketing landing page and an anonymous idea board where users can share ideas, upvote them, and see updates in real-time.

## Project Overview

The application consists of two main parts:

1. **Landing Page** - A responsive marketing page showcasing the platform
2. **Idea Board App** - An anonymous idea sharing platform with upvoting

### Features

- Anonymous idea submission (no authentication required)
- Real-time upvoting with duplicate prevention
- Dark mode support
- Responsive design for all screen sizes
- Optimistic UI updates for instant feedback
- Automatic polling for new ideas (10-second interval)
- Smooth animations
- Docker containerization
- Kubernetes deployment manifests

## Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **Date Formatting**: date-fns

### Backend

- **API**: Next.js Route Handlers (REST API)
- **Validation**: Zod
- **Rate Limiting**: In-memory IP-based limiter

### Database

- **Database**: PostgreSQL 16
- **ORM**: Prisma

### DevOps

- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (optional)
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js 20+** and **npm** (for local development)

### Running with Docker

This is the easiest way to run the entire application. Docker Compose will set up the database and web server automatically.

1. **Clone the repository**

   ```
   git clone <repository-url>
   cd idea-board
   ```

2. **Create environment file**

   ```
   # The DATABASE_URL is already configured for Docker in docker-compose.yml
   # No additional setup needed!
   ```

3. **Start the application**

   ```
   docker-compose up --build
   ```

4. **Access the application**

   - Landing Page: http://localhost:3000
   - Idea Board App: http://localhost:3000/app

5. **Stop the application**

   ```
   docker-compose down
   ```

   To remove all data:

   ```
   docker-compose down -v
   ```

### Running Locally (Development)

1. **Install dependencies**

   ```
   npm install
   ```

2. **Set up PostgreSQL**

   Start a PostgreSQL instance (via Docker):

   ```
   docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ideaboard -p 5432:5432 -d postgres:16-alpine
   ```

3. **Create `.env` file**

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ideaboard?schema=public"
   ```

4. **Run database migrations**

   ```
   npx prisma migrate dev --name init
   ```

5. **Start the development server**

   ```
   npm run dev
   ```

6. **Open your browser**
   - Landing Page: http://localhost:3000
   - Idea Board App: http://localhost:3000/app

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### GET `/api/ideas`

Fetch all ideas with optional sorting.

**Query Parameters:**

- `sort` (optional): `"top"` or `"new"` (default: `"new"`)
- `limit` (optional): Number of ideas to return (default: `50`)

**Response:**

```json
{
  "ideas": [
    {
      "id": "uuid",
      "text": "This is a brilliant idea!",
      "votes": 42,
      "createdAt": "2025-10-03T12:00:00.000Z"
    }
  ],
  "success": true
}
```

#### POST `/api/ideas`

Create a new idea.

**Request Body:**

```json
{
  "text": "Your idea here (1-280 characters)"
}
```

**Response:**

```json
{
  "idea": {
    "id": "uuid",
    "text": "Your idea here",
    "votes": 0,
    "createdAt": "2025-10-03T12:00:00.000Z"
  },
  "success": true
}
```

**Validation:**

- Text must be between 1-280 characters
- Rate limited to 10 requests per minute per IP

#### POST `/api/ideas/:id/upvote`

Increment the vote count for an idea.

**Response:**

```json
{
  "idea": {
    "id": "uuid",
    "text": "The upvoted idea",
    "votes": 43,
    "createdAt": "2025-10-03T12:00:00.000Z"
  },
  "success": true
}
```

**Rate Limiting:**

- 20 requests per minute per IP

## Architecture & Design Decisions

### Why Next.js?

- **Full-stack in one framework**: API routes + frontend
- **App Router**: Modern, performant routing with React Server Components
- **Excellent DX**: Fast Refresh, TypeScript support, built-in optimizations
- **Production-ready**: Automatic code splitting, image optimization, and more

### Why Prisma?

- **Type-safe database access**: Auto-generated TypeScript types
- **Migration system**: Easy database schema versioning
- **Developer experience**: Intuitive API and excellent VS Code integration

### Why SWR?

- **Optimistic UI**: Instant updates with automatic revalidation
- **Built-in caching**: Reduces unnecessary network requests
- **Real-time feel**: Automatic polling and focus revalidation

### Rate Limiting

- Simple in-memory IP-based rate limiting
- For production, consider using Redis with a distributed rate limiter

### Optimistic Updates

- Ideas and upvotes show immediately before server confirmation
- Provides instant feedback and better perceived performance
- Automatically reverts on error

## Docker Architecture

### Multi-stage Build

The Dockerfile uses a multi-stage build for optimal image size:

1. **deps**: Install dependencies
2. **builder**: Generate Prisma client and build Next.js app
3. **runner**: Minimal runtime image with only necessary files

### Services

- **db**: PostgreSQL 16 with persistent volume
- **web**: Next.js app with automatic database migrations on startup

### Networking

- Services communicate via Docker network
- Port 3000 exposed for web access
- Port 5432 exposed for database access (development only)

## Kubernetes Deployment

The `k8s/` directory contains production-ready Kubernetes manifests.

### Prerequisites

- Kubernetes cluster (local with minikube/kind or cloud provider)
- kubectl configured
- Docker image built and pushed to a registry

### Build and Push Docker Image

```
docker build -t your-registry/ideaboard-web:latest .
docker push your-registry/ideaboard-web:latest
```

### Update Image Reference

Edit `k8s/web-deployment.yaml` and update the image field:

```yaml
image: your-registry/ideaboard-web:latest
```

### Deploy

```
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy PostgreSQL
kubectl apply -f k8s/postgres-deployment.yaml

# Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n ideaboard --timeout=120s

# Deploy web application
kubectl apply -f k8s/web-deployment.yaml

# Create ingress (update domain in ingress.yaml first)
kubectl apply -f k8s/ingress.yaml
```

### Verify Deployment

```
kubectl get all -n ideaboard
kubectl logs -f deployment/web -n ideaboard
```

### Access Application

```
# If using LoadBalancer
kubectl get svc web -n ideaboard

# If using port-forward
kubectl port-forward svc/web 3000:80 -n ideaboard
```

## Testing

### Run Linter

```
npm run lint
```

### Format Code

```
npm run format
```

## Security Considerations

- **Rate Limiting**: Prevents abuse of API endpoints
- **Input Validation**: Zod schemas validate all user input
- **SQL Injection**: Prisma protects against SQL injection
- **Anonymous Users**: No authentication required, no PII collected
- **CORS**: Same-origin policy enforced

## Trade-offs & Future Improvements

### Current Trade-offs

1. **In-memory rate limiting**: Resets on server restart. Use Redis for production.
2. **Polling for updates**: Uses 10-second polling. Could implement WebSockets/SSE for true real-time.
3. **No pagination**: Currently loads 50 ideas. Implement cursor-based pagination for scale.
4. **No duplicate detection**: Users can post identical ideas. Add similarity checking.
5. **No admin panel**: No moderation tools. Could add content moderation.

### Potential Enhancements

- [ ] Server-Sent Events (SSE) for real-time updates
- [ ] Redis for distributed rate limiting and caching
- [ ] User sessions (optional) for tracking voted ideas
- [ ] Image upload support
- [ ] Categories/tags for ideas
- [ ] Search functionality
- [ ] Analytics dashboard
- [ ] Content moderation queue
- [ ] Email notifications for top ideas
- [ ] Export ideas to CSV/JSON

## Performance Optimizations

- **Optimistic UI**: Instant feedback before server confirmation
- **SWR Caching**: Reduces unnecessary API calls
- **Database Indexes**: On `createdAt` and `votes` for fast sorting
- **Atomic Updates**: Prisma transactions for concurrent upvotes
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based splitting
- **Standalone Output**: Minimal Docker image size

## Scripts

```
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
```
