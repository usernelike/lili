# 前端项目审计报告

> 审计时间：2026-05-19  
> 审计范围：`packages/frontend/src/**/*.{ts,tsx,css}`

---

## 一、严重问题（P0）—— 已修复

### 1. usePositions hook 使用原始 fetch，Authorization 缺失

**位置**：`src/hooks/useStockData.ts:403-404`

**问题**：持仓查询使用原始 `fetch()` 而非 `apiFetch()`，请求不携带 `Authorization` header，导致接口返回 401，功能完全不可用。

### 2. ParticleBackground resize 事件监听器内存泄漏

**位置**：`src/components/ParticleBackground/ParticleBackground.tsx:91-94`

**问题**：使用匿名函数注册 resize 事件，cleanup 时 `removeEventListener` 传入的是 `resize` 函数而非注册的匿名函数，导致事件监听器永远无法移除。每次进入首页都会新增一个监听器。

### 3. FloatingAIChat 没有 AbortController

**位置**：`src/components/FloatingAIChat.tsx:102-164`

**问题**：SSE 流式读取在组件卸载后继续执行，可能导致对已卸载组件的状态更新。应使用 AbortController 中断请求。

---

## 二、重要问题（P1）—— 已修复

### 4. iOS Safari 输入框聚焦自动缩放

**位置**：`src/pages/LoginPage.tsx`, `src/pages/RegisterPage.tsx`

**问题**：输入框 `font-size: 15px`，在 iOS Safari 上聚焦时会触发页面自动缩放（小于 16px 时），导致布局混乱。

### 5. 路由 `/login/*` 子路径未定义，访问时页面空白

**位置**：`src/App.tsx`

**问题**：只定义了 `/login` 精确匹配，访问 `/login/abc` 等子路径时没有任何路由匹配，页面完全空白。

### 6. LoginPage 挂载时强制清空表单

**位置**：`src/pages/LoginPage.tsx:17-22`

**问题**：`useEffect` 依赖数组为空，每次组件挂载都会清空表单状态，在 Strict Mode 下造成闪烁。

### 7. TechStackSection "立即体验"按钮无点击事件

**位置**：`src/sections/TechStackSection.tsx:245`

**问题**：CTA 按钮没有任何 `onClick`，点击无反应。

### 8. ScrollToTop 覆盖 body overflow 样式

**位置**：`src/components/ScrollToTop/ScrollToTop.tsx:21`

**问题**：路由切换时无条件重置 `document.body.style.overflow = ''`，可能意外解锁移动端菜单的滚动锁定。

### 9. useMarketIndices / useCommodities 慢网络下 interval 堆积

**位置**：`src/hooks/useStockData.ts:198-202`, `226-230`

**问题**：`setInterval(fetch, 15000)` 如果上一次请求尚未完成（慢网络），会并发执行多个请求，可能导致服务器压力增大。

---

## 三、代码质量问题（P2）—— 已修复

### 10. 组件命名不符合 React 约定

**位置**：`src/pages/LiliStockQuery.tsx:38`

**问题**：组件使用小驼峰 `liliStockQuery`，应为 PascalCase。

### 11. 生产环境遗留 console.error

**位置**：`src/hooks/useStockData.ts`, `src/hooks/useLiliDatasource.ts`

**问题**：多处 `console.error` 污染生产环境控制台。

### 12. MiniSparkline 每次渲染重新生成随机数

**位置**：`src/sections/FinancialPreviewSection.tsx:24-41`

**问题**：每次渲染 `Math.random()` 生成新 SVG 路径，sparkline 图形不断变化，消耗渲染性能。

### 13. useMobile hook 没有防抖

**位置**：`src/hooks/useMobile.ts`

**问题**：resize 事件没有防抖，快速调整窗口时频繁触发 setState。

### 14. apiFetch 缺少超时和统一错误处理

**位置**：`src/utils/api.ts`

**问题**：无请求超时、无 401 统一处理、无网络错误拦截。

---

## 四、性能问题（P3）—— 已修复

### 15. AnimatedCharacters 强制重排

**位置**：`src/components/AnimatedCharacters.tsx`

**问题**：4 组 mousemove 监听器 + 每次渲染调用 `getBoundingClientRect()` 强制重排。建议改用 rAF + ref 直接操作 DOM。

---

## 五、架构/设计问题（建议后续优化）

### 16. 全局 `* { scrollbar-width: none !important }` 过于激进

**影响**：覆盖所有元素包括第三方库内部，调试困难。

### 17. 内联样式泛滥

**统计**：90%+ 样式通过内联 `style` 实现。影响可读性、无法使用 CSS 媒体查询、hover 依赖 JS 事件。

### 18. Monolithic hook 文件

`useStockData.ts` 466 行包含 8 个 hook，建议拆分为独立文件。

### 19. 没有 Error Boundary

任何组件抛错都会导致整个应用白屏。

### 20. 测试覆盖率低

仅有一个测试文件且测试的是对象结构而非 hook 行为。
