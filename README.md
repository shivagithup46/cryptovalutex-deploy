# CryptoVaultX

CryptoVaultX is a next-generation, enterprise-grade cryptocurrency exchange and wealth management platform. It features a complete Dark Ultra Violet Glassmorphism design system, AI-driven portfolio insights, institutional-grade security, and high-performance trading engines.

## Features

- **High-Performance Trading Engine**: Real-time order matching system with limit/market support.
- **WebSocket Streaming**: Live ticker prices and real-time portfolio updates.
- **P2P Escrow Network**: Secure peer-to-peer trading with multi-signature escrow capabilities.
- **AI Portfolio Assistant**: Chat-based AI utilizing algorithmic analysis of holdings and market trends.
- **Admin Command Center**: Real-time monitoring of platform volume, KYC/AML alerts, and active users.
- **System Telemetry**: OS-level CPU/Memory tracking and application log monitoring.

## Tech Stack

**Frontend**:
- React 18, TypeScript, Vite
- Redux Toolkit (State Management)
- TailwindCSS (Styling & Glassmorphism)
- Lucide React (Icons), Recharts (Data Visualization)

**Backend**:
- Java 25, Spring Boot 3.3
- Spring Security (JWT, Bucket4j Rate Limiting)
- PostgreSQL (Flyway Migrations)
- Redis (Session Caching)
- Apache Kafka (Event Streaming)

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- JDK 25+
- Maven 3.9+

### Docker Deployment (Recommended)
You can launch the entire ecosystem (Postgres, Redis, Kafka, Zookeeper, Backend, Frontend) with a single command:
```bash
docker-compose up -d --build
```
- Frontend will be available at: `http://localhost:80`
- Backend API will be available at: `http://localhost:8080/api/`
- Swagger UI will be available at: `http://localhost:8080/swagger-ui/index.html`

### Local Development
1. Start the infrastructure: `docker-compose up -d postgres redis zookeeper kafka`
2. Start the backend: `cd backend && ./mvnw spring-boot:run`
3. Start the frontend: `cd frontend && npm run dev`

## Architecture
See `docs/ARCHITECTURE.md` for full system boundaries.

## API Documentation
Once running, visit `http://localhost:8080/swagger-ui/index.html` for the OpenAPI 3.0 specification.
