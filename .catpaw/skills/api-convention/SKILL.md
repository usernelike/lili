---
name: api-convention
description: Defines API development and calling conventions for the lili Hub project's dual-backend architecture (Spring Boot Java + Express Node.js). Use when creating new API endpoints, modifying existing routes, writing frontend data fetching code, or integrating between frontend and backend. Covers unified response format, apiFetch usage, JWT authentication flow, route naming, SSE streaming patterns, and error handling.
---

# API Development & Calling Convention

## Architecture Overview

```
Frontend (React + Vite :3000)
    │  apiFetch() → /api/*
    ▼
Vite Proxy → localhost:8080
    │
    ├── Spring Boot (Java 21) — Main backend
    │   ├── /api/auth/*      (public)
    │   ├── /api/health      (public)
    │   ├── /api/financial/* (authenticated)
    │   ├── /api/ai/*        (authenticated)
    │   ├── /api/interview/* (authenticated)
    │   └── /api/enterprise/*(authenticated)
    │
    └── Express (Node.js) — Auxiliary backend (preserved)
        └── /api/financial/lili/query
        └── /api/enterprise/*
```

## Unified Response Format

All APIs return `ApiResponse<T>`:

```json
{
  "code": 200,
  "data": { ... },
  "message": "ok",
  "success": true
}
```

### Java Backend (ApiResponse record)

```java
// Success
return ApiResponse.ok(data);                    // { code:200, data, message:"ok", success:true }

// Error with custom code
return ApiResponse.error("Not found", 404);       // { code:404, data:null, message:"...", success:false }

// Error (defaults to 500)
return ApiResponse.error("Internal error");       // { code:500, ... }
```

### Frontend Response Handling

```typescript
const res = await apiFetch('/api/some/endpoint')
const json = await res.json()
if (json.success) {
  // use json.data
} else {
  // show json.message error
}
```

## Frontend: apiFetch() — The ONLY Way to Call APIs

**Never use raw `fetch()`** for API calls. Always use `apiFetch` from `src/utils/api.ts`:

```typescript
import { apiFetch } from '../utils/api'

// GET
const res = await apiFetch('/api/financial/stocks?page=1&pageSize=20')
const data = await res.json()

// POST
const res = await apiFetch('/api/financial/watchlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: '600519', name: '贵州茅台' }),
})

// DELETE
const res = await apiFetch(`/api/financial/watchlist/${code}`, {
  method: 'DELETE',
})
```

### What apiFetch Does Automatically

1. **Attaches JWT token** from `localStorage.getItem('token')` as `Authorization: Bearer <token>`
2. **Sets Content-Type** to `application/json` for string bodies
3. **30-second timeout** via `AbortController`
4. **Handles 401**: removes token, redirects to `/login`
5. **Cleans up timeout** in both resolve and reject

## Authentication Flow

### Login

```
POST /api/auth/login  { username, password }
→ 200 { token: "jwt-string" }
→ Frontend: localStorage.setItem('token', token)
```

### Subsequent Requests

```
apiFetch() reads token from localStorage
→ Adds header: Authorization: Bearer <token>
→ Java AuthInterceptor validates JWT
→ Sets request attribute: userId (integer)
→ Controller: (int) req.getAttribute("userId")
```

### Public vs Protected Routes

| Path Pattern | Auth Required |
|-------------|---------------|
| `/api/auth/**` | No (login/register) |
| `/api/health` | No |
| Everything else under `/api/**` | Yes (JWT Bearer token) |

## Route Naming Conventions

### RESTful Patterns (Java backend)

```
GET    /api/financial/stocks              → List stocks (paginated)
GET    /api/financial/stocks/search?kw=   → Search stocks
GET    /api/financial/stocks/{code}       → Single stock quote
GET    /api/financial/stocks/{code}/detail     → Stock detail + K-line
GET    /api/financial/stocks/{code}/indicators  → Technical indicators
GET    /api/financial/stocks/{code}/minute       → Minute data
GET    /api/financial/indices             → Market indices
GET    /api/financial/commodities         → Commodities

GET    /api/financial/watchlist           → List watchlist
POST   /api/financial/watchlist           → Add to watchlist
PATCH  /api/financial/watchlist/{code}    → Update watchlist item
DELETE /api/financial/watchlist/{code}    → Remove from watchlist

GET    /api/financial/positions           → List positions
POST   /api/financial/positions           → Add position
PATCH  /api/financial/positions/{code}    → Update position
DELETE /api/financial/positions/{code}    → Remove position
GET    /api/financial/positions/summary   → Position summary with P&L

POST   /api/ai/chat                       → SSE stream chat
POST   /api/ai/chat/sync                  → Sync chat response

POST   /api/auth/register                 → Register
POST   /api/auth/login                    → Login

GET    /api/interview/favorites           → Get favorites
POST   /api/interview/favorites           → Add favorite
DELETE /api/interview/favorites/{id}      → Remove favorite
```

## Java Controller Template

```java
@RestController
@RequestMapping("/api/your-feature")
public class YourFeatureController {

    private final YourFeatureService service;

    public YourFeatureController(YourFeatureService service) {
        this.service = service;
    }

    private int getUserId(HttpServletRequest req) {
        return (int) req.getAttribute("userId");
    }

    @GetMapping("/items")
    public ApiResponse<?> getItems(HttpServletRequest req) {
        return ApiResponse.ok(service.getAll(getUserId(req)));
    }

    @PostMapping("/items")
    public ApiResponse<?> addItem(@RequestBody Map<String, Object> body, HttpServletRequest req) {
        // validate required fields
        String name = (String) body.get("name");
        if (name == null || name.isBlank()) {
            return ApiResponse.error("缺少 name 参数", 400);
        }
        return ApiResponse.ok(service.add(getUserId(req), name));
    }

    @DeleteMapping("/items/{id}")
    public ApiResponse<?> deleteItem(@PathVariable String id, HttpServletRequest req) {
        if (!service.remove(getUserId(req), id)) {
            return ApiResponse.error("项目不存在", 404);
        }
        return ApiResponse.ok(Map.of("removed", true));
    }
}
```

**Key rules:**
- Constructor injection only (no `@Autowired` field injection)
- Use `getUserId(req)` helper to extract authenticated user ID
- Return `ApiResponse.ok()` for success, `ApiResponse.error()` for failures
- Validate input parameters before calling service layer

## SSE Streaming Pattern (AI Chat)

For streaming responses (like AI chat):

### Backend (Java)

```java
@PostMapping("/chat")
public void chatStream(@RequestBody Map<String, Object> body,
                       HttpServletRequest request,
                       HttpServletResponse response) throws IOException {
    int userId = (int) request.getAttribute("userId");

    response.setContentType("text/event-stream");
    response.setCharacterEncoding("UTF-8");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");

    PrintWriter writer = response.getWriter();

    // Stream each chunk
    writer.write("data: {\"choices\":[{\"delta\":{\"content\":\"hello\"}}]}\n\n");
    writer.flush();

    // Done
    writer.write("data: [DONE]\n\n");
    writer.flush();
}
```

### Frontend (SSE Reader)

```typescript
const res = await apiFetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message, history }),
})

const reader = res.body?.getReader()
const decoder = new TextDecoder()
let buffer = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  buffer += decoder.decode(value, { stream: true })
  const lines = buffer.split('\n')
  buffer = lines.pop() || ''
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('data: ')) continue
    const data = trimmed.slice(6)
    if (data === '[DONE]') continue
    const parsed = JSON.parse(data)
    // handle parsed delta content
  }
}
```

**Critical**: Always use `AbortController` with SSE. Store controller in a ref and abort on component unmount.

## SPA Fallback Routes

When adding a new frontend page/route, you MUST add it to `WebConfig.java`:

```java
String[] spaRoutes = {"/login", "/register", "/financial", "/interview",
                     "/enterprise", "/lili", "/stock/**", "/your-new-route"};
for (String route : spaRoutes) {
    registry.addViewController(route).setViewName("forward:/index.html");
}
```

## Error Handling Patterns

### Frontend Errors

| Scenario | Handling |
|----------|----------|
| Network failure | `catch { setError('网络请求失败') }` |
| API returns `success: false` | Show `data.message` to user |
| 401 | Handled by `apiFetch` auto-redirect |
| Timeout | Handled by `apiFetch` 30s AbortController |

### Backend Errors

| Scenario | Response |
|----------|----------|
| Resource not found | `ApiResponse.error("msg", 404)` |
| Bad input | `ApiResponse.error("msg", 400)` |
| Unauthorized | `AuthInterceptor` returns 401 automatically |
| Server error | `ApiResponse.error("msg", 500)` or let exception propagate |
