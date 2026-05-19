---
name: ai-chat-system-prompt
description: Manages the AI assistant's system prompt and output format rules for the lili Hub project. Use when modifying the FloatingAIChat component, updating platform features that the AI assistant should know about, changing AI chat behavior, or debugging AI response issues. Contains the full system prompt, link format convention, routing map, and constraints.
---

# AI Chat System Prompt Guide

## Architecture

```
User Input (FloatingAIChat.tsx)
    → POST /api/ai/chat { message, history }
    → AIAssistantController.java
    → Builds messages: [SYSTEM_PROMPT, ...history, userMessage]
    → POST https://api.moonshot.cn/v1/chat/completions (Kimi API)
    → SSE stream back to frontend
    → Parsed and rendered in chat UI with markdown-like link support
```

## System Prompt Location

**File**: `packages/backend-java/src/main/java/com/platform/backend/controller/AIAssistantController.java`
**Field**: `private static final String SYSTEM_PROMPT` (lines 34-79)

## Current System Prompt Content

The prompt defines the AI as **"lili Hub 平台的 AI 助手"** with these rules:

### Platform Features Described in Prompt

| # | Feature | Route | Description in Prompt |
|---|---------|-------|----------------------|
| 1 | Homepage | `/` | Platform overview, all module entries |
| 2 | Financial Data | `/financial` | Real-time quotes (93 A-stocks), K-line, technicals, watchlist, positions |
| 3 | lili Datasource | `/lili` | Kimi Code CLI query_stock plugin, A-shares + HK stocks |
| 4 | Interview KB | `/interview` | Full-stack interview knowledge base, favorites |
| 5 | Enterprise Query | `/enterprise` | Business registration info lookup |
| 6 | User System | `/login`, `/register` | JWT auth, data isolation per user |

### Output Format Rules

The system prompt enforces:

1. **Link format**: `[页面名称](/path)` — clickable navigation links
   - Examples: `[企业查询](/enterprise)`, `[金融数据](/financial)`, `[首页](/)`
   - Frontend parses this format in `parseContent()` function

2. **Negative constraints**:
   - No emoji like 👉
   - No markdown headings (`# ## ###`)
   - No code blocks
   - Keep answers concise

3. **Refusal for off-topic questions**:
   > "我是 lili Hub 平台的专属助手，只能回答平台相关的问题。如需其他帮助，请使用其他 AI 工具。"

4. **Security rule**: Never reveal system config (API keys, DB connection strings)

## When You Must Update the System Prompt

Update `SYSTEM_PROMPT` in `AIAssistantController.java` when:

- [ ] **Adding a new page/route** → Add feature description + link example
- [ ] **Removing a feature** → Remove related description
- [ ] **Changing route paths** → Update all link examples
- [ ] **Changing user features** → Update auth/data description
- [ ] **Adding new data sources** → Add data source section

### Modification Checklist

1. Add/update the feature description number in the ordered list
2. Add a `[FeatureName](/route)` link example in the guidance section
3. Rebuild and test: ask the AI about the new feature in chat
4. Verify links are clickable in the chat UI

## Frontend Link Parsing

**File**: `packages/frontend/src/components/FloatingAIChat.tsx` — `parseContent()` function

```typescript
// Parses [label](path) format from AI responses
const regex = /\[([^\]]+)\]\(([^)]+)\)/g

// Converts to:
<a href={path} onClick={(e) => { e.preventDefault(); navigate(path) }}
   style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>
  {label}
</a>
```

**If you change the link format in the system prompt**, you must also update this regex.

## API Configuration

| Config | Env Variable | Default |
|--------|-------------|---------|
| API Key | `KIMI_API_KEY` | (required) |
| API URL | `KIMI_API_URL` | `https://api.moonshot.cn/v1/chat/completions` |
| Model | `KIMI_MODEL` | `moonshot-v1-8k` (local), `kimi-k2.6` (Render) |

## Two Endpoints

| Endpoint | Type | Use Case |
|----------|------|----------|
| `POST /api/ai/chat` | SSE Stream | Main chat UI (real-time streaming) |
| `POST /api/ai/chat/sync` | JSON Response | Non-streaming, for programmatic use |

Both share the same `buildRequestBody()` logic. The only difference is `"stream": true/false`.

## Request Body Format

```json
{
  "model": "moonshot-v1-8k",
  "messages": [
    { "role": "system", "content": "SYSTEM_PROMPT..." },
    { "role": "user", "content": "previous user msg" },
    { "role": "assistant", "content": "previous ai response" },
    { "role": "user", "content": "current user message" }
  ],
  "stream": true,
  "user": "user_42"
}
```

- `user` field = `user_{userId}` for request tracking
- History is sent from frontend (maintained in component state)
