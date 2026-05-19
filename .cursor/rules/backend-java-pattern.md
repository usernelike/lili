# Backend Java Pattern Rules

## Tech Stack
Spring Boot 3 + Java 21 + MySQL

## Project Structure
```
src/main/java/com/platform/backend/
├── config/       — Config, Security, CORS, SPA fallback
├── controller/   — REST API controllers
├── dto/          — Request/Response DTOs
├── model/        — JPA Entity classes
├── repository/   — Spring Data JPA interfaces
├── service/      — Business logic
├── util/         — Utility classes
└── BackendApplication.java
```

## Naming Conventions
| Type | Pattern | Example |
|------|---------|---------|
| Entity | PascalCase noun | `Watchlist`, `User` |
| Controller | PascalCase + Controller | `StockController` |
| Service | PascalCase + Service | `StockService` |
| Repository | PascalCase + Repository | `WatchlistRepository` |
| DTO | PascalCase + Request/Response | `LoginRequest`, `StockResponse` |
| Method | camelCase, verb prefix | `findByCode`, `addToWatchlist` |

## Service Layer Rules
- Constructor injection ONLY (no @Autowired on fields)
- @Transactional(readOnly=true) on read operations
- @Transactional on write operations
- Service methods should return DTOs, not entities, to API layer

## Controller Rules
- RESTful routes: GET/POST/PUT/DELETE
- getUserId via `(int) req.getAttribute("userId")`
- Return `ApiResponse.ok(data)` or `ApiResponse.error(msg, code)`

## Entity Rules
- All entities: @Entity + @Table(name="xxx")
- ID: @Id + @GeneratedValue(strategy = GenerationType.IDENTITY)
- Timestamps: created_at / updated_at with @PrePersist / @PreUpdate

## Exception Handling
- Global @RestControllerAdvice with @ExceptionHandler
- Business exceptions throw custom RuntimeException subclass
- Never expose stack traces to client
