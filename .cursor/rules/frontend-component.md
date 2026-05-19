# Frontend Component Development Rules

## Style Convention: Inline Styles + CSS Variables

This project uses 90%+ inline styles with CSS variables as design tokens. Do NOT create CSS module files or styled-components.

### CSS Variable Design Tokens

```css
/* Backgrounds */
--bg-primary: #0a0a0f;       --bg-secondary: #12121a;
--bg-card: #1a1a2e;          --bg-glass: rgba(26,26,46,0.7);
/* Text */
--text-primary: #ffffff;      --text-secondary: #a0a0b8;
--text-muted: #6b6b8a;
/* Accent */
--accent-cyan: #00d4ff;       --accent-purple: #a855f7;
--accent-blue: #3b82f6;       --accent-green: #10b981;
--accent-red: #ef4444;        --accent-orange: #f59e0b;
/* Borders */
--border-subtle: rgba(255,255,255,0.06);  --border-glow: rgba(0,212,255,0.2);
/* Gradients */
--gradient-accent: linear-gradient(135deg, #00d4ff, #a855f7);
```

### Standard Card Pattern
```tsx
<div style={{ padding: isMobile ? 16 : 24, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
```

## Mobile Responsive

Always use `useMobile()` hook (breakpoint: 768px):
- Padding: mobile `16px`, desktop `40px`
- Font size: mobile `-2~4px` smaller
- Grid: mobile `1fr`, desktop multi-column

## Icon Convention

Use **lucide-react** exclusively. Sizes: nav 16-20, headers 20, inline 14-16, mobile -2~4px smaller.

## Naming

Components: PascalCase (`StockDetail.tsx`). Props: camelCase. Files: PascalCase.tsx.

## Anti-Patterns

1. Do NOT create `.css` files for component styles — use inline styles
2. Do NOT hardcode colors — use CSS variables
3. Do NOT forget `fontFamily: 'inherit'` on buttons/inputs
4. Do NOT use `em/rem` — use `px` only
5. Prefer `lucide-react` over `@ant-design/icons`
