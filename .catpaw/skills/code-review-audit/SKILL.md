---
name: code-review-audit
description: Code review and audit checklist for the lili Hub project, derived from 20 previously-found bugs across P0-P3 severity levels. Use when reviewing pull requests, auditing code changes, or checking code quality. Covers authentication security, memory leaks (event listeners, SSE AbortController), iOS Safari compatibility, React Strict Mode safety, naming conventions, performance anti-patterns, and project-specific pitfalls.
---

# Code Review & Audit Checklist

## How to Use

Run through each section below when reviewing code changes. Check every item that applies to the changed files.

---

## P0 — Critical (Must Fix Before Merge)

### 1. Authentication Header Present

**Bug pattern**: Using raw `fetch()` instead of `apiFetch()`, causing requests to send without `Authorization: Bearer <token>`.

```typescript
// ❌ BAD: No auth header
const res = await fetch('/api/financial/positions')

// ✅ GOOD: Uses apiFetch which auto-attaches token
import { apiFetch } from '../utils/api'
const res = await apiFetch('/api/financial/positions')
```

### 2. Event Listener Cleanup (Memory Leak Prevention)

**Bug pattern**: Registering anonymous functions as event listeners, then failing to remove them on cleanup.

```typescript
// ❌ BAD: Anonymous function can never be removed
useEffect(() => {
  window.addEventListener('resize', () => handleResize())  // New function each render!
  return () => window.removeEventListener('resize', () => handleResize())  // Different function!
}, [])

// ✅ GOOD: Named/stable reference
useEffect(() => {
  const handleResize = () => { /* ... */ }
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

### 3. SSE / Streaming AbortController

**Bug pattern**: Reading from a streaming response (`ReadableStream`) without `AbortController`. Stream continues after component unmount → state updates on dead component.

```typescript
// ❌ BAD: No abort control
const res = await apiFetch('/api/ai/chat', { method: 'POST', body })
const reader = res.body?.getReader()
while (true) { /* reads forever, even if unmounted */ }

// ✅ GOOD: AbortController ref, aborts on unmount
const abortRef = useRef<AbortController | null>(null)

useEffect(() => {
  const controller = new AbortController()
  abortRef.current = controller

  ;(async () => {
    const res = await apiFetch('/api/ai/chat', {
      method: 'POST',
      signal: controller.signal,
    })
    // read stream...
  })()

  return () => controller.abort()
}, [])
```

---

## P1 — Important (Should Fix)

### 4. iOS Safari Input Zoom Fix

**Bug pattern**: Input `font-size < 16px` triggers auto-zoom on focus in iOS Safari.

```css
/* ❌ BAD */
input { font-size: 14px; }  /* Triggers zoom */

/* ✅ GOOD */
input { font-size: 16px; }  /* No zoom */
```

### 5. Route Fallback Coverage

**Bug pattern**: Missing catch-all route causes blank page on sub-path access.

```tsx
// In App.tsx:
<Routes>
  <Route path="/login" element={<LoginPage />} />
  {/* Accessing /login/anything shows NOTHING without this: */}
  <Route path="*" element={<NotFound />} />  /* ✅ Required at each level */
</Routes>
```

### 6. useEffect + StrictMode Safety

**Bug pattern**: `useEffect(() => { resetForm() }, [])` runs twice in React 18 StrictMode → visible flicker.

```tsx
// ❌ BAD: Destructive effect on mount
useEffect(() => { setForm({ username: '', password: '' }) }, [])

// ✅ GOOD: Only initialize state if needed, don't reset in effect
const [form, setForm] = useState(() => ({ username: '', password: '' }))
```

### 7. Interactive Elements Must Have Handlers

**Bug pattern**: Buttons/links with no `onClick` handler → clicking does nothing.

```tsx
// ❌ BAD
<button style={{...}}>立即体验</button>  /* Dead button */

// ✅ GOOD
<button onClick={() => navigate('/signup')} style={{...}}>立即体验</button>
```

### 8. Body Overflow Side Effects

**Bug pattern**: Unconditionally resetting `document.body.style.overflow` breaks other components' scroll-locking.

```tsx
// ❌ BAD
useEffect(() => {
  return () => { document.body.style.overflow = '' }  /* Breaks mobile menu lock */
}, [])

// ✅ GOOD: Only restore what you changed, check before clearing
useEffect(() => {
  const hadLock = document.body.dataset.scrollLocked === 'true'
  return () => {
    if (!hadLock) document.body.style.overflow = ''
  }
}, [])
```

### 9. Polling Request Concurrency

**Bug pattern**: `setInterval(fetch, N)` fires even if previous fetch hasn't completed → request pile-up under slow networks.

```typescript
// ❌ BAD
useEffect(() => {
  const interval = setInterval(fetchData, 15000)
  return () => clearInterval(interval)
}, [])

// ✅ GOOD: Use ref guard
const fetchingRef = useRef(false)
const fetchData = useCallback(async () => {
  if (fetchingRef.current) return  /* Skip if busy */
  fetchingRef.current = true
  try { /* ... */ } finally { fetchingRef.current = false }
}, [])
```

---

## P2 — Code Quality (Nice to Fix)

### 10. Component Naming: PascalCase

```typescript
// ❌ BAD
export function liliStockQuery() { ... }

// ✅ GOOD
export function LiliStockQuery() { ... }
```

### 11. No console.error / console.log in Production

```typescript
// ❌ BAD
catch (err) { console.error('Failed:', err) }

// ✅ GOOD: Handle silently or show user-facing error
catch (err) { setError('操作失败') }

// Or truly silent for polling:
catch { /* ignore network blips for periodic data */ }
```

### 12. Stable Random Values (No Re-render Regeneration)

```tsx
// ❌ BAD: New path every render → visual jitter
function Sparkline() {
  const path = `M0 ${Math.random()*100} L50 ${Math.random()*100} ...`
  return <svg><path d={path} /></svg>
}

// ✅ GOOD: Generate once with useMemo or useRef
const path = useMemo(() => generatePath(), [seedData])
```

### 13. Resize Event Debouncing

```typescript
// ❌ BAD: Fires on every pixel
window.addEventListener('resize', () => setIsMobile(window.innerWidth <= 768))

// ✅ GOOD: Debounce with timer
let timer: ReturnType<typeof setTimeout>
window.addEventListener('resize', () => {
  clearTimeout(timer)
  timer = setTimeout(() => setIsMobile(window.innerWidth <= 768), 150)
})
```

### 14. API Fetch Must Have Timeout + Error Handling

Already handled by the shared `apiFetch()` utility. Just ensure all calls go through it.

---

## P3 — Performance (Optimization)

### 15. Avoid Forced Reflow (getBoundingClientRect in Render)

```tsx
// ❌ BAD: Called during render → forces layout recalculation
<div style={{ left: elem.getBoundingClientRect().x }}>

// ✅ GOOD: Use refs + requestAnimationFrame for position tracking
const ref = useRef<HTMLDivElement>(null)
// Read layout properties inside rAF callback, not during render
```

---

## Project-Specific Anti-Pattern Quick Reference

| Pattern | Wrong | Right |
|---------|-------|-------|
| HTTP requests | `fetch()` | `apiFetch()` |
| Auth headers | Manual set | Automatic via `apiFetch` |
| Styles | CSS files / className | Inline `style={}` with CSS vars |
| Icons | `@ant-design/icons` | `lucide-react` |
| Component names | camelCase | PascalCase |
| Hook files | Multiple hooks per file | One hook per file |
| Error logging | `console.error` | Silent or user-facing |
| Polling | Naked `setInterval` | `setInterval` + `fetchingRef` guard |
| SSE streams | No abort | `AbortController` + cleanup |
| Event listeners | Anonymous fn | Named fn reference |
| Mobile input | `font-size < 16px` | `font-size >= 16px` |
| Random data | In render body | `useMemo` / `useRef` |
