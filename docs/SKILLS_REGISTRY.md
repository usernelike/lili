# lili Hub — CatPaw Skills 总览

> 创建时间：2026-05-19
> 位置：`.catpaw/skills/`（项目级 Skill，随代码库共享）

---

## 什么是这些 Skill？

这些是 **CatPaw Agent Skill** —— 为 AI 编程助手编写的"知识插件"。每个 Skill 都是一个 `SKILL.md` 文件，告诉 AI 如何按照 **lili Hub 项目特有的约定和模式** 来写代码。

当你在 CatPaw 中工作时，AI 会自动读取相关 Skill，从而：
- 写出符合项目风格的代码
- 避免重复踩已知的坑
- 按照正确的架构模式添加新功能
- 在 Code Review 时按项目标准检查

---

## Skills 一览

| # | Skill 名称 | 目录 | 核心用途 | 触发场景 |
|---|-----------|------|---------|---------|
| 1 | **frontend-component** | `.catpaw/skills/frontend-component/` | 前端组件开发规范 | 写新组件/页面/Section 时 |
| 2 | **api-convention** | `.catpaw/skills/api-convention/` | API 开发与调用规范 | 新增接口、前后端联调时 |
| 3 | **stock-data-parser** | `.catpaw/skills/stock-data-parser/` | 腾讯证券数据解析 | 改行情解析、调试数据显示时 |
| 4 | **frontend-hook** | `.catpaw/skills/frontend-hook/` | 自定义 Hook 开发模板 | 写新的数据获取 Hook 时 |
| 5 | **code-review-audit** | `.catpaw/skills/code-review-audit/` | 代码审计清单 | PR 审查、代码质量检查时 |
| 6 | **deploy-guide** | `.catpaw/skills/deploy-guide/` | 部署流程指南 | 本地环境搭建、上线部署时 |
| 7 | **ai-chat-system-prompt** | `.catpaw/skills/ai-chat-system-prompt/` | AI 助手 Prompt 管理 | 改 AI 聊天功能、新增页面时 |
| 8 | **java-backend-pattern** | `.catpaw/skills/java-backend-pattern/` | Java 后端开发模式 | 写 Java Controller/Service 时 |
| 9 | **karpathy-guidelines** | `.catpaw/skills/karpathy-guidelines/` | AI 编码行为准则（通用） | 所有编码、审查、重构任务 |

---

## 详细说明

### 1. frontend-component — 前端组件开发规范

**解决什么问题：** 项目使用 90%+ 内联样式 + CSS 变量体系，无文档化。新人/AI 容易写出不协调的代码。

**包含内容：**
- CSS 变量完整速查表（20 个 design token）
- 标准卡片/标题/按钮代码模板
- `useMobile()` 移动端适配模式（断点 768px）
- `lucide-react` 图标规范（尺寸约定）
- Ant Design 暗色主题覆盖方式
- 命名约定（PascalCase 组件、camelCase props）
- 6 条常见反模式警告

**关键文件参考：**
- `packages/frontend/src/styles/global.css` — 所有 CSS 变量定义
- `packages/frontend/src/pages/StockDetail.tsx` — 组件模式范例（639行）
- `packages/frontend/src/components/Layout/MainLayout.tsx` — 布局模式范例

---

### 2. api-convention — API 开发与调用规范

**解决什么问题：** 双后端架构（Java + Node.js），API 约定不统一容易导致前后端联调问题。

**包含内容：**
- 架构全景图（前端 → Vite Proxy → Java / Node.js）
- 统一响应格式 `ApiResponse<T>` 用法
- `apiFetch()` 的 5 大自动行为（JWT/超时/401/ContentType/清理）
- JWT 认证全流程（登录 → token → Interceptor → userId）
- RESTful 路由命名表（30+ 个已有端点）
- Java Controller 标准模板（构造器注入/getUserId/验证）
- SSE 流式响应前后端模式
- SPA 兜底路由配置方法
- 错误处理对照表

**关键文件参考：**
- `packages/frontend/src/utils/api.ts` — apiFetch 实现（30行）
- `packages/backend-java/src/main/java/com/platform/backend/model/ApiResponse.java`
- `packages/backend-java/src/main/java/com/platform/backend/controller/FinancialController.java`
- `packages/backend-java/src/main/java/com/platform/backend/config/AuthInterceptor.java`

---

### 3. stock-data-parser — 腾讯证券数据解析

**解决什么问题：** `StockService.java` 解析腾讯专有格式（GBK、`~` 分隔），靠数组下标取值，脆弱且无文档。

**包含内容：**
- 3 个 API 端点及参数格式
- **实时行情字段索引表**（parts[0]~parts[45]，15+ 个关键字段）
- **大宗商品字段索引表**（逗号分隔，7 个字段）
- **K 线数据 JSON 手工解析步骤**（day 数组格式）
- **分钟线数据解析步骤**
- 股票代码前缀规则（sh=上海6开头，sz=其他）
- ConcurrentHashMap 缓存策略（5s TTL）
- 6 个常见陷阱提醒

**关键文件参考：**
- `packages/backend-java/src/main/java/com/platform/backend/service/StockService.java`（421行）

---

### 4. frontend-hook — 自定义 Hook 开发模板

**解决什么问题：** `useStockData.ts` 是 466 行巨型文件含 9 个 Hook，急需拆分且需要统一模板。

**包含内容：**
- 核心原则：**一个文件一个 Hook**
- **4 个完整模板**，覆盖所有场景：
  - 模板1：只读数据获取（{ data, loading, error, refetch }）
  - 模板2：轮询数据（带 fetchingRef 防并发）
  - 模板3：CRUD 操作（乐观更新）
  - 模板4：搜索（带防抖）
- 12 条规则检查清单
- 已有 12 个 Hook 的速查表

**关键文件参考：**
- `packages/frontend/src/hooks/useStockData.ts` — 待拆分的巨型 Hook 文件
- `packages/frontend/src/hooks/useMobile.ts` — 良好示例
- `packages/frontend/src/hooks/useLiliDatasource.ts` — 良好示例

---

### 5. code-review-audit — 代码审计清单

**解决什么问题：** 项目历史上发现过 20 个 bug（P0-P3），提炼为可复用的检查清单防止回归。

**包含内容：**
- **P0 致命项（3项）**：认证 header 缺失、事件监听器泄漏、SSE 无 AbortController
- **P1 重要项（6项）**：iOS 输入框缩放、路由兜底、Strict Mode 安全、死按钮、body overflow、轮询堆积
- **P2 质量项（5项）**：命名规范、console 清理、随机数稳定化、防抖、apiFetch 使用
- **P3 性能项（1项）**：强制重排避免
- **反模式快速对照表**（12 个 Wrong → Right）

**关键文件参考：**
- `packages/frontend/docs/PROJECT_AUDIT.md` — 原始审计报告（20个已修复bug）

---

### 6. deploy-guide — 部署流程指南

**解决什么问题：** DEPLOY.md 有 209 行但给人读的，转化为 Skill 后 AI 可执行部署操作。

**包含内容：**
- 本地开发 4 步启动流程（MySQL → .env → Java → 前端）
- 7 个环境变量完整参考表
- Docker 三阶段构建说明
- Render 生产部署步骤
- SPA 路由新增操作清单
- Node.js 辅助后端启动方式
- 6 个常见问题排查表

**关键文件参考：**
- `DEPLOY.md` — 完整部署文档（209行）
- `packages/backend-java/dev.sh` — 启动脚本
- `packages/backend-java/src/main/java/com/platform/backend/config/DatabaseMigration.java`

---

### 7. ai-chat-system-prompt — AI 助手 Prompt 管理

**解决什么问题：** System Prompt 硬编码了平台所有功能描述，改功能时必须同步更新 Prompt，否则 AI 助手给出过时信息。

**包含内容：**
- AI 聊天架构图（前端 → Controller → Kimi API → SSE）
- System Prompt 完整内容摘要（6 大功能模块）
- 输出格式规则（链接格式、禁用 emoji/markdown）
- **修改 Prompt 的触发条件清单**（5 种情况）
- 前端 `parseContent()` 链接解析逻辑
- API 配置表（Key/URL/Model）
- 流式 vs 同步双端点对比
- 请求体 JSON 格式

**关键文件参考：**
- `packages/backend-java/src/main/java/com/platform/backend/controller/AIAssistantController.java`
- `packages/frontend/src/components/FloatingAIChat.tsx`

---

### 8. java-backend-pattern — Java 后端开发模式

**解决什么问题：** Spring Boot 三层架构有项目特有约定（ApiResponse 包装、构造器注入、userId 传递）。

**包含内容：**
- 三层架构图（Controller → Service → Repository）
- **Controller 标准模板**（构造器注入/getUserId/输入验证）
- **Service 模版**（@Service + 业务逻辑）
- **Repository 两种方式**（JPA vs JdbcTemplate）
- Model record 定义方式
- **3 种 Config 模式**：
  - WebConfig（拦截器 + CORS + SPA）
  - DatabaseMigration（幂等 DDL）
  - AuthInterceptor（JWT 校验）
- application.properties 配置模式
- **新增功能的 7 步 Checklist**

**关键文件参考：**
- `packages/backend-java/src/main/java/com/platform/backend/controller/AuthController.java`
- `packages/backend-java/src/main/java/com/platform/backend/config/WebConfig.java`
- `packages/backend-java/src/main/java/com/platform/backend/util/JwtUtil.java`

---

### 9. karpathy-guidelines — AI 编码行为准则（Karpathy 四原则）

**解决什么问题：** LLM 编码时容易犯的通用错误：错误假设、过度工程、无关修改、缺乏验证标准。源自 Andrej Karpathy 对 LLM 编码陷阱的经典观察。

**包含内容：**
- **原则 1：编码前思考** — 明确假设、呈现权衡、困惑时停下来询问
- **原则 2：简洁优先** — 最少代码解决问题，反过度工程（含反模式对照表）
- **原则 3：精准修改** — 只碰必须碰的代码，不"顺手改进"相邻代码
- **原则 4：目标驱动执行** — 将指令转化为可验证目标 + 成功标准循环
- 与项目其他 Skill 的协作流程示例
- 生效标志自检清单

**与其他 Skill 的关系：**
- 本 Skill 是**思维层**（怎么思考），其他 Skill 是**技术层**（用什么格式/API）
- 使用顺序：先遵循本准则 → 再参考具体技术规范 → 最后用 code-review-audit 检查

**来源：** [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) (MIT License)

---

## 如何使用

### 自动触发
CatPaw 会根据你的操作自动加载相关 Skill：
- **任何编码任务** → 自动加载 `karpathy-guidelines`（通用行为准则，优先级最高）
- 写前端组件 → 自动加载 `frontend-component`
- 写 API 接口 → 自动加载 `api-convention` + `java-backend-pattern`
- 改股票数据 → 自动加载 `stock-data-parser`
- Review PR → 自动加载 `code-review-audit` + `karpathy-guidelines`

### 手动引用
你可以在对话中直接要求：
> "请按照 `code-review-audit` skill 检查这段代码"
> "用 `frontend-hook` 模板帮我写一个新的数据获取 hook"

### 修改 Skill
每个 Skill 就是一个 Markdown 文件，可以直接编辑：
```
.catpaw/skills/{skill-name}/SKILL.md
```

---

## Skill 依赖关系

```
                    ┌─────────────────────┐
                    │   code-review-audit │  (检查所有代码)
                    └─────────┬───────────┘
                              │ 引用
              ┌───────────────┼───────────────┐
               ▼               ▼               ▼
    ┌──────────────┐  ┌────────────┐  ┌──────────────┐
    │ frontend-     │  │ api-       │  │ frontend-    │
    │ component     │  │ convention │  │ hook         │
    └──────┬───────┘  └─────┬──────┘  └──────┬───────┘
           │                │                 │
           ▼                ▼                 ▼
    ┌──────────────┐  ┌────────────┐  ┌──────────────┐
    │   stock-data-│  │  java-     │  │   ai-chat-   │
    │   parser      │  │  backend-  │  │ system-prompt│
    └──────────────┘  │  pattern   │  └──────────────┘
                      └─────┬──────┘
                            │
                            ▼
                      ┌────────────┐
                      │ deploy-    │
                      │ guide      │
                      └────────────┘
```

---

## 跨环境使用指南

> CatPaw Skill 原生仅在 CatPaw IDE 中自动加载。以下是其他编辑器/终端的适配方案。

### 方案一：Cursor IDE（已自动配置）

项目已创建 `.cursor/rules/` 目录和 `.cursorrules` 文件，**打开 Cursor 即可自动加载**：

```
.cursorrules                          — 总入口，指引所有 Skill 位置
.cursor/rules/frontend-component.md   — 前端组件规范
.cursor/rules/api-convention.md       — API 约定
.cursor/rules/stock-data-parser.md    — 股票数据解析
.cursor/rules/mega-hook-split.md      — Hook 拆分规则
.cursor/rules/backend-java-pattern.md — Java 后端模式
.cursor/rules/financial-domain.md     — 金融领域知识
.cursor/rules/ai-chat-system-prompt.md— AI 聊天 Prompt
.cursor/rules/deployment-env.md       — 部署环境配置
```

### 方案二：VS Code + GitHub Copilot

在项目根目录创建 `.github/copilot-instructions.md`，Copilot 会自动读取：

```bash
# 将 .cursorrules 内容复制过去
cp .cursorrules .github/copilot-instructions.md
```

### 方案三：Claude Code / Aider 等终端 AI 工具

这些工具通常读取 `CLAUDE.md` 或项目根目录的约定文件：

```bash
# Claude Code: 创建 CLAUDE.md
cp .cursorrules CLAUDE.md

# Aider: 创建 .aider.conf.yml 并在 convention-files 中列出
# 或者直接在对话中 /add .catpaw/skills/frontend-component/SKILL.md
```

### 方案四：任何 AI 工具的通用方法

在对话开头手动注入关键 Skill 内容：

```bash
# 方法1：直接 cat 进 prompt
cat .catpaw/skills/frontend-component/SKILL.md | pbcopy
# 然后粘贴到 AI 对话中

# 方法2：让 AI 自己读取
# 在对话中说："请先读取 .catpaw/skills/ 下的 SKILL.md 文件，按其中的规范编写代码"
```

### 方案五：全局 CatPaw Skill（跨项目）

```bash
# 将 Skill 复制到全局目录，任何 CatPaw 项目都能用
cp -r .catpaw/skills/* ~/.catpaw/skills/
```

---

## 各工具对照表

| 工具 | 配置文件 | 自动加载 | 备注 |
|------|---------|---------|------|
| **CatPaw** | `.catpaw/skills/*/SKILL.md` | ✅ 原生支持 | 最完整体验 |
| **Cursor** | `.cursor/rules/*.md` + `.cursorrules` | ✅ 已配置 | 内容精简版 |
| **VS Code Copilot** | `.github/copilot-instructions.md` | ✅ 自动 | 需手动创建 |
| **Claude Code** | `CLAUDE.md` | ✅ 自动 | 需手动创建 |
| **Aider** | `.aider.conf.yml` | ⚠️ 需配置 | convention-files |
| **其他终端 AI** | 手动粘贴 / 读取文件 | ❌ 手动 | cat + pbcopy |

---

## 更新日志

| 日期 | 操作 | 说明 |
|------|------|------|
| 2026-05-19 | 初始创建 | 8 个 Skill 全部创建完成 |
| 2026-05-19 | 跨环境适配 | 创建 Cursor Rules / .cursorrules，更新文档 |
| 2026-05-20 | 新增 karpathy-guidelines | 集成 Karpathy AI 编码四原则（通用行为准则），支持 CatPaw/Cursor/Claude Code/终端 AI |
