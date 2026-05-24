# Tekron DevOps Setup Guide

This project is now a split Next.js frontend plus Express/Mongoose backend.

## Required Services

- MongoDB 7
- Redis 7
- Backend API on port 5000
- Frontend on port 3000

## Local Docker Run

Create a root `.env` file with production-safe secrets:

```bash
JWT_ACCESS_SECRET=replace_with_a_long_random_access_secret
JWT_REFRESH_SECRET=replace_with_a_long_random_refresh_secret
```

Then run:

```bash
docker compose up --build
docker compose exec backend npm run seed:admin
docker compose exec backend npm run seed:products
```

Open `http://localhost:3000`.

## Jenkins Credentials

Configure these secret text credentials:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

The pipeline builds the backend and frontend services, starts MongoDB and Redis, seeds the admin/product data, and reports container health.

## Production Notes

- The backend refuses to boot in `NODE_ENV=production` unless `MONGO_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` are set.
- Redis is optional at runtime; if Redis is down, API requests continue without cache.
- Seed scripts are idempotent and update existing seeded rows by email/slug instead of deleting live data.
