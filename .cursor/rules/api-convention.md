# API Development Rules

## Architecture
Frontend (React :3000) → Vite Proxy → Java Backend (:8080) + Node.js Auxiliary

## Unified Response Format
All APIs return `{ code: 200, data: {}, message: "ok", success: true }`
Java: `ApiResponse.ok(data)` / `ApiResponse.error("msg", 404)`

## Frontend: ALWAYS use apiFetch() — never raw fetch()

```typescript
import { apiFetch } from '../utils/api'
// apiFetch auto-attaches JWT, sets 30s timeout, handles 401 redirect
const res = await apiFetch('/api/endpoint', { method: 'POST', body: JSON.stringify(data) })
const json = await res.json()
if (json.success) { /* use json.data */ }
```

## Auth Flow
- POST /api/auth/login → `{ token }` → localStorage.setItem('token', token)
- Subsequent requests: apiFetch auto-adds `Authorization: Bearer <token>`
- Java AuthInterceptor validates JWT → sets `request.setAttribute("userId", id)`
- Controller: `(int) req.getAttribute("userId")`

## Route Naming (RESTful)
- `GET /api/financial/stocks` — list (paginated)
- `GET /api/financial/stocks/{code}/detail` — detail
- `POST /api/financial/watchlist` — create
- `DELETE /api/financial/watchlist/{code}` — delete
- `PATCH /api/financial/watchlist/{code}` — update

## Java Controller Template
```java
@RestController
@RequestMapping("/api/feature")
public class Controller {
    private final Service service;
    public Controller(Service service) { this.service = service; } // constructor injection ONLY
    private int getUserId(HttpServletRequest req) { return (int) req.getAttribute("userId"); }
}
```

## SPA Fallback
New frontend routes MUST be added to WebConfig.java spaRoutes[] array.

## SSE Streaming
Backend: `response.setContentType("text/event-stream")`, write `data: {...}\n\n`
Frontend: use AbortController, abort on unmount. Parse `data: ` prefix lines.
