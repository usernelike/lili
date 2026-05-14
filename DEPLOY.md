# 部署指南

本项目支持一键部署到 [Render](https://render.com/) 云平台，零成本让朋友通过链接访问。

---

## 技术架构

- **前端**：React + Vite → 构建为静态文件
- **后端**：Express + TypeScript → 构建后由 Node.js 运行
- **数据库**：SQLite（文件型，零配置）
- **部署方式**：单服务部署，后端同时 serve 前端静态文件

---

## 部署到 Render（推荐零成本方案）

### 1. 准备代码

确保代码已推送到 GitHub / GitLab：

```bash
git add .
git commit -m "feat: add database, interview knowledge base, deploy config"
git push origin main
```

### 2. 注册 Render 账号

访问 [render.com](https://render.com/)，用 GitHub 账号登录。

### 3. 创建 Web Service

1. 点击 **New +** → **Web Service**
2. 连接你的 GitHub 仓库
3. 填写配置：

| 配置项 | 值 |
|--------|-----|
| Name | `lili-hub`（自定义） |
| Runtime | `Node` |
| Build Command | `pnpm install && pnpm build` |
| Start Command | `cd packages/backend && node dist/index.js` |
| Plan | `Free` |

4. 点击 **Create Web Service**

Render 会自动：
- 检测 `pnpm-lock.yaml` 使用 pnpm
- 运行 `pnpm install` 安装依赖
- 运行 `pnpm build` 构建前后端
- 启动服务

大约 2-3 分钟后，你会得到一个类似 `https://lili-hub.onrender.com` 的链接，直接发给朋友即可访问。

---

## ⚠️ 免费版限制

| 限制 | 说明 |
|------|------|
| 休眠机制 | 15 分钟无访问自动休眠，下次访问需 30 秒左右唤醒 |
| SQLite 数据 | **每次部署后文件系统重置，SQLite 数据会丢失** |
| 运行时长 | 每月 750 小时免费额度 |

> **重要**：Render 免费版每次重新部署（如 push 代码）后，SQLite 数据库文件会被重置。这意味着数据不会持久保存。
>
> **解决方案**：如果数据持久化对你很重要，建议购买 Render 的 **Disk**（$0.25/GB/月），将 `/data` 目录挂载到磁盘上，这样 SQLite 数据就会持久保存。

---

## 本地验证构建

在部署前，可在本地验证构建产物是否能正常运行：

```bash
# 1. 构建前后端
pnpm build

# 2. 启动生产环境服务
cd packages/backend && node dist/index.js

# 3. 访问 http://localhost:8080 测试
```

---

## 已部署的数据库 API

部署后，以下 API 可直接使用：

### 面试题收藏
- `GET /api/interview/favorites` — 获取收藏列表
- `POST /api/interview/favorites` — 添加收藏
- `DELETE /api/interview/favorites/:id` — 删除收藏

### 自选股（持久化版，替代 localStorage）
- `GET /api/watchlist` — 获取自选股
- `POST /api/watchlist` — 添加自选股
- `PATCH /api/watchlist/:code` — 更新自选股
- `DELETE /api/watchlist/:code` — 删除自选股

### 持仓管理
- `GET /api/positions` — 获取持仓
- `POST /api/positions` — 添加持仓
- `PATCH /api/positions/:code` — 更新持仓
- `DELETE /api/positions/:code` — 删除持仓

---

## 其他部署平台

### Railway（免费额度 $5/月）
- 支持持久化磁盘，SQLite 数据不会丢失
- 部署方式类似

### 自有服务器（阿里云/腾讯云）
- 购买轻量应用服务器（约 ¥60-150/年）
- 安装 Node.js、Git、PM2
- `git clone` + `pnpm install` + `pnpm build` + `pm2 start`
- 配合 Nginx 反向代理 + SSL

---

## 常见问题

**Q: 为什么构建时 better-sqlite3 编译很慢？**  
A: better-sqlite3 包含 C++ 原生模块，首次安装需要编译。Render 的构建环境会自动处理，约需 1-2 分钟。

**Q: 前端路由刷新 404？**  
A: 已配置 SPA fallback，后端会将所有非 API 请求指向 `index.html`，React Router 可正常工作。

**Q: 如何更新已部署的网站？**  
A: 只需 `git push`，Render 会自动检测并重新构建部署。

**Q: 数据丢了怎么办？**  
A: Render 免费版每次部署会重置文件系统。如需持久化，请升级到 Render 的 Disk 服务，或迁移到 Railway/自有服务器。
