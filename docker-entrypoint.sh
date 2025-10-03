#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting Next.js application..."
exec node server.js

