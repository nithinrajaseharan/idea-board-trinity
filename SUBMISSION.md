# Submission Guide

## Quick Start

To run this project locally:

```bash
docker compose up --build
```

Then open http://localhost:3000

## What I Built

A full-stack web application with:

- Marketing landing page
- Anonymous idea board with upvoting
- REST API with PostgreSQL
- Docker containerization
- Kubernetes deployment configs

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL 16
- **DevOps**: Docker, Kubernetes

## Key Features

- Real-time upvoting with duplicate prevention (localStorage-based)
- Dark mode support
- Optimistic UI updates
- Rate limiting on API endpoints
- Responsive design
- 10-second polling for updates

## Trade-offs

I made several intentional trade-offs for this assessment:

1. **localStorage for upvote tracking** - Simple and effective for demo. Production would use IP-based or user-based tracking in the database.

2. **Polling instead of WebSockets** - 10-second polling provides a real-time feel with simpler implementation. WebSockets would be the next step for production.

3. **In-memory rate limiting** - No external dependencies needed. Production would use Redis for distributed rate limiting.

4. **No pagination** - Currently loads 50 ideas at once. Would implement cursor-based pagination for larger datasets.

## Architecture Decisions

- **Next.js 15** for full-stack development (API routes + frontend)
- **Prisma** for type-safe database access and migrations
- **Zod** for runtime input validation
- **SWR** for data fetching with automatic revalidation
- **Multi-stage Docker build** for optimized image size

## Time Investment

Approximately 8-10 hours including:

- Planning and architecture
- Implementation
- Docker configuration
- Documentation
- Testing

## Documentation

- `README.md` - Complete project documentation
- `COMMANDS_REFERENCE.md` - Common commands for development

## Contact

Feel free to reach out with any questions about the implementation.
nithinrajaseharan@gmail.com
