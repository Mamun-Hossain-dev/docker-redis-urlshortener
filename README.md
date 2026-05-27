# Docker URL Shortener

A full-stack URL shortener built with **Node.js + TypeScript (Express)**, **PostgreSQL**, and **Redis**, fully containerized with **Docker Compose**.

## Features

- Shorten long URLs from a clean web interface
- Optional custom alias support (`my-brand-link`)
- Fast redirection with Redis cache
- Click analytics (total clicks per short URL)
- Recent links dashboard with timestamps
- Copy-to-clipboard button for generated links
- Production-ready Docker setup with health checks
- Modular backend architecture (config/db/service/controller/route)

## Tech Stack

- Backend: Express.js + TypeScript
- View Engine: EJS
- Database: PostgreSQL 16
- Cache: Redis 7
- Containerization: Docker + Docker Compose

## Project Structure

```text
.
├─ Dockerfile
├─ docker-compose.yml
├─ .env
├─ init.sql
├─ package.json
├─ src/
│  ├─ index.ts
│  ├─ app.ts
│  ├─ config/
│  │  └─ index.ts
│  ├─ controllers/
│  │  └─ urlController.ts
│  ├─ db/
│  │  ├─ postgres.ts
│  │  └─ redis.ts
│  ├─ routes/
│  │  └─ urlRoutes.ts
│  ├─ services/
│  │  └─ urlService.ts
│  └─ utils/
│     └─ validators.ts
├─ views/
│  └─ index.ejs
└─ public/
   ├─ styles.css
   └─ app.js
```

## Environment Variables

Create/update `.env`:

```env
NODE_ENV=production
PORT=3000
BASE_URL=http://localhost:3000

DB_HOST=postgres
DB_PORT=5432
DB_NAME=urlshortener
DB_USER=mamun
DB_PASSWORD=secret123

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=secret123
```

## Run with Docker

```bash
docker compose up -d --build
```

Open:

- App UI: `http://localhost:3000`

## Docker Build Strategy

- This project uses a **multi-stage Docker build** in `Dockerfile`.
- Stage 1 (`builder`) installs dependencies and compiles TypeScript.
- Stage 2 (`runtime`) copies only the production artifacts (`dist`, `views`, `public`) and production dependencies.
- Result: smaller, cleaner, and more secure final image.

## Useful Commands

```bash
# View running services
docker compose ps

# Follow logs
docker compose logs -f app

# Stop services
docker compose down

# Stop + remove volumes (fresh database/cache)
docker compose down -v
```

## API Endpoints

- `GET /` - Render UI
- `POST /shorten` - Create short URL from form data
- `GET /:code` - Redirect to original URL

## Custom Alias Rules

- Length: 4 to 32 characters
- Allowed: letters, numbers, `_`, `-`
- Must be unique

## Notes

- Redis is used as a read cache for short code lookups.
- PostgreSQL stores permanent URL mappings and click counts.
- `init.sql` runs on first PostgreSQL volume initialization.
- App startup also runs a safe schema check (`CREATE TABLE IF NOT EXISTS` + `ADD COLUMN IF NOT EXISTS`) so small schema drifts are auto-healed.
- If you change `init.sql`, run `docker compose down -v` once to reinitialize Postgres from scratch.

## Future Improvements

- User authentication + private links
- Expiring URLs
- QR code generation
- Rate limiting and abuse protection
- Full analytics page with charts
