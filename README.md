# Carewise Clinic Booking

A multi-location clinic booking scaffold built with Next.js, TypeScript, Tailwind CSS, Framer Motion, Django REST Framework, JWT, PostgreSQL, and Docker.

## Run locally

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000) for the booking dashboard and [http://localhost:8000/api/health/](http://localhost:8000/api/health/) for the API health check.

The API includes seeded locations, specialties, clinicians, and appointment slots. Create a user through the Django admin or use the JWT endpoints at `/api/auth/token/` and `/api/auth/token/refresh/`.

## Services

- `frontend`: Next.js dashboard with location, specialty, clinician, and date filters.
- `backend`: Django REST API under `/api/` with JWT authentication.
- `db`: PostgreSQL 16.

## Useful commands

```bash
docker compose exec api python manage.py migrate
docker compose exec api python manage.py createsuperuser
docker compose exec api python manage.py seed_demo
```
## Starting the backend only
docker compose up --build api

## Starting the frontend only
docker compose up --build web

## Starting both together
docker compose up --build