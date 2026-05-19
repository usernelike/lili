# Deployment & Environment Rules

## Environment Configuration

### Frontend (packages/frontend)
- Port: 3000 (dev), built with Vite
- `.env.development` / `.env.production` for API base URL
- Proxy config in `vite.config.ts` → backend :8080

### Backend (packages/backend-java)
- Port: 8080
- `application.yml` / `application-dev.yml` / `application-prod.yml`
- MySQL connection, JWT secret, CORS origins in yml

## Build & Run Commands

### Frontend
```bash
cd packages/frontend
npm install
npm run dev        # Vite dev server on :3000
npm run build      # Output to dist/
npm run preview    # Preview production build
```

### Backend
```bash
cd packages/backend-java
./mvnw spring-boot:run                    # Dev mode
./mvnw clean package -DskipTests          # Build JAR
java -jar target/backend-0.0.1-SNAPSHOT.jar  # Run JAR
```

## Deployment Checklist
1. Update `application-prod.yml` with production DB credentials
2. Set `JWT_SECRET` environment variable
3. Build frontend: `npm run build`
4. Backend serves frontend static files from `static/` directory
5. SPA fallback routes configured in `WebConfig.java`
6. CORS: set `allowed-origins` to production domain

## Database
- MySQL 8.x required
- Tables auto-created by JPA `spring.jpa.hibernate.ddl-auto=update` (dev)
- For production: use Flyway/Liquibase migrations (ddl-auto=validate)
