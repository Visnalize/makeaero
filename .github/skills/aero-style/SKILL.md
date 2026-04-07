---
name: aero-style
description: 'Generate Windows 7 Aero-style UI components using CSS/Tailwind. Use when creating aero glass effects, aero buttons, aero windows, Windows 7 styled UI elements, or translucent glass morphism inspired by Windows 7 design. References the 7.css codebase at lib/7.css for authentic design tokens and patterns.'
---

# Aero Style Generation

## Reference Codebase

The canonical design reference for this project is the **7.css** submodule located at [`lib/7.css`](../../../lib/7.css/).

Key files to consult before generating any aero-style component:

| File | Purpose |
|------|---------|
| [`lib/7.css/gui/_variables.scss`](../../../lib/7.css/gui/_variables.scss) | All CSS custom properties (design tokens) |
| [`lib/7.css/gui/_button.scss`](../../../lib/7.css/gui/_button.scss) | Button gradients, hover/active states |
| [`lib/7.css/gui/_window.scss`](../../../lib/7.css/gui/_window.scss) | Glass window chrome, title bar, controls |
| [`lib/7.css/gui/_typography.scss`](../../../lib/7.css/gui/_typography.scss) | Fonts, links, instruction/header classes |
| [`lib/7.css/gui/_checkbox.scss`](../../../lib/7.css/gui/_checkbox.scss) | Checkbox aero style |
| [`lib/7.css/gui/_tabs.scss`](../../../lib/7.css/gui/_tabs.scss) | Tab panel styling |
| [`lib/7.css/gui/_progressbar.scss`](../../../lib/7.css/gui/_progressbar.scss) | Progress bar glow |
| [`lib/7.css/gui/_scrollbar.scss`](../../../lib/7.css/gui/_scrollbar.scss) | Custom scrollbar track/thumb |

## Core Design Tokens (from `_variables.scss`)

### Element (form controls, buttons)
```css
--w7-font: 9pt "Segoe UI", "SegoeUI", "Noto Sans", sans-serif;
--w7-surface: #f0f0f0;

--w7-el-bg: #f2f2f2;             /* default background */
--w7-el-bg-d: #f4f4f4;          /* disabled background */
--w7-el-bg-s-1: #ebebeb;        /* shade 1 */
--w7-el-bg-s-2: #cfcfcf;        /* shade 2 */

--w7-el-sd: inset 0 0 0 1px #fffc;                          /* inner highlight */
--w7-el-sd-a: inset 1px 1px 0 #0003, inset -1px 1px 0 #0001; /* pressed shadow */

--w7-el-bd: #8e8f8f;            /* default border */
--w7-el-bd-h: #3c7fb1;          /* hovered border (blue) */
--w7-el-bd-a: #6d91ab;          /* active/pressed border */
--w7-el-bd-d: #adb2b5;          /* disabled border */
--w7-el-bdr: 3px;               /* border radius */

--w7-el-c: #000000;             /* text color */
--w7-el-c-d: #838383;           /* disabled text */

/* Gradients */
--w7-el-grad:   linear-gradient(#f2f2f2 45%, #ebebeb 45%, #cfcfcf);   /* normal */
--w7-el-grad-h: linear-gradient(#eaf6fd 45%, #bee6fd 45%, #a7d9f5);   /* hovered */
--w7-el-grad-a: linear-gradient(#e5f4fc, #c4e5f6 30% 50%, #98d1ef 50%, #68b3db); /* active */
```

### Window (glass chrome)
```css
--w7-w-bg: #4580c4;             /* title bar base color */
--w7-w-bd: #000000b3;           /* window border */
--w7-w-bdr: 6px;                /* window corner radius */
--w7-w-glass: linear-gradient(135deg, #fff5 70px, transparent 100px), ...;  /* glass texture */
--w7-w-grad: linear-gradient(to right, #ffffff66, #0000001a, #ffffff33), var(--w7-w-bg);

/* Window control buttons */
--w7-wct-bg: linear-gradient(#ffffff80, #ffffff4d 45%, #0000001a 50%, #0000001a 75%, #ffffff80);
--w7-wct-bg-h: radial-gradient(circle at bottom, #2aceda, transparent 65%), linear-gradient(#b6d9ee 50%, #1a6ca1 50%);
--w7-wct-bg-a: radial-gradient(circle at bottom, #0bfdfa, transparent 65%), linear-gradient(#86a7bc 50%, #092747 50%);
--w7-wct_close-bg: ...; /* red close button */
```

## Key Aero Patterns

### 1. Aero Button
Buttons use a **split gradient** (solid top half, darker bottom) with a white inner glow shadow. Hover/active states use smooth CSS transitions via `::before`/`::after` pseudo-elements overlaid at `opacity: 0` and animated to `opacity: 1`.

**Implementation approach:**
- Base: `background: var(--w7-el-grad)` + `box-shadow: var(--w7-el-sd)`
- Hover overlay (`::before`): blue gradient (`--w7-el-grad-h`), `opacity` transitions
- Active overlay (`::after`): darker blue gradient (`--w7-el-grad-a`) + inset pressed shadow
- Border color animates: gray → blue on hover, faster in (0.3s), slower out (1s linear)
- Focus ring: `box-shadow: inset 0 0 0 2px #98d1ef`

### 2. Aero Glass Window
Windows use **layered backgrounds** + a blurred glass backdrop:
- `::before` pseudo-element carries the glass gradient + inner white border
- Title bar: `var(--w7-w-grad)` over `var(--w7-w-bg)` (blue baseline)
- Outer shadow: `2px 2px 10px 1px var(--w7-w-bd), inset 0 0 0 1px #fffa`
- Body: white surface with `var(--w7-surface)` background
- The diagonal light-stripe pattern `var(--w7-w-glass)` creates the authentic glass texture

### 3. Naming Convention
CSS variables follow: `--w7-<component>-<property>-<state>`
- **Components**: `el` (element/control), `w` (window), `wct` (window control), `li` (list item)
- **Properties**: `bg` (background), `bd` (border), `bdr` (border-radius), `c` (color), `sd` (shadow), `grad` (gradient)
- **States**: `d` (disabled), `h` (hovered), `a` (active), `hl` (highlighted)

## Procedure: Generating an Aero Component

1. **Read the relevant SCSS file** from `lib/7.css/gui/` for the target component type.
2. **Extract the CSS variables** used — reference `_variables.scss` for their resolved values.
3. **Translate to Tailwind/inline CSS** as appropriate for the project (this codebase uses Tailwind + shadcn/ui).
   - Use `[style]` attributes or CSS-in-JS for gradient and box-shadow values that Tailwind can't express.
   - Use Tailwind utilities where they map cleanly (border-radius, transitions, opacity).
4. **Preserve pseudo-element animations** (`::before`/`::after` overlay pattern) for authentic hover/active feel.
5. **Keep accessibility**: maintain `:focus-visible` ring and disabled state styling.
6. **Test against the docs** at `lib/7.css/docs/` — the `index.html.ejs` shows reference component markup.

## Project Context

This workspace (`aero-btn-generator`) is a **Next.js + Tailwind + shadcn/ui** app that generates aero-style UI code.
- Components live in `components/`; pages in `app/`
- Existing aero wrappers: `components/aero-background.tsx`, `app/button/page.tsx`, `app/orb/page.tsx`, `app/window-glass/page.tsx`
- Always check these files first to understand already-established patterns before adding new ones.
