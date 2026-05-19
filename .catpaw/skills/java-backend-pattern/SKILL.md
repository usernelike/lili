---
name: java-backend-pattern
description: Java Spring Boot backend development patterns for the lili Hub project. Use when creating new controllers, services, repositories, models, or config classes in packages/backend-java/. Covers the three-layer architecture (Controller-Service-Repository), ApiResponse usage, constructor injection, JWT user context, database migration pattern, and RESTful naming conventions.
---

# Java Backend Development Pattern

## Architecture: Three-Layer + Config

```
controller/   ← HTTP layer (@RestController)
    ↓ calls
service/      ← Business logic (@Service)
    ↓ calls
repository/   ← Data access (Spring Data / JdbcTemplate)
    ↓
model/        ← Data records/classes
config/       ← Configuration (@Configuration / @Component)
util/         ← Utilities (JwtUtil, etc.)
```

## Layer 1: Controller Pattern

**Location**: `packages/backend-java/src/main/java/com/platform/backend/controller/`

```java
@RestController
@RequestMapping("/api/your-feature")
public class YourFeatureController {

    private final YourFeatureService service;

    // Constructor injection (REQUIRED — no @Autowired fields)
    public YourFeatureController(YourFeatureService service) {
        this.service = service;
    }

    // Helper to get authenticated user ID from JWT interceptor
    private int getUserId(HttpServletRequest req) {
        return (int) req.getAttribute("userId");
    }

    @GetMapping("/items")
    public ApiResponse<?> getItems(HttpServletRequest req) {
        return ApiResponse.ok(service.getAll(getUserId(req)));
    }

    @PostMapping("/items")
    public ApiResponse<?> createItem(@RequestBody Map<String, Object> body,
                                     HttpServletRequest req) {
        // Validate input
        String name = (String) body.get("name");
        if (name == null || name.isBlank()) {
            return ApiResponse.error("name 不能为空", 400);
        }
        return ApiResponse.ok(service.create(getUserId(req), name));
    }
}
```

**Rules:**
- Always use **constructor injection**
- Return `ApiResponse<?>` for all endpoints
- Use `getUserId(req)` helper (set by `AuthInterceptor`)
- Validate inputs before calling service
- `@RequestBody` with `Map<String, Object>` for flexible JSON input

## Layer 2: Service Pattern

**Location**: `packages/backend-java/src/main/java/com/platform/backend/service/`

```java
@Service
public class YourFeatureService {

    private final YourFeatureRepository repository;
    // Or use JdbcTemplate directly:
    private final JdbcTemplate jdbc;

    public YourFeatureService(YourFeatureRepository repository) {
        this.repository = repository;
    }

    public List<YourItem> getAll(int userId) {
        return repository.findByUserId(userId);
    }

    public YourItem create(int userId, String name) {
        // Business logic here
        return repository.save(new YourItem(userId, name));
    }
}
```

**Rules:**
- Annotated with `@Service`
- Constructor injection for dependencies
- Contains business validation and orchestration
- Delegates data access to Repository

## Layer 3: Repository Pattern

### Option A: Spring Data JPA (for entity-based tables)

```java
public interface YourFeatureRepository extends JpaRepository<YourEntity, Long> {
    List<YourEntity> findByUserId(int userId);
    Optional<YourEntity> findByUserIdAndId(int userId, Long id);
}
```

### Option B: JdbcTemplate (used in this project)

```java
// Direct JDBC queries via JdbcTemplate
// Used by: InterviewFavoriteService, WatchlistService, PositionService

@Component
public class YourFeatureRepository {
    private final JdbcTemplate jdbc;

    public YourFeatureRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<Map<String, Object>> findByUserId(int userId) {
        return jdbc.queryForList(
            "SELECT * FROM your_table WHERE user_id = ? ORDER BY created_at DESC",
            userId
        );
    }
}
```

## Model Pattern

Use Java **records** for immutable data objects:

```java
package com.platform.backend.model;

public record YourItem(
    long id,
    int userId,
    String name,
    LocalDateTime createdAt
) {}
```

Or use `ApiResponse<T>` as wrapper:

```java
public record ApiResponse<T>(int code, T data, String message, boolean success) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(200, data, "ok", true);
    }
    public static <T> ApiResponse<T> error(String message, int code) {
        return new ApiResponse<>(code, null, message, false);
    }
    public static <T> ApiResponse<T> error(String message) {
        return error(message, 500);
    }
}
```

## Configuration Patterns

### WebConfig (Interceptor + CORS + SPA)

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Register AuthInterceptor for all /api/** except auth endpoints
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
            .addPathPatterns("/api/**")
            .excludePathPatterns("/api/auth/**", "/api/health");
    }

    // CORS: allow all origins for /api/**
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("*")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
    }

    // SPA fallback: forward non-API routes to index.html
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        String[] spaRoutes = {"/login", "/register", "/financial", /* ... */};
        for (String route : spaRoutes) {
            registry.addViewController(route).setViewName("forward:/index.html");
        }
    }
}
```

### DatabaseMigration (Schema Evolution)

```java
@Component
public class DatabaseMigration {

    private final JdbcTemplate jdbc;

    @PostConstruct  // Runs automatically on startup
    public void migrate() {
        addColumnIfNotExists("table_name", "column_name", "INT NOT NULL DEFAULT 0");
        addUniqueIfNotExists("table_name", "uk_name", "col1, col2");
    }

    private void addColumnIfNotExists(String table, String column, String def) {
        try {
            jdbc.queryForObject(
                "SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?",
                Integer.class, table, column
            );
        } catch (EmptyResultDataAccessException e) {
            jdbc.execute("ALTER TABLE " + table + " ADD COLUMN " + column + " " + def);
        }
    }
}
```

**This is how the project handles schema changes** — no Flyway/Liquibase, just `DatabaseMigration` with idempotent operations.

### AuthInterceptor (JWT Validation)

```java
@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String path = request.getRequestURI();
        if (path.startsWith("/api/auth/") || path.equals("/api/health")) return true;

        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) { /* return 401 */ }

        Integer userId = jwtUtil.getUserIdFromToken(token);
        if (userId == null) { /* return 401 expired */ }

        request.setAttribute("userId", userId);  // Available in controllers
        return true;
    }
}
```

## Application Properties

**File**: `src/main/resources/application.properties`

```properties
# Server
server.port=${PORT:8080}

# MySQL DataSource
spring.datasource.url=${MYSQL_URL}
spring.datasource.username=${MYSQL_USER:root}
spring.datasource.password=${MYSQL_PASSWORD:}

# Kimi AI
kimi.api.key=${KIMI_API_KEY:}
kimi.api.url=${KIMI_API_URL:https://api.moonshot.cn/v1/chat/completions}
kimi.model=${KIMI_MODEL:moonshot-v1-8k}
```

All sensitive values use `${ENV_VAR:default}` placeholder pattern.

## Quick Reference: Adding a New Feature

1. **Create Model**: Add record class in `model/`
2. **Create Repository**: Interface/class in `repository/` (or add queries in service)
3. **Create Service**: `@Service` class in `service/` with business logic
4. **Create Controller**: `@RestController` in `controller/`
5. **Add DB migration** (if new table): Add to `DatabaseMigration.migrate()`
6. **Add SPA route** (if frontend page): Add to `WebConfig.spaRoutes[]`
7. **Test**: `curl http://localhost:8080/api/your-feature/items`
