# LMS Platform

This repo is a multi-platform LMS scaffold (API + shared types + web). More apps will be added incrementally.

## Quick start (local)

1. pnpm env:detect
2. pnpm dev:api
3. pnpm dev:web
4. pnpm smoke:local

Fast local boot (API + Web + Mobile + demo data):

- pnpm dev:fast

Auth mode:

- LMS_AUTH_MODE=mock (default) or local
- local mode uses POST /auth/bootstrap to create the first SuperAdmin

DB mode:

- LMS_DB_MODE=auto (default): uses Postgres if reachable, otherwise in-memory DB
- LMS_DB_MODE=postgres: force Postgres
- LMS_DB_MODE=memory: force in-memory DB

## OMR (local)

1. python -m venv services/omr-python/.venv
2. services/omr-python/.venv/Scripts/python.exe -m pip install -r services/omr-python/requirements.txt
3. pnpm dev:omr

## Mobile (Expo)

1. pnpm env:detect
2. pnpm dev:mobile
3. pnpm mobile:env:refresh (if env values change)
4. Optional: set LMS_ANDROID_GOOGLE_SERVICES=true only when google-services.json is present.

## Postman

- Collection: postman_collection.json
- Env (generate from .env files):
  - pnpm postman:env:local
  - pnpm postman:env:docker

## Docker (skeleton)

- docker-compose.yml expects .env.docker in repo root
- api/web containers read LMS_ENV_FILE=/app/.env.docker
- Redis + MinIO are included in docker-compose.yml for future integrations

## Production (docker)

- See docs/DEPLOYMENT.md for prod compose + Nginx reverse proxy

## Demo data

- scripts/seed_demo.ps1 (inserts sample courses + questions)

## Load test (local or docker)

- powershell -ExecutionPolicy Bypass -File scripts/load_test.ps1 -Mode local -Requests 50
- powershell -ExecutionPolicy Bypass -File scripts/load_test.ps1 -Mode docker -Requests 50

## Lint/Format

- pnpm lint
- pnpm format
- pnpm format:check

## Docs

- docs/ENV_AND_API_PARITY.md
- docs/INTEGRATIONS.md
- docs/PERFORMANCE.md
- docs/DEPLOYMENT.md
