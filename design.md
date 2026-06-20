# 🎨 Design System — Opportunity Radar AI

A reference guide for the product's visual system, component patterns, and theming.

---

## 🎨 Color Palette

### Brand gradient

| Token | Value | Usage |
|---|---|---|
| `#6366F1` | Indigo 500 | Primary brand accent |
| `#8B5CF6` | Violet 500 | Gradient endpoint |
| `#22D3EE` | Cyan 400 | Accent highlights |

### Semantic tokens

| Variable | Dark | Light | Usage |
|---|---|---|---|
| `--bg-primary` | `#0A0F1E` | `#F8FAFC` | Page background |
| `--bg-secondary` | `#0D1526` | `#F1F5F9` | Panels and cards |
| `--bg-card` | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.80)` | Content cards |
| `--border-subtle` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` | Borders and dividers |
| `--text-primary` | `#E2E8F0` | `#0F172A` | Main text |
| `--text-secondary` | `#94A3B8` | `#475569` | Secondary text |

### Category colors

| Category | Color |
|---|---|
| Hackathon | `#C084FC` |
| Internship | `#60A5FA` |
| Scholarship | `#FBBF24` |
| Fellowship | `#2DD4BF` |
| Open-source | `#4ADE80` |
| Startup | `#FB923C` |
| Competition | `#F472B6` |
| Grant | `#818CF8` |

### Score colors

| Range | Color |
|---|---|
| `70+` | `#4ADE80` |
| `40–69` | `#FBBF24` |
| `<40` | `#94A3B8` |

### Deadline urgency

| Days left | Color |
|---|---|
| `0–1` | `#EF4444` |
| `2–3` | `#F97316` |
| `4–7` | `#F59E0B` |
| `8+` | `#4ADE80` |

---

## ✍️ Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Headings | Inter | 700–900 | 28px–48px |
| Body | Inter | 400–500 | 13px–16px |
| Labels | Inter | 600 | 11px–12px |

Gradient headlines use:

```css
background: linear-gradient(135deg, #6366F1, #22D3EE);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 🪟 Component Patterns

### Glass cards

- `background: var(--bg-card)`
- `backdrop-filter: blur(20px)`
- `border: 1px solid var(--border-subtle)`
- `border-radius: 16px`
- hover lift + subtle glow

### Buttons

- `.btn-primary` uses a brand gradient fill
- `.btn-secondary` uses glassy fill and subtle border
- All buttons use `inline-flex`, `gap`, and motion transitions

### Badges

- Pill-shaped badges with category color variants
- Uppercase label text and compact sizing

### Inputs

- Glass background with brand focus ring
- Rounded corners and low contrast border

---

## 🌊 Background Effects

### Floating orbs

- Purple orb: top-left, large blur, subtle opacity
- Cyan orb: bottom-right, soft glow

### Scrollbar

- Custom narrow scrollbar
- Transparent track and indigo thumb

---

## 🎬 Animations

| Element | Trigger | Pattern |
|---|---|---|
| Page cards | mount | `opacity 0→1`, `y 20→0` |
| Lists | render | staggered motion |
| Deadline progress | animation | easing fill |
| Hover lift | pointer | subtle translate |
| Chat transitions | conversation | markdown rendering |

Key CSS animations:

```css
@keyframes urgentPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
  50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 📐 Layout

- Sidebar + fluid main page layout
- Dashboard uses a two-column grid
- Opportunity cards use responsive grid with minimum width
- Mobile stacks sections vertically

---

## 🌓 Theming

The app uses `ThemeProvider` to set `data-theme="light"` on `<html>`.

- Default is dark mode
- Theme state persists in Zustand under `opportunity-radar-store`

---

## 🎯 Design principles

1. Use depth from glassmorphism, not heavy shadows
2. Make urgency visible with red/orange/green cues
3. Keep motion purposeful and informative
4. Keep visual intensity low so content stands out
5. Use consistent radius values throughout the UI
