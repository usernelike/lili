# 部署指南

后端已迁移到 **Spring Boot + Java 21**，数据库使用 **MySQL**。

---

## 技术架构

- **前端**：React + Vite
- **主后端**：Spring Boot 3 + Java 21 + Maven
- **辅助后端**：Express + Node.js（保留，处理 lili 数据源等外部 API）
- **数据库**：MySQL

---

## 本地开发环境准备

### 1. 安装 Java 21 + Maven

**macOS:**
```bash
brew install openjdk@21 maven
```

**Windows:**
- 下载 [Eclipse Temurin JDK 21](https://adoptium.net/)
- 下载 [Maven](https://maven.apache.org/download.cgi)
- 配置环境变量

验证安装：
```bash
java -version   # 应显示 21
mvn -version    # 应显示 3.9+
```

### 2. 安装 MySQL

**macOS:**
```bash
brew install mysql
brew services start mysql
mysql -u root -e "CREATE DATABASE IF NOT EXISTS lili_hub;"
```

**Windows:**
- 下载 [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- 安装时创建 root 密码
- 创建数据库：`CREATE DATABASE lili_hub;`

### 3. 配置环境变量

在 `packages/backend-java/` 目录下已有 `.env` 文件，打开它填写以下值：

```bash
# 必填：从 https://platform.moonshot.cn/ 获取 API Key
export KIMI_API_KEY=sk-你的Key

# 必填（如果你的本地 MySQL 有密码）
export MYSQL_PASSWORD=你的密码

# 可选：如果你用 Docker 或其他非本地 MySQL，取消注释并修改
# export MYSQL_URL=jdbc:mysql://localhost:3306/lili_hub?...
```

> `.env` 已被 `.gitignore` 忽略，不会提交到 Git。

### 4. 运行 Java 后端

```bash
cd packages/backend-java
./dev.sh
```

这个脚本会自动：
1. 检查 `.env` 文件是否存在
2. 加载环境变量
3. 启动 Spring Boot（`mvn spring-boot:run`）

服务启动后访问：
- http://localhost:8080/health
- http://localhost:8080/api/interview/favorites

### 5. 运行前端（开发模式）

在项目根目录另开一个终端：

```bash
pnpm dev
```

前端在 http://localhost:3000，通过 Vite proxy 访问 Java 后端。

---

## 环境变量总览

`application.properties` 中所有 `${...}` 占位符对应的配置：

| 配置项 | 环境变量名 | 本地开发 | 线上 Render |
|--------|-----------|---------|------------|
| 服务端口 | `PORT` | 默认 `8080` | `render.yaml` 已配置 |
| 数据库地址 | `MYSQL_URL` | 本地 MySQL | **Render 控制台设置** |
| 数据库用户 | `MYSQL_USER` | `root` | **Render 控制台设置** |
| 数据库密码 | `MYSQL_PASSWORD` | 本地密码 | **Render 控制台设置** |
| Kimi API Key | `KIMI_API_KEY` | `.env` 文件或环境变量 | **Render 控制台设置** |
| Kimi API 地址 | `KIMI_API_URL` | 默认 Moonshot | `render.yaml` 已配置，可覆盖 |
| Kimi 模型 | `KIMI_MODEL` | 默认 `kimi-k2.6` | `render.yaml` 已配置，可覆盖 |

**本地开发**：在 `packages/backend-java/` 下创建 `.env` 文件（已被 `.gitignore` 忽略）：
```properties
MYSQL_URL=jdbc:mysql://localhost:3306/lili_hub?useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
MYSQL_USER=root
MYSQL_PASSWORD=你的密码
KIMI_API_KEY=sk-xxx
```

**线上部署**：所有敏感信息通过 Render 控制台的环境变量配置，不要写入代码。

---

## 部署到 Render（生产环境）

### 1. 准备 MySQL 数据库

Render 不提供免费 MySQL，推荐使用 **PlanetScale**（免费层 5GB）：

1. 注册 [planetscale.com](https://planetscale.com/)
2. 创建数据库 `lili-hub`
3. 获取连接字符串（格式类似）：
   ```
   jdbc:mysql://aws.connect.psdb.cloud/lili_hub?sslMode=VERIFY_IDENTITY
   ```
4. 用户名和密码在 PlanetScale 控制台获取

### 2. 推送代码到 GitHub

```bash
git add .
git commit -m "feat: Java backend + MySQL"
git push origin main
```

### 3. 在 Render 创建 Web Service

1. 打开 [render.com](https://render.com/)
2. **New +** → **Web Service**
3. 连接 GitHub 仓库
4. 配置：

| 配置项 | 值 |
|--------|-----|
| **Name** | `lili-hub` |
| **Runtime** | `Docker`（会自动识别 Dockerfile） |
| **Plan** | `Free` |

5. 添加环境变量（在 Render Dashboard → 你的 Service → Environment 标签页）：

| Key | 必填 | 说明 |
|-----|------|------|
| `MYSQL_URL` | ✅ | 数据库连接地址，如 `jdbc:mysql://xxx` |
| `MYSQL_USER` | ✅ | 数据库用户名 |
| `MYSQL_PASSWORD` | ✅ | 数据库密码 |
| `KIMI_API_KEY` | ✅ | 从 [Kimi 开放平台](https://platform.moonshot.cn/) 获取的 API Key |
| `KIMI_API_URL` | ❌ | 默认 `https://api.moonshot.cn/v1/chat/completions`，一般不用改 |
| `KIMI_MODEL` | ❌ | 默认 `kimi-k2.6`，可换其他模型如 `moonshot-v1-8k` |

> ⚠️ **安全提醒**：这些敏感信息**不要写在代码里**，只在 Render 控制台配置。`render.yaml` 里已经把敏感字段的 `value` 留空了。

6. 点击 **Create Web Service**

Docker 构建过程：
- Stage 1：Node.js 构建前端 → 产物复制到 Java 的 static 目录
- Stage 2：Maven 构建 Java 后端 → 打包成 jar
- Stage 3：JRE 运行 jar

等待 3-5 分钟，状态变为 ✅ **Live** 后即可访问。

---

## 保留的 Node.js 后端

Node.js 后端代码保留在 `packages/backend/` 目录，如果需要运行：

```bash
cd packages/backend
pnpm dev        # 开发模式
pnpm build      # 构建
pnpm start      # 生产模式
```

Node.js 后端目前仍处理：
- `/api/financial/lili/query` — lili 股票数据源
- `/api/enterprise/*` — 企业查询

后续如需完全迁移到 Java，可继续开发 `FinancialController` 和 `EnterpriseController`。

---

## 常见问题

**Q: Java 后端启动报错 "Communications link failure"？**  
A: MySQL 没启动或连接配置错误。检查 MySQL 服务状态和 `application.properties` 中的连接参数。

**Q: 前端刷新 404？**  
A: Java 后端已配置 SPA fallback，所有非 API 路由会返回 `index.html`。

**Q: 如何更新部署？**  
A: `git push` 后 Render 会自动重新构建 Docker 镜像并部署。
