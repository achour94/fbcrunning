# FBC Running

A web application for FBC Running built with React + TypeScript (Vite) and Spring Boot.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Spring Boot 3.3 + Java 21
- **Database**: MySQL 8.0
- **Containerization**: Docker + Docker Compose

## Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Java 21+ (for local backend development, optional if using Docker)
- Maven 3.9+ (optional, wrapper included)

## Quick Start (Docker)

The fastest way to get everything running:

```bash
# Start MySQL and backend
docker compose up -d

# Start frontend dev server (with hot reload)
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Local Development

### Database

Start just the database:

```bash
docker compose up mysql -d
```

### Backend

Option 1: Run with Docker (recommended):
```bash
docker compose up backend -d
```

Option 2: Run locally with Maven:
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

API will be available at http://localhost:8080

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App will be available at http://localhost:5173 with hot module replacement.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ping` | Health check / connectivity test |
| GET | `/actuator/health` | Detailed health status |

## Project Structure

```
fbcrunning/
├── frontend/               # React + Vite application
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                # Spring Boot application
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Local development setup
└── README.md
```

## Environment Variables

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080` |

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Active profile | `local` |
| `DATABASE_URL` | JDBC connection string | - |
| `DATABASE_USERNAME` | Database user | - |
| `DATABASE_PASSWORD` | Database password | - |

## CI/CD

GitHub Actions runs on every push:
- Backend: Maven build + tests
- Frontend: TypeScript build + lint
- Docker: Image build verification (main branch only)

## License

Private
