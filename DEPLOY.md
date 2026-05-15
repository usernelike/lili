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

### 3. 配置数据库连接

创建 `packages/backend-java/.env` 文件（不会提交到 Git）：

```properties
MYSQL_URL=jdbc:mysql://localhost:3306/lili_hub?useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
MYSQL_USER=root
MYSQL_PASSWORD=你的密码
```

Spring Boot 会自动读取同目录下的 `.env` 文件（如果安装了 dotenv），或者你可以直接设置环境变量。

### 4. 运行 Java 后端

```bash
cd packages/backend-java
mvn spring-boot:run
```

服务启动后访问：
- http://localhost:8080/health
- http://localhost:8080/api/interview/favorites

### 5. 运行前端（开发模式）

```bash
pnpm dev
```

前端在 http://localhost:3000，通过 Vite proxy 访问 Java 后端。

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

5. 添加环境变量：

| Key | Value |
|-----|-------|
| `PORT` | `8080` |
| `MYSQL_URL` | `jdbc:mysql://aws.connect.psdb.cloud/lili_hub?sslMode=VERIFY_IDENTITY` |
| `MYSQL_USER` | PlanetScale 用户名 |
| `MYSQL_PASSWORD` | PlanetScale 密码 |

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
