# System Architecture

The CryptoVaultX platform follows a standard 3-tier microservice-ready architecture.

```mermaid
graph TD
    Client[Web Browser / Mobile Client] -->|HTTPS| Frontend[Vite React Application]
    Frontend -->|HTTPS| Nginx[Nginx Reverse Proxy / Load Balancer]
    Nginx -->|REST API| API_Gateway[Spring Boot API Gateway / Auth]
    Nginx -->|WebSockets| WS_Server[Spring Boot WS Server]
    
    API_Gateway --> CoreService[Core Backend Services]
    WS_Server --> CoreService
    
    CoreService -->|JDBC| PostgreSQL[(PostgreSQL DB)]
    CoreService -->|Jedis| Redis[(Redis Cache)]
    CoreService -->|Producer/Consumer| Kafka[[Apache Kafka]]
    
    Kafka --> AnalyticsWorker[Async Analytics / AI Engine]
    Kafka --> NotificationWorker[Push / Email Service]
    
    AnalyticsWorker --> PostgreSQL
```

## Security Layer
1. **Edge**: Nginx handles SSL termination and routing.
2. **Gateway**: `RateLimitingFilter` (Bucket4j) protects sensitive paths like `/api/auth/` (20 req/min).
3. **Application**: `JwtAuthenticationFilter` validates stateless JWTs and parses `ROLE_USER` / `ROLE_ADMIN` authorities.
