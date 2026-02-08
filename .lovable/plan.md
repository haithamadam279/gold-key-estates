
# SOURCE EG -- DESIGN SPECIFICATION
## Enterprise Luxury Real-Estate Platform

This document is a concrete, implementation-ready design specification extracted from the current Source EG codebase. It defines every visual rule a frontend engineer needs to enforce consistency between the **Client Portal** and the **Admin Dashboard** while preserving the luxury brand identity.

---

## 1. DESIGN IDENTITY

### 1.1 Color Palette -- Dark Theme (Default)

| Token                   | HSL Value            | Hex Equivalent | Usage                                |
|-------------------------|----------------------|----------------|--------------------------------------|
| `--background`          | 240 6% 4%            | #0B0B0D        | Page background                      |
| `--background-secondary`| 220 10% 11%          | #1A1C20        | Section fills, footer bg             |
| `--foreground`          | 220 12% 81%          | #C9CDD6        | Primary text                         |
| `--muted-foreground`    | 220 8% 56%           | #8A8F9B        | Secondary text, captions             |
| `--primary`             | 43 74% 49%           | #D4A536        | Gold accent, CTAs, active states     |
| `--primary-foreground`  | 240 6% 4%            | #0B0B0D        | Text on gold buttons                 |
| `--primary-hover`       | 43 74% 42%           | #B88C2E        | Gold hover state                     |
| `--primary-glow`        | 43 80% 55%           | #E0BA4D        | Gold glow/highlight                  |
| `--card`                | 220 10% 11%          | #1A1C20        | Card surface                         |
| `--secondary`           | 220 10% 16%          | #252830        | Secondary fills, row backgrounds     |
| `--border`              | 220 10% 20%          | #2F3340        | Dividers, card borders               |
| `--destructive`         | 0 72% 51%            | #DE3B3B        | Delete, error, destructive actions   |
| `--success`             | 142 71% 45%          | #22C55E        | Available, success badges            |
| `--warning`             | 38 92% 50%           | #F59E0B        | Pending, warning badges              |

### 1.2 Color Palette -- Light Theme

| Token                   | HSL Value            | Hex Equivalent | Usage                                |
|-------------------------|----------------------|----------------|--------------------------------------|
| `--background`          | 40 20% 97%           | #F8F7F4        | Warm ivory page background           |
| `--background-secondary`| 40 15% 93%           | #EFEDE8        | Sections, footer                     |
| `--foreground`          | 220 15% 20%          | #2B303B        | Primary text (rich charcoal)         |
| `--muted-foreground`    | 220 8% 45%           | #6B7080        | Secondary text                       |
| `--primary`             | 43 74% 42%           | #B88C2E        | Gold accent (deeper for contrast)    |
| `--card`                | 40 20% 99%           | #FDFCFA        | Near-white warm card surface         |
| `--border`              | 40 10% 82%           | #D1CDCA        | Dividers                             |

### 1.3 Shadow System

| Level     | Dark Theme Value                                                  | Light Theme Value                                              |
|-----------|-------------------------------------------------------------------|----------------------------------------------------------------|
| `--shadow-sm`  | `0 1px 2px 0 rgb(0 0 0 / 0.3)`                             | `0 1px 2px 0 rgb(0 0 0 / 0.05)`                               |
| `--shadow-md`  | `0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)` | `0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)` |
| `--shadow-lg`  | `0 10px 15px -3px rgb(0 0 0 / 0.5)`                         | `0 10px 15px -3px rgb(0 0 0 / 0.1)`                           |
| `--shadow-gold`| `0 0 30px -5px hsl(primary / 0.3)`                          | `0 0 30px -5px hsl(primary / 0.25)`                           |

Shadow style: **Soft-to-medium** -- elevated cards use `shadow-lg`, inline items use `shadow-sm`.

### 1.4 Glassmorphism

All cards and surfaces across the platform use a consistent glass treatment:

```text
background: linear-gradient(135deg, hsl(220 10% 13% / 0.8), hsl(220 10% 10% / 0.6))
backdrop-filter: blur(20px)
border: 1px solid hsl(220 10% 25% / 0.2)
border-radius: 0.75rem (12px)
```

Applied via the utility class `.glass-card`.

### 1.5 Border Radius Scale

| Element       | Radius                               | CSS Value       |
|---------------|--------------------------------------|-----------------|
| Small buttons | `calc(var(--radius) - 4px)`          | 8px             |
| Inputs        | `var(--radius)`                      | 12px            |
| Cards         | `var(--radius)` + `rounded-xl`       | 12px            |
| Avatars       | `rounded-full`                       | 50%             |
| Navbar pill   | `rounded-2xl`                        | 16px            |
| KPI icon boxes| `rounded-lg`                         | 8px             |

---

## 2. TYPOGRAPHY

### 2.1 Font Families

| Role         | Family                              | Fallback Stack                                   |
|--------------|-------------------------------------|--------------------------------------------------|
| Display/H1-H4 | Playfair Display                  | Georgia, serif                                   |
| Body/H5-H6  | Inter                               | system-ui, -apple-system, BlinkMacSystemFont     |
| Arabic (RTL) | IBM Plex Sans Arabic                | Inter, system-ui                                 |

### 2.2 Heading Scale

| Level | Desktop Size         | Mobile Size  | Weight     | Line Height | Tracking     |
|-------|----------------------|--------------|------------|-------------|--------------|
| H1    | 3.75rem (60px)       | 2.25rem (36px) | 600 (semibold) | 1.1     | tight (-0.025em) |
| H2    | 3rem (48px)          | 1.875rem (30px)| 600        | 1.15        | tight        |
| H3    | 1.875rem (30px)      | 1.5rem (24px)  | 600        | 1.2         | tight        |
| H4    | 1.5rem (24px)        | 1.25rem (20px) | 500 (medium)| 1.25       | tight        |
| H5/H6 | 1.25rem (20px)      | 1.125rem (18px)| 600        | 1.3         | tight        |

### 2.3 Body & Utility Text

| Type          | Size               | Weight  | Style                              |
|---------------|--------------------|---------|------------------------------------|
| Body (`p`)    | 1rem (16px)        | 400     | `leading-relaxed` (1.625)          |
| Label         | 0.875rem (14px)    | 500     | `tracking-wide uppercase`          |
| Caption       | 0.75rem (12px)     | 400     | `text-muted-foreground`            |
| Button text   | 0.875rem (14px)    | 500     | Sentence case (NOT uppercase)      |
| Gold CTA button | 0.875rem (14px)  | 600     | Sentence case                      |

---

## 3. LAYOUT SYSTEM

### 3.1 Page Grid

| Property            | Value                                |
|---------------------|--------------------------------------|
| Layout type         | Fluid with max-width container       |
| Max content width   | 1400px (`container` utility)         |
| Container padding   | 2rem (32px) horizontal               |
| Page padding (public pages) | `px-6` (24px) on container  |
| Page padding (portal pages) | `p-4 md:p-6` (16px / 24px)  |

### 3.2 Portal Layout Grid

```text
+-----------------------------------------------------+
| Fixed Header (glass-card, full-width, z-50)          |
| h-16 (mobile) / h-20 (desktop)                       |
+----------+------------------------------------------+
| Sidebar  | Main Content                              |
| w-64     | flex-1, ml-64 (desktop)                   |
| fixed    | p-4 md:p-6                                |
| p-4      |                                           |
| (hidden  |                                           |
| on mobile)|                                          |
+----------+------------------------------------------+
```

- **Mobile**: Sidebar becomes a slide-in drawer (`w-72`) triggered by a hamburger icon
- **Backdrop**: `bg-background/80 backdrop-blur-sm`

### 3.3 Spacing Scale

| Context                     | Value                       |
|-----------------------------|-----------------------------|
| Section vertical spacing    | `py-20` to `py-24` (80-96px)|
| Card internal padding       | `p-6` (24px)                |
| Card content (no header)    | `p-4` (16px) for KPI cards  |
| Card header                 | `p-6` (24px), `pb-0` for content following |
| Gap between cards in grid   | `gap-4` (16px) for stats, `gap-6` (24px) for content cards |
| Vertical spacing in page    | `space-y-6` (24px) between sections |
| Form field spacing          | `space-y-4` to `space-y-6`  |
| Button group spacing        | `gap-2` to `gap-3`          |

---

## 4. NAVIGATION STRUCTURE

### 4.A Client Portal Navigation

**Type**: Fixed left sidebar (`w-64`) on desktop, slide-in drawer on mobile.

**Header**: Full-width glass-card bar containing:
- Hamburger toggle (mobile only, left side)
- Brand logo (center-left)
- User name + email + role badge (right side)
- Sign Out button (right side)

**Sidebar Sections (4 items)**:
1. Dashboard (`LayoutDashboard` icon)
2. My Assets (`Building2` icon)
3. Documents (`FileText` icon)
4. Resale Request (`RefreshCw` icon)

**Active State**:
- Background: `bg-primary/10`
- Text color: `text-primary`
- Border: `border border-primary/20`
- Right chevron indicator: `ChevronRight` icon in `text-primary`

**Inactive State**:
- Text: `text-muted-foreground`
- Hover: `hover:text-foreground hover:bg-secondary/50`

**Role Badge** (in header):
- Style: `px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20`

### 4.B Admin Dashboard Navigation

**Type**: Same layout structure as Client Portal (sidebar + header).

**Sidebar Sections (13 items)**:
1. Dashboard
2. Manage Users
3. Properties
4. Inventory
5. Leads
6. Leads Intelligence
7. Documents
8. Resale Requests
9. CMS
10. Analytics
11. Integrations
12. SEO Analyzer
13. Settings

**Active/Inactive states**: Identical to Client Portal (same `PortalLayout` component).

**Destructive action indication**: Destructive buttons use `text-destructive` color (#DE3B3B). Destructive menu items use `className="text-destructive"`.

**Admin-only visual cues**: 
- Role badge in header shows "Administrator" or "Super Admin"
- Admin sidebar has 13 items vs Client's 4 items (the extended list itself is the cue)

### 4.C Public Site Navigation

**Type**: Floating fixed navbar (`glass-card`, `rounded-2xl`) with mega-menu dropdowns.

**Structure**:
- Logo (left)
- CMS-driven nav items with `DynamicIcon` (center, desktop only)
- Quick Search, Theme Toggle, Language Switcher, User Menu, CTA button (right)
- Mobile: hamburger triggers `MobileDrawer`

**Active link**: `text-primary` color.
**Inactive link**: `text-muted-foreground hover:text-foreground hover:bg-secondary/30`.
**Mega menu open**: `text-primary bg-secondary/50`.

---

## 5. COMPONENT RULES

### 5.1 Buttons

| Variant      | Background                          | Text                     | Border             | Hover Effect                    |
|-------------|--------------------------------------|--------------------------|---------------------|---------------------------------|
| Primary (Gold CTA) | `gradient-gold` (135deg blend) | `text-background` (#0B0B0D) | none             | Shadow intensifies (`shadow-gold`), translateY(-2px) |
| Default     | `bg-primary`                         | `text-primary-foreground` | none               | `bg-primary/90`                 |
| Outline     | transparent                          | inherits                 | `border-border/50`  | `hover:bg-accent hover:text-accent-foreground` |
| Ghost       | transparent                          | inherits                 | none               | `hover:bg-accent`               |
| Destructive | `bg-destructive`                     | `text-white`             | none               | `bg-destructive/90`             |

**Sizes**:
- Default: `h-10 px-4 py-2`
- Small: `h-9 px-3`
- Large: `h-11 px-8`
- Icon: `h-10 w-10`
- Gold CTA extended: `h-12 text-base px-8 py-6`

### 5.2 Cards

**Base class**: `.glass-card` applied on all cards.
- Border: `border-border/20` (subtle by default)
- Hover: `hover:border-primary/30` (gold hint on interactive cards)
- Interactive cards: add `cursor-pointer` and `transition-all duration-300`
- KPI cards: `hover:shadow-gold` on hover for drill-down cards

**Content cards** (e.g., Recent Properties, Recent Leads):
- Header: `CardHeader` with title icon in `text-primary` + "View All" outline button
- List items inside: `p-3 rounded-lg bg-secondary/30 border border-border/30`

### 5.3 Tables / List Views

The application uses **card-based list items** rather than traditional HTML tables:

```text
+------------------------------------------------------------------+
| [Avatar/Icon] | Name                    | [Badge] [Chevron]      |
|               | email / metadata         |                        |
+------------------------------------------------------------------+
```

- Row container: `p-4 rounded-lg bg-secondary/30 border border-border/30`
- Row hover: `hover:border-primary/30 transition-colors`
- Row spacing: `space-y-3`
- Avatar circle: `w-10 h-10 rounded-full bg-primary/20` with first-letter initial in `text-primary font-semibold`

### 5.4 Badges (Status)

| Status         | Background           | Text Color       | Border              |
|----------------|----------------------|------------------|---------------------|
| Available      | `bg-success/20`      | `text-success`   | `border-success/30` |
| Reserved       | `bg-warning/20`      | `text-warning`   | `border-warning/30` |
| Sold           | `bg-destructive/20`  | `text-destructive`| `border-destructive/30` |
| New (lead)     | `bg-blue-500/20`     | `text-blue-400`  | `border-blue-500/30`|
| Contacted      | `bg-yellow-500/20`   | `text-yellow-400`| `border-yellow-500/30`|
| Qualified      | `bg-purple-500/20`   | `text-purple-400`| `border-purple-500/30`|
| Won            | `bg-green-500/20`    | `text-green-400` | `border-green-500/30`|
| Lost           | `bg-red-500/20`      | `text-red-400`   | `border-red-500/30` |
| Role badge     | `bg-primary/10`      | `text-primary`   | `border-primary/20` |
| Generic outline| transparent          | inherits         | `border-border/50`  |

Badge base: `text-xs font-medium` with border variant.

### 5.5 Forms (Inputs, Selects)

**Input class**: `.input-luxury`
- Background: `bg-secondary/50`
- Border: `border-border/50`
- Focus: `focus:border-primary/50 focus:ring-2 focus:ring-primary/20`
- Padding: `px-4 py-3`
- Radius: `rounded-lg` (12px)
- Height: standard inputs `h-12` on auth pages, default elsewhere
- Placeholder: `text-muted-foreground`

**Select dropdowns**: `SelectContent` uses `glass-card border-border/50`.

**Labels**: `text-foreground`, 14px, `font-medium`.
**Helper text**: `text-sm text-muted-foreground`.
**Error text**: `text-sm text-destructive`.

### 5.6 Modals / Dialogs

- Container: `glass-card border-border/50`
- Max width: `max-w-2xl` for detail dialogs, `max-w-md` for confirmations
- Header: `DialogTitle` with icon in `text-primary`
- Content: `space-y-6` vertical rhythm
- Info blocks inside: `p-3 rounded-lg bg-secondary/50 border border-border/30`

### 5.7 Empty States

- Container: centered within card content
- Text: `text-muted-foreground text-center py-4` or `py-8`
- Pattern: "No [items] yet" or "No [items] found"
- No illustration -- text only

### 5.8 Loading States

**Inline loader**: `Loader2` icon from lucide-react with `animate-spin text-primary`, sized `w-8 h-8`, centered with `flex items-center justify-center py-20`.

**Full-screen loader** (route transitions):
- Full viewport overlay at `z-[9999]`
- Gradient background matching page background
- Animated brand logo with 3D rotation (Framer Motion)
- Gold ambient glow orb (`bg-primary/20 blur-[150px]`)
- Thin progress bar: `w-24 h-[2px]` with sliding gold gradient
- Floating particle dust effect (20 particles, `bg-primary/30`)
- Respects `prefers-reduced-motion`

---

## 6. PAGE PATTERNS

### 6.1 Login Page

```text
+-------------------------------------------+
| Full-viewport centered layout             |
| Gradient background + animated orbs       |
| Watermark logo (opacity 0.02, blurred)    |
|                                           |
|     +-----------------------------+       |
|     | glass-card, max-w-md        |       |
|     | p-8 md:p-10                 |       |
|     |                             |       |
|     | [Logo h-16]                 |       |
|     | [H1 "Welcome Back"]        |       |
|     | [Subtitle muted]           |       |
|     |                             |       |
|     | [Email input h-12]         |       |
|     | [Password input h-12]      |       |
|     | [Remember me] [Forgot pwd] |       |
|     |                             |       |
|     | [btn-gold full-width h-12] |       |
|     |                             |       |
|     | [Footer divider]           |       |
|     | [Registered clients note]  |       |
|     +-----------------------------+       |
|     [Copyright text below card]           |
+-------------------------------------------+
```

### 6.2 Dashboard Home

**Client Portal**:
```text
+-------------------------------------------+
| Page title: "Welcome Back"                |
| Subtitle: muted overview text             |
|                                           |
| [Circular action buttons in a row]        |
|  (My Assets) (Documents) (Resale) (Agent) |
|  w-28/h-28 circles, glass effect          |
|  hover: scale(1.1), border-primary/50     |
|                                           |
| [Quick Overview glass-card]               |
|  Navigation guidance text                 |
+-------------------------------------------+
```

**Admin Dashboard**:
```text
+-------------------------------------------+
| H1: "Welcome back, [Name]"               |
| Subtitle: "Here's an overview..."         |
|                                           |
| [KPI Grid: 2col mobile / 6col desktop]   |
|  Each: glass-card, icon box, value, label |
|  Clickable -> navigates to detail page    |
|                                           |
| [2-column grid]                           |
|  [Recent Properties card]  [Recent Leads] |
|  List items with thumbnails/avatars       |
|  Status badges per item                   |
|  "View All" button in header              |
|                                           |
| [Quick Actions card]                      |
|  Primary button + outline buttons         |
+-------------------------------------------+
```

### 6.3 List Page (e.g., Manage Leads)

```text
+-------------------------------------------+
| H1: "Lead Management"                    |
| Subtitle: description text                |
|                                           |
| [Pipeline Stats: 5-column mini cards]     |
|  Count + status badge per status          |
|                                           |
| [Filter Card]                             |
|  Search input (icon left) + Status select |
|                                           |
| [List Card]                               |
|  CardTitle with icon + count              |
|  Rows: avatar | name+contact | badges    |
|  Click row -> opens detail dialog         |
+-------------------------------------------+
```

### 6.4 Details Page (Dialog-based)

```text
+------------------------------------+
| DialogTitle with icon              |
|                                    |
| [2-column info grid]              |
|  Label (muted) + Value (foreground)|
|                                    |
| [Message block]                   |
|  bg-secondary/50 rounded-lg       |
|                                    |
| [Status update buttons]          |
|  Active: bg-primary               |
|  Inactive: variant=outline        |
|                                    |
| [Notes timeline]                  |
|  Author + date + content          |
+------------------------------------+
```

### 6.5 Settings / Configuration Pages

```text
+-------------------------------------------+
| PortalLayout title="Settings"             |
| max-w-4xl                                 |
|                                           |
| [Quick Links: 3-col grid of link cards]  |
|  Icon box + title + description           |
|  Hover: border-primary/30                 |
|                                           |
| [Settings Section glass-card p-8]         |
|  Icon box (w-12 h-12) + Section title     |
|  Form fields with labels and helpers      |
|  Save button (btn-gold)                   |
+-------------------------------------------+
```

---

## 7. DO AND DON'T RULES

### MUST DO

1. **Always use `glass-card` for every card surface** -- never use plain white or plain dark cards.
2. **Always use `input-luxury` class on form inputs** -- never use unstyled or default browser inputs.
3. **Always use `btn-gold` for primary CTAs** (submit, save, sign in) -- never use bare `bg-primary` for hero-level actions.
4. **Always use `font-display` (Playfair Display) for headings H1-H4** -- never use Inter for display headings.
5. **Always use `text-muted-foreground` for secondary/helper text** -- never use raw gray hex values.
6. **Always separate Client Portal sidebar items (4 max) from Admin sidebar items (13+)** -- the item count difference is the primary role differentiator.
7. **Always apply `border-border/20` on card borders** -- never use full-opacity borders.
8. **Always include Framer Motion entry animations** on page sections: `initial={{ opacity: 0, y: 20 }}` -> `animate={{ opacity: 1, y: 0 }}` with staggered delays.
9. **Always use the background glow orbs** (`bg-primary/20 blur-[150px]`) on portal and auth pages for the luxury ambient effect.
10. **Always use `space-y-6` as the default vertical rhythm** inside portal pages.

### MUST NOT DO

1. **Never mix Client navigation items into the Admin sidebar** or vice versa. The `PortalLayout` role prop controls which items appear.
2. **Never use plain `#FFFFFF` or `#000000` backgrounds** -- always use the design token variables (`--background`, `--card`).
3. **Never use `rounded-none` or sharp corners** on cards, buttons, or inputs. Minimum radius is 8px.
4. **Never use inline color hex values** in components. Always reference CSS variable tokens via Tailwind classes (`text-primary`, `bg-destructive`, etc.).
5. **Never place more than 6 KPI cards in a single row** -- the admin dashboard uses `grid-cols-6` as the maximum on desktop.
6. **Never show raw email addresses or user IDs as primary identifiers** in list views. Always show the user's display name with email as secondary text.
7. **Never use `alert()` or `confirm()` browser dialogs** -- always use `sonner` toasts or `Dialog` components.
8. **Never render destructive actions (delete, revoke) without visual distinction** -- always use `text-destructive` or `bg-destructive` variants.
9. **Never omit loading states** -- every async data fetch must show `Loader2 animate-spin text-primary` centered in the content area.
10. **Never skip the watermark logo** on portal background pages. The `PortalLayout` renders a centered brand logo at `opacity-[0.015] blur-[1px]` as a luxury background treatment.
11. **Never add a traditional HTML `<table>` with visible grid lines** -- the platform uses card-based row lists with `bg-secondary/30` and rounded corners.
12. **Never use generic sans-serif for Arabic content** -- always apply `IBM Plex Sans Arabic` via the `[dir="rtl"]` selector.

---

THIS SPEC IS READY FOR IMPLEMENTATION
