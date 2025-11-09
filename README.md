# Text Widget Application

A full-stack web application for creating and managing rich widgets.

Built with modern technologies including React, TypeScript, tRPC, and Fastify.

## Getting Started

### Installation & Running

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

#### Option 1: Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development servers:**

   ```bash
   npm run dev
   ```

#### Option 2: Docker

1. **Build and run with Docker Compose:**

   ```bash
   docker-compose up
   ```

2. **Stop the containers:**
   ```bash
   docker-compose down
   ```

## Running Tests

### Unit Tests

Run unit tests for both frontend and backend:

```bash
# All tests
npm test

# Frontend tests only
cd frontend && npm test

# Backend tests only
cd backend && npm test

# Watch mode
cd frontend && npm run test:watch
```

### E2E Tests

Run end-to-end tests with Playwright:

```bash
cd frontend && npm run test:e2e
```

