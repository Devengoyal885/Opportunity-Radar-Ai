# 🎨 Design System — Opportunity Radar AI

A reference guide for the product's visual system, component patterns, and theming.

**Live app:** [opportunity-radar-ai.netlify.app/dashboard](https://opportunity-radar-ai.netlify.app/dashboard)

---

## 📖 Table of Contents

- [Design Philosophy](#-design-philosophy)
- [Color Palette](#-color-palette)
- [Typography](#️-typography)
- [Component Patterns](#-component-patterns)
- [Background Effects](#-background-effects)
- [Animations](#-animations)
- [Layout](#-layout)
- [Theming](#-theming)
- [Design Principles](#-design-principles)

---

## 🌌 Design Philosophy

Opportunity Radar AI uses a **dark-first glassmorphism** aesthetic — translucent layered cards, soft glows, and an indigo-to-cyan brand gradient — designed to feel modern, calm, and information-dense without feeling cluttered. Urgency (deadlines) is communicated through color, not noise.

---

## 🎨 Color Palette

### Brand gradient

| Swatch | Token | Value | Usage |
|---|---|---|---|
| 🟣 | Indigo 500 | `#6366F1` | Primary brand accent |
| 🟪 | Violet 500 | `#8B5CF6` | Gradient endpoint |
| 🔵 | Cyan 400 | `#22D3EE` | Accent highlights |

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

| Category | Swatch | Color |
|---|---|---|
| Hackathon | 🟣 | `#C084FC` |
| Internship | 🔵 | `#60A5FA` |
| Scholarship | 🟡 | `#FBBF24` |
| Fellowship | 🟢 | `#2DD4BF` |
| Open-source | 🟢 | `#4ADE80` |
| Startup | 🟠 | `#FB923C` |
| Competition | 🌸 | `#F472B6` |
| Grant | 🔷 | `#818CF8` |

### Match score colors

| Range | Color | Meaning |
|---|---|---|
| `70+` | `#4ADE80` | Strong match |
| `40–69` | `#FBBF24` | Moderate match |
| `<40` | `#94A3B8` | Weak match |

### Deadline urgency colors

| Days left | Color | Meaning |
|---|---|---|
| `0–1` | `#EF4444` | Critical — apply now |
| `2–3` | `#F97316` | Urgent |
| `4–7` | `#F59E0B` | Approaching |
| `8+` | `#4ADE80` | Plenty of time |

---

## ✍️ Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Headings | Inter | 700–900 | 28px–48px |
| Body | Inter | 400–500 | 13px–16px |
| Labels | Inter | 600 | 11px–12px |

Gradient headlines:

```css
background: linear-gradient(135deg, #6366F1, #22D3EE);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 🪟 Component Patterns

### Glass cards

```css
background: var(--bg-card);
backdrop-filter: blur(20px);
border: 1px solid var(--border-subtle);
border-radius: 16px;
```

- Hover lift + subtle glow on interaction

### Buttons

| Variant | Style |
|---|---|
| `.btn-primary` | Brand gradient fill, high contrast |
| `.btn-secondary` | Glassy fill with a subtle border |

- All buttons use `inline-flex`, consistent `gap`, and motion transitions on hover/press

### Badges

- Pill-shaped, with category-specific color variants
- Uppercase label text, compact sizing for scannability

### Inputs

- Glass background with a brand-colored focus ring
- Rounded corners, low-contrast resting border

---

## 🌊 Background Effects

### Floating orbs

| Orb | Position | Style |
|---|---|---|
| Purple orb | Top-left | Large blur radius, subtle opacity |
| Cyan orb | Bottom-right | Soft glow |

### Scrollbar

- Custom narrow scrollbar
- Transparent track with an indigo thumb

---

## 🎬 Animations

| Element | Trigger | Pattern |
|---|---|---|
| Page cards | Mount | `opacity 0→1`, `y 20→0` |
| Lists | Render | Staggered motion |
| Deadline progress | Animation | Easing fill |
| Hover lift | Pointer | Subtle translate |
| Chat transitions | Conversation | Markdown rendering with fade-in |

Key CSS keyframes:

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

- Persistent sidebar + fluid main content area
- Dashboard uses a two-column responsive grid
- Opportunity cards use a responsive grid with a minimum tile width
- Mobile breakpoints stack all sections vertically

---

## 🌓 Theming

The app uses a `ThemeProvider` that sets `data-theme="light"` (or omits it for dark) on `<html>`.

- **Default:** dark mode
- Theme preference persists in the Zustand store under the `opportunity-radar-store` key
- All color tokens are CSS variables, so theme switching requires no component-level logic

---

## 🎯 Design Principles

1. **Depth from glass, not shadow** — use translucency and blur instead of heavy drop shadows
2. **Make urgency visible** — red/orange/green cues communicate deadline pressure at a glance
3. **Purposeful motion** — animation should inform state changes, never distract
4. **Low visual noise** — keep background intensity subdued so content stays the focus
5. **Consistent geometry** — use a single, repeated radius scale across all UI elements
