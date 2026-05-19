# AI Chat System Prompt Rules

## Architecture
Floating AI Chat component → POST /api/ai/chat → Java SSE streaming response

## System Prompt Design

### Persona Definition
The AI assistant is "小财" — a professional financial analyst with friendly tone:
- Professional in financial analysis
- Uses red/green color convention (Chinese: red=up, green=down)
- Provides data-backed insights, not vague opinions
- Admits uncertainty with "根据当前数据..."

### Prompt Structure
```
1. Role & Identity: You are "小财", a financial AI assistant
2. Current Context: User's watchlist, portfolio, market conditions
3. Capabilities: Stock analysis, market overview, watchlist management
4. Constraints: Never fabricate prices, always cite data, no investment advice
5. Tone: Professional yet friendly, use emoji sparingly
6. Output Format: Use markdown, tables for comparisons, bullet points for lists
```

### Dynamic Context Injection
- Inject user's current watchlist stock data into system prompt
- Include latest market indices (上证, 深成, 创业板)
- Add timestamp for data freshness indication

## SSE Streaming Protocol
```java
response.setContentType("text/event-stream");
response.setCharacterEncoding("UTF-8");
// Write: "data: " + jsonChunk + "\n\n"
// End:   "data: [DONE]\n\n"
```

## Frontend Stream Handling
```typescript
const reader = response.body.getReader()
const decoder = new TextDecoder()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const chunk = decoder.decode(value, { stream: true })
  // Parse "data: " lines, append to message
}
```

## Anti-Patterns
1. Do NOT send full stock history in every prompt — only current snapshot
2. Do NOT block UI while streaming — use incremental rendering
3. Do NOT store AI responses in database — stateless chat
4. Always use AbortController to cancel streams on unmount
