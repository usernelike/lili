---
name: deploy-guide
description: Deployment guide for the lili Hub project covering local development setup, environment configuration, Docker multi-stage build, and Render production deployment. Use when setting up development environment, deploying to production, debugging deployment issues, or configuring environment variables. Covers Java 21, MySQL, Maven, Docker, Render, and the dev.sh startup script.
---

# Deployment Guide

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + Vite | 18 + 5 |
| Main Backend | Spring Boot + Java 21 + Maven | 3.x |
| Auxiliary Backend | Express + Node.js | — |
| Database | MySQL | 5.7+ / 8.0 |
| Production | Docker → Render | — |

## Local Development Setup

### Prerequisites

```bash
# Check installations
java -version    # Should show 21
mvn -version     # Should show 3.9+
node -v          # Should show 18+
pnpm -v          # Should show 8+
mysql --version  # Should be running
```

### Step 1: Start MySQL

```bash
# macOS
brew services start mysql

# Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS lili_hub;"
```

### Step 2: Configure Environment Variables

Create `packages/backend-java/.env` (already in `.gitignore`):

```properties
MYSQL_URL=jdbc:mysql://localhost:3306/lili_hub?useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
MYSQL_USER=root
MYSQL_PASSWORD=your_password
KIMI_API_KEY=sk-your-kimi-key-from-moonshot-cn
```

### Step 3: Start Java Backend

```bash
cd packages/backend-java
./dev.sh   # Loads .env, runs mvn spring-boot:run
```

Verify:
```bash
curl http://localhost:8080/health   # Should return OK
curl http://localhost:8080/api/interview/favorites  # Should return 401 (needs auth)
```

### Step 4: Start Frontend

```bash
# In project root (separate terminal)
pnpm dev
```

Frontend runs on `http://localhost:3000`. Vite proxies `/api/*` → `localhost:8080`.

## Environment Variables Reference

| Variable | Required | Local Default | Production (Render) |
|----------|----------|--------------|---------------------|
| `PORT` | No | `8080` | Set by Render |
| `MYSQL_URL` | Yes | `jdbc:mysql://localhost:3306/lili_hub?...` | Render dashboard |
| `MYSQL_USER` | Yes | `root` | Render dashboard |
| `MYSQL_PASSWORD` | Yes | Your password | Render dashboard |
| `KIMI_API_KEY` | Yes | From moonshot.cn | Render dashboard |
| `KIMI_API_URL` | No | `https://api.moonshot.cn/v1/chat/completions` | Override if needed |
| `KIMI_MODEL` | No | `moonshot-v1-8k` | `kimi-k2.6` on Render |

**Security**: Never commit `.env` files or hardcode secrets.

## Production Deployment (Render)

### Architecture: Docker Multi-Stage Build

```
Stage 1 (Node): Build frontend → copy static files to Java resources/static
Stage 2 (Maven): Build Java backend → produce JAR
Stage 3 (JRE): Run JAR with minimal runtime
```

### Deploy Steps

1. **Push code to GitHub** (Render auto-deploys from main branch)
2. **Create Web Service on Render**:
   - Runtime: **Docker**
   - Plan: **Free**
3. **Set environment variables** in Render dashboard (see table above)
4. **Deploy**: Render builds Docker image and deploys

### Adding New SPA Routes for Production

When adding new frontend routes, update `WebConfig.java`:

```java
String[] spaRoutes = {"/login", "/register", "/financial", "/interview",
                     "/enterprise", "/lili", "/stock/**", /* add yours */};
```

## Node.js Auxiliary Backend (Preserved)

The Express backend at `packages/backend/` is preserved for lili data source integration:

```bash
cd packages/backend
pnpm install
pnpm dev      # Development (port varies)
pnpm build && pnpm start  # Production
```

Currently handles:
- `/api/financial/lili/query` — lili stock data via Kimi Code CLI plugin
- `/api/enterprise/*` — Enterprise query API

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `Communications link failure` | MySQL not running or wrong connection string | Start MySQL, check MYSQL_URL |
| Frontend shows 404 on refresh | Missing SPA fallback route | Add route to WebConfig.java spaRoutes[] |
| AI chat returns error | KIMI_API_KEY missing/invalid | Check env var on Render dashboard |
| Port 8080 already in use | Previous Java process running | `kill $(lsof -ti:8080)` |
| Maven build fails | Java version mismatch | Ensure JAVA_HOME points to JDK 21 |
| CORS errors | Frontend port not proxied | Use Vite dev server (auto-proxies /api) |
