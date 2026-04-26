# Design System — Coastal Blue

> Version 1.0 · Last updated: April 2026
> Config: `src/app/globals.css` · Framework: Tailwind CSS v4 + Next.js

---

## Palette

### Primary

| Token               | Light          | Dark           | Tailwind Class    |
|----------------------|----------------|----------------|-------------------|
| `--primary`          | `#0369a1`      | `#0ea5e9`      | `bg-primary`, `text-primary` |
| `--primary-hover`    | `#0c4a6e`      | `#0284c7`      | `bg-primary-hover` |
| `--primary-foreground` | `#ffffff`    | `#ffffff`      | `text-primary-foreground` |
| `--primary-soft`     | `rgba(3,105,161, 0.1)` | `rgba(14,165,233, 0.15)` | `bg-primary-soft` |

### Surfaces

| Token               | Light          | Dark           | Tailwind Class     | Χρήση |
|----------------------|----------------|----------------|--------------------|-------|
| `--background`       | `#F8FAFC`      | `#020617`      | `bg-background`    | Φόντο σελίδας |
| `--card`             | `#ffffff`      | `#0f172a`      | `bg-card`          | Κάρτες, panels, modals |
| `--surface-dim`      | `#f1f5f9`      | `#0f172a`      | `bg-surface-dim`   | Αμυδρά φόντα, skeleton loaders |
| `--surface-bright`   | `#ffffff`      | `#1e293b`      | `bg-surface-bright`| Υπερυψωμένες επιφάνειες |
| `--muted`            | `#f1f5f9`      | `#1e293b`      | `bg-muted`         | Hover states, tags, badges |
| `--popover`          | `#ffffff`      | `#0f172a`      | `bg-popover`       | Dropdowns, tooltips |

### Text Hierarchy

| Token               | Light          | Dark           | Tailwind Class        | Χρήση |
|----------------------|----------------|----------------|-----------------------|-------|
| `--foreground`       | `#0F172A`      | `#F8FAFC`      | `text-foreground`     | Κύρια κείμενα, τίτλοι |
| `--text-primary`     | `#0F172A`      | `#F8FAFC`      | `text-text-primary`   | (= foreground, εναλλακτικό) |
| `--text-secondary`   | `#475569`      | `#CBD5E1`      | `text-text-secondary` | Υποτίτλοι, δευτερεύοντα κείμενα |
| `--text-tertiary`    | `#64748b`      | `#94a3b8`      | `text-text-tertiary`  | Captions, hints, descriptions |
| `--text-quaternary`  | `#94a3b8`      | `#64748b`      | `text-text-quaternary`| Labels, placeholders, icons |
| `--text-inverted`    | `#ffffff`      | `#0F172A`      | `text-text-inverted`  | Κείμενο σε σκούρα backgrounds |
| `--muted-foreground` | `#64748b`      | `#94a3b8`      | `text-muted-foreground`| Shadcn component labels |

### Borders

| Token              | Light          | Dark           | Tailwind Class       | Χρήση |
|---------------------|----------------|----------------|----------------------|-------|
| `--border`          | `#e2e8f0`      | `#1e293b`      | `border-border`      | Βασικό border (inputs, cards) |
| `--border-dim`      | `#f1f5f9`      | `#1e293b`      | `border-border-dim`  | Διαχωριστικές γραμμές, subtle |
| `--border-strong`   | `#cbd5e1`      | `#475569`      | `border-border-strong`| Έμφαση (active states, rings) |
| `--input`           | `#e2e8f0`      | `#1e293b`      | `border-input`       | Form inputs (= border) |

### Status Colors

| Token              | Light          | Dark           | Tailwind Class |
|---------------------|----------------|----------------|----------------|
| `--success`         | `#0d9488`      | `#2dd4bf`      | `text-success`, `bg-success` |
| `--success-soft`    | `rgba(13,148,136, 0.1)` | `rgba(45,212,191, 0.15)` | `bg-success-soft` |
| `--warning`         | `#d97706`      | `#fbbf24`      | `text-warning`, `bg-warning` |
| `--warning-soft`    | `rgba(217,119,6, 0.1)` | `rgba(251,191,36, 0.15)` | `bg-warning-soft` |
| `--info`            | `#0ea5e9`      | `#38bdf8`      | `text-info`, `bg-info` |
| `--info-soft`       | `rgba(14,165,233, 0.1)` | `rgba(56,189,248, 0.15)` | `bg-info-soft` |
| `--destructive`     | `#ef4444`      | `#f43f5e`      | `text-destructive`, `bg-destructive` |

### Accent (semantic)

| Token              | Light          | Dark           | Tailwind Class |
|---------------------|----------------|----------------|----------------|
| `--accent`          | `#f1f5f9`      | `#1e293b`      | `bg-accent` |
| `--accent-foreground` | `#0F172A`    | `#F8FAFC`      | `text-accent-foreground` |

---

## Typography

### Font Stacks

| Alias          | CSS Variable         | Fallback            | Χρήση |
|----------------|----------------------|---------------------|-------|
| `font-display` | `--font-inter`       | Inter, system-ui    | Κύριο font σε ολόκληρη την εφαρμογή |
| `font-sans`    | `--font-geist-sans`  | Geist Sans, system-ui | Εναλλακτικό |
| `font-mono`    | `--font-geist-mono`  | Geist Mono, monospace | Κωδικοί (IDs, badges) |

### Utility Classes

| Class         | Αποτέλεσμα | Χρήση |
|---------------|-----------|-------|
| `.text-label` | `10px · bold · uppercase · tracking-widest · text-quaternary` | Ετικέτες κατηγοριών (π.χ. «ΒΑΘΜΙΔΑ», «ΕΙΔΙΚΟΤΗΤΑ») |
| `.text-caption` | `11px · medium · text-tertiary` | Captions, descriptions |
| `.text-micro` | `9px · semibold · text-quaternary` | Μικροσκοπικά badges |

### Scale (Tailwind defaults)

```
text-xs      → 12px    Badges, status text
text-sm      → 14px    Body text, descriptions  
text-base    → 16px    Body text (default)
text-lg      → 18px    Subheadings
text-xl      → 20px    Section titles
text-2xl     → 24px    Page titles
text-3xl     → 30px    Hero subtitles
text-5xl     → 48px    Hero heading (mobile)
text-7xl     → 72px    Hero heading (desktop)
```

---

## Spacing

Χρησιμοποιούμε αποκλειστικά το **Tailwind CSS 4px grid**. Δεν χρησιμοποιούμε arbitrary values (`p-[17px]`).

### Component Spacing Rules

| Περιοχή | Padding | Gap |
|---------|---------|-----|
| Page wrapper | `p-4 md:p-8` | — |
| Card content | `p-5 sm:p-6` ή `p-6 sm:p-8` | — |
| Card sections | — | `gap-4` ή `gap-6` |
| Form fields | `py-3.5 px-4` (via `.form-input`) | `gap-4` ή `space-y-4` |
| Button padding | `px-4 py-2.5` (small) · `px-8 py-3.5` (large) | — |
| Grid gap | — | `gap-3` · `gap-4` · `gap-6` |
| Section spacing | `mb-6` ή `mb-8` | — |

### Layout Widths

| Class | Width | Χρήση |
|-------|-------|-------|
| `max-w-7xl` | 80rem (1280px) | Κύριο content container (dashboard, stats, matches) |
| `max-w-4xl` | 56rem (896px) | Auth forms (desktop), settings |
| `max-w-sm` | 24rem (384px) | Auth forms (mobile) |

---

## Border Radius

Αυστηρή ιεραρχία — **δεν χρησιμοποιούμε arbitrary pixel values**.

| Class | Value | Χρήση |
|-------|-------|-------|
| `rounded-full` | 9999px | Avatars, status dots, pills |
| `rounded-4xl` | 32px | Κύριο layout frame, glass-card, page-level containers |
| `rounded-3xl` | 24px | Bento cards |
| `rounded-2xl` | 16px | Κάρτες, buttons, inputs, badges, tabs |
| `rounded-xl` | 12px | Inner sections, compact cards, admin components |
| `rounded-sm` | 4px | Legend dots, data-viz elements |

### Ιεραρχία

```
Εξωτερικό κέλυφος    →  rounded-4xl  (main frame, glass cards)
Εσωτερικές κάρτες    →  rounded-2xl  (content blocks, form cards)
Interactive elements →  rounded-2xl  (buttons, inputs, tabs)
Micro elements       →  rounded-sm   (bar chart corners)
```

---

## Shadows

| Token | Value | Tailwind Class | Χρήση |
|-------|-------|----------------|-------|
| Ambient | `0 2px 8px rgba(0,0,0,0.04)` | `shadow-ambient` | Static cards, quiet surfaces |
| Soft | `0 8px 30px rgba(0,0,0,0.04)` | `shadow-soft` | Elevated cards, buttons, containers |
| Floating | `0 10px 40px rgba(0,0,0,0.08)` | `shadow-floating` | Hover states, modals, popovers |

### Hover pattern

```html
<div className="shadow-soft hover:shadow-floating transition-all">
```

---

## Component Recipes

### Glass Card

```html
<div className="glass-card">
  <!-- Ισοδυναμεί με: bg-card border border-border-dim rounded-4xl shadow-[...] -->
</div>
```

### Form Input

```html
<input className="form-input" />
<!-- Ισοδυναμεί με: w-full bg-surface-dim border border-border rounded-2xl text-sm text-foreground -->
<!-- Focus: outline-none border-primary bg-card ring-[3px] ring-primary/15 -->
```

### Primary Button

```html
<button className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-soft active:scale-[0.98] cursor-pointer">
  Υποβολή
</button>
```

### Secondary / Ghost Button

```html
<button className="bg-card border border-border text-text-secondary px-4 py-2.5 rounded-2xl text-sm font-medium hover:bg-muted transition-colors cursor-pointer">
  Ακύρωση
</button>
```

### Section Header (Label)

```html
<h3 className="text-label">ΚΑΤΗΓΟΡΙΑ</h3>
<!-- Ισοδυναμεί με: text-[10px] font-bold uppercase tracking-widest text-text-quaternary -->
```

### Card with Header

```html
<div className="glass-card overflow-hidden">
  <div className="p-6 border-b border-border-dim bg-card/50">
    <h3 className="text-label">ΤΙΤΛΟΣ</h3>
  </div>
  <div className="p-6 space-y-6">
    <!-- Content -->
  </div>
</div>
```

### Status Badge

```html
<!-- Success -->
<span className="text-emerald-700 bg-emerald-50 border border-emerald-100/50 text-[10px] font-bold px-2 py-0.5 rounded-2xl">
  +12%
</span>

<!-- Neutral -->
<span className="text-text-tertiary bg-muted text-[10px] font-bold px-2 py-0.5 rounded-2xl">
  0
</span>

<!-- Danger -->
<span className="text-rose-700 bg-rose-50 border border-rose-100/50 text-[10px] font-bold px-2 py-0.5 rounded-2xl">
  -8%
</span>
```

### Hover Card Item

```html
<div className="group flex items-center p-3 rounded-2xl bg-card border border-border-dim hover:border-primary/30 hover:bg-primary-soft transition-all shadow-ambient">
  <div className="w-8 h-8 rounded-2xl bg-muted border border-border-dim text-text-quaternary flex items-center justify-center text-xs font-bold group-hover:border-primary/30 group-hover:text-primary group-hover:bg-primary-soft transition-colors">
    1
  </div>
  <span className="text-sm font-medium text-text-secondary ml-3">Αττική</span>
</div>
```

---

## Glassmorphism (Floating Nav)

```html
<div className="bg-card/70 dark:bg-card/50 backdrop-blur-lg shadow-soft border border-border-dim rounded-4xl">
  <!-- Navigation items -->
</div>
```

---

## Dark Mode

Η εφαρμογή χρησιμοποιεί `next-themes` με class-based dark mode (`@custom-variant dark (&:is(.dark *))`).

### Κανόνες

1. **Μην βάζεις raw dark: overrides** όταν χρησιμοποιείς semantic tokens. Τα tokens αλλάζουν αυτόματα:
   ```html
   <!-- ✅ Σωστό: 1 class, αυτόματο dark mode -->
   <p className="text-text-secondary">Κείμενο</p>
   
   <!-- ❌ Λάθος: χειροκίνητο dark override -->
   <p className="text-slate-600 dark:text-slate-400">Κείμενο</p>
   ```

2. **Εξαιρέσεις** που επιτρέπεται `dark:`:
   - Decorative elements (gradients, glows)
   - Semantic colors που πρέπει να αλλάξουν ριζικά (red borders, status colors)
   - Glassmorphism opacity (`bg-card/70 dark:bg-card/50`)

---

## Data Visualization

Τα charts (Recharts) χρησιμοποιούν **raw hex values**, όχι tokens, για αξιοπιστία rendering:

```typescript
const theme = {
  bars: {
    past: "#cbd5e1",     // slate-300
    current: "var(--primary)",
  },
  labels: {
    past: "#94a3b8",     // slate-400
    current: "var(--primary-hover)",
  },
  grid: "#f1f5f9",       // slate-100
  axis: "#64748b",       // slate-500
};
```

---

## Animations

| Class | Duration | Χρήση |
|-------|----------|-------|
| `transition-colors` | 150ms | Hover color changes |
| `transition-all` | 150ms | Multi-property transitions |
| `active:scale-[0.98]` | — | Button press effect |
| `.scanning-pulse` | 3s infinite | Dashboard scanning animation |
| `.animate-blob` | 7s infinite | Background blob animation |
| `.animate-shimmer` | 2s infinite | Loading skeleton shimmer |

---

## Anti-patterns (Τι ΔΕΝ κάνουμε)

| ❌ Αποφυγή | ✅ Αντικατάσταση |
|-----------|----------------|
| `text-slate-700` | `text-text-secondary` |
| `bg-slate-50` | `bg-surface-dim` |
| `bg-blue-600` | `bg-primary` |
| `border-slate-200` | `border-border` |
| `bg-white` | `bg-card` |
| `hover:bg-blue-700` | `hover:bg-primary-hover` |
| `text-gray-500` | `text-text-tertiary` |
| `rounded-[20px]` | `rounded-2xl` (16px) ή `rounded-3xl` (24px) |
| `shadow-md` | `shadow-soft` |
| `p-[17px]` | `p-4` (16px) ή `p-5` (20px) |

---

## File Structure

```
src/app/globals.css          ← Όλα τα tokens ορίζονται εδώ
├── @theme inline { }        ← Tailwind color registration
├── :root { }                ← Light mode values
├── .dark { }                ← Dark mode values
├── @layer base { }          ← Global resets
├── @layer components { }    ← .glass-card, .form-input, .text-label
└── @keyframes               ← Animations
```
