---
name: frontend-component
description: Guide for developing React components in the lili Hub frontend project. Use when creating or modifying React components, pages, sections, or UI elements in packages/frontend/. Covers inline style conventions, CSS variable design tokens, mobile responsive patterns with useMobile(), icon usage (lucide-react), component structure rules, and naming conventions.
---

# Frontend Component Development Guide

## Project Structure

```
packages/frontend/src/
├── components/    # Reusable UI components (each in own subfolder)
│   ├── Layout/
│   ├── GlobalScrollbar/
│   └── ...
├── pages/         # Route-level page components (one file per route)
├── sections/      # Homepage sections (Hero, TechStack, etc.)
├── hooks/         # Custom React hooks
├── utils/         # Utility functions (apiFetch, etc.)
├── styles/        # Global CSS (global.css)
└── types/         # TypeScript type definitions
```

**Rule**: Pages go in `pages/`, reusable components in `components/` (with subfolder), homepage blocks in `sections/`.

## Style Convention: Inline Styles + CSS Variables

This project uses **90%+ inline styles** with CSS variables as design tokens. Do NOT create CSS module files or styled-components.

### CSS Variable Design Tokens (from global.css)

```css
/* Backgrounds */
--bg-primary: #0a0a0f;       /* Main background */
--bg-secondary: #12121a;     /* Secondary bg */
--bg-card: #1a1a2e;          /* Card/panel background */
--bg-glass: rgba(26,26,46,0.7); /* Glass morphism */

/* Text */
--text-primary: #ffffff;
--text-secondary: #a0a0b8;
--text-muted: #6b6b8a;

/* Accent Colors */
--accent-cyan: #00d4ff;      /* Primary accent */
--accent-purple: #a855f7;    /* Secondary accent */
--accent-blue: #3b82f6;
--accent-green: #10b981;     /* Positive / up */
--accent-red: #ef4444;       /* Negative / down */
--accent-orange: #f59e0b;    /* Warning */

/* Borders */
--border-subtle: rgba(255,255,255,0.06);
--border-glow: rgba(0,212,255,0.2);

/* Gradients */
--gradient-hero: linear-gradient(135deg, #0a0a0f 0%, #1a1a3e 50%, #0a0a0f 100%);
--gradient-accent: linear-gradient(135deg, #00d4ff, #a855f7);
```

### Standard Card Pattern

Every content card follows this pattern:

```tsx
<div style={{
  padding: isMobile ? 16 : 24,
  borderRadius: 16,
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
}}>
  {/* content */}
</div>
```

### Section Header Pattern

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
  <IconName size={20} style={{ color: 'var(--accent-cyan)' }} />
  <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700 }}>Title</h2>
</div>
```

## Mobile Responsive Pattern

Always use the `useMobile()` hook (breakpoint: 768px) for responsive layouts:

```tsx
import { useMobile } from '../hooks/useMobile'

function MyComponent() {
  const isMobile = useMobile()

  return (
    <div style={{
      padding: isMobile ? '80px 16px 40px' : '100px 40px 60px',
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      {/* Grid changes columns on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
        {/* ... */}
      </div>
    </div>
  )
}
```

**Key patterns:**
- Padding: mobile `16px`, desktop `40px` (or `24px` for inner cards)
- Font size: mobile `-2~4px` smaller than desktop
- Grid: mobile `1fr`, desktop `1fr 1fr` or `repeat(3, 1fr)` etc.
- Full-width on mobile, constrained (`maxWidth: 1100`) on desktop

## Icon Convention

Use **lucide-react** exclusively. Import individual icons:

```tsx
import { Home, BarChart3, Settings, User } from 'lucide-react'

// Usage
<Home size={20} color="var(--accent-cyan)" />
<BarChart3 size={isMobile ? 18 : 24} />
```

**Size guidelines:**
- Navigation/icons: `16-20`
- Section headers: `20`
- Inline with text: `14-16`
- Buttons: `16-18`
- Mobile: `2-4px` smaller than desktop

## Typography

- **Font family**: `'Inter', -apple-system, BlinkMacSystemFont` (set globally)
- **Page titles**: `fontSize: 22-28, fontWeight: 700`
- **Section headings**: `fontSize: 15-18, fontWeight: 700`
- **Body text**: `fontSize: 13-14`
- **Labels/captions**: `fontSize: 11-12, color: var(--text-muted)`
- **Input placeholder**: `color: var(--text-muted)`

## Button Patterns

### Primary Button
```tsx
<button style={{
  padding: '10px 24px',
  borderRadius: 10,
  border: 'none',
  background: 'var(--gradient-accent)',
  color: '#fff',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
}}>
  Button Text
</button>
```

### Ghost/Text Button
```tsx
<button style={{
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: 8,
  fontFamily: 'inherit',
  transition: 'all 0.2s',
}}
onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-cyan)' }}
onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}>
  Text
</button>
```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `StockDetail.tsx`, `FloatingAIChat.tsx` |
| Files | PascalCase.tsx | `MainLayout.tsx` |
| Directories | PascalCase or kebab-case | `GlobalScrollbar/` |
| Props | camelCase | `isLoading`, `onClick` |
| CSS variables | kebab-case with `--` prefix | `--accent-cyan` |
| Handler functions | `handle` + verb | `handleClick`, `handleSubmit` |

## Ant Design Usage

When using Ant Design components (Tag, Table, Input, etc.), always override styles to match dark theme:

```tsx
<Tag style={{
  background: isUp ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
  color: isUp ? 'var(--accent-green)' : 'var(--accent-red)',
  border: 'none',
  fontWeight: 600,
}}>
  {label}
</Tag>
```

Global Ant Design overrides are already in `styles/global.css`. Prefer inline style overrides per-component for specific adjustments.

## Common Anti-Patterns to Avoid

1. **Do NOT** create `.css` / `.module.css` files for component styles — use inline styles
2. **Do NOT** use `className` for visual styling — use `style={}` prop
3. **Do NOT** hardcode color values — always use CSS variables like `var(--accent-cyan)`
4. **Do NOT** forget `fontFamily: 'inherit'` on buttons and inputs
5. **Do NOT** use `em/rem` units — use `px` exclusively
6. **Do NOT** import icons from `@ant-design/icons` unless necessary — prefer `lucide-react`
