# lili Hub - 多功能集成平台

一个基于 React + Node.js 的多功能集成平台，支持企业信息查询、金融数据分析等功能。

## 技术栈

### 前端
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Ant Design** - UI 组件库
- **React Router** - 路由管理
- **Axios** - HTTP 请求

### 后端
- **Node.js** - 运行环境
- **Express** - Web 框架
- **TypeScript** - 类型安全
- **tsx** - 开发时热重载

## 项目结构

```
platform-hub/
├── packages/
│   ├── frontend/          # 前端应用
│   │   ├── src/
│   │   │   ├── components/   # 公共组件
│   │   │   │   └── Layout/
│   │   │   │       └── MainLayout.tsx
│   │   │   ├── pages/        # 页面
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── EnterpriseQuery.tsx
│   │   │   │   ├── FinancialData.tsx
│   │   │   │   └── NotFound.tsx
│   │   │   ├── styles/       # 样式文件
│   │   │   │   └── global.css
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   ├── backend/           # 后端服务
│   │   ├── src/
│   │   │   ├── routes/       # API 路由
│   │   │   │   ├── index.ts
│   │   │   │   ├── enterprise.ts
│   │   │   │   └── financial.ts
│   │   │   └── index.ts
│   │   ├── .env.example
│   │   └── package.json
│   └── shared/            # 共享代码
│       ├── src/
│       │   └── index.ts    # 类型定义、工具函数
│       └── package.json
├── docs/                  # 文档
├── scripts/               # 脚本工具
├── package.json           # 根 package.json
├── pnpm-workspace.yaml    # pnpm 工作区配置
└── README.md
```

## 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 9

### 安装依赖

```bash
# 安装 pnpm（如果还没有）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 开发模式

```bash
# 同时启动前端和后端（推荐）
pnpm dev

# 或单独启动
pnpm --filter @platform/frontend dev
pnpm --filter @platform/backend dev
```

启动后：
- 前端: http://localhost:3000
- 后端: http://localhost:8080
- 后端健康检查: http://localhost:8080/health

### 构建

```bash
# 构建所有包
pnpm build
```

### 项目部署

#### 前端部署
前端构建产物在 `packages/frontend/dist/` 目录，可部署到：
- Vercel / Netlify（静态托管）
- Nginx（服务器）
- CDN

#### 后端部署
后端构建产物在 `packages/backend/dist/` 目录：

```bash
# 1. 构建
pnpm build

# 2. 生产环境启动
cd packages/backend
cp .env.example .env  # 根据实际情况修改配置
pnpm start
```

推荐使用 **PM2** 管理 Node.js 进程：

```bash
# 全局安装 PM2
npm install -g pm2

# 启动
pm2 start packages/backend/dist/index.js --name platform-hub-api

# 查看状态
pm2 status
```

## API 接口

### 企业查询
- `GET /api/enterprise/search?keyword=` - 搜索企业
- `GET /api/enterprise/:id` - 获取企业详情

### 金融数据
- `GET /api/financial/stocks` - 获取股票列表
- `GET /api/financial/stocks/:code` - 获取股票详情

## 开发计划

- [x] 项目基础架构搭建
- [x] 前端基础布局和路由
- [x] 后端基础 API 服务
- [ ] 接入真实企业数据源
- [ ] 接入真实金融数据 API
- [ ] 用户认证系统
- [ ] 数据可视化图表
- [ ] 移动端适配

## 法律合规声明

**lili Hub 仅供学习研究和技术交流使用。**

使用本平台时必须遵守：
- 《中华人民共和国网络安全法》
- 《中华人民共和国数据安全法》
- 《中华人民共和国个人信息保护法》
- 《中华人民共和国证券法》

**重要限制**：
- 金融数据仅供参考，**不构成任何投资建议**
- 企业数据仅用于合法商业决策，禁止用于诈骗、骚扰等违法活动
- 禁止高频爬取、批量抓取数据用于商业转售
- 禁止利用平台数据从事内幕交易、市场操纵等违法行为

详细法律条款请查看 [LEGAL.md](./LEGAL.md)。

## 许可证

MIT
