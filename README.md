# Operation 326 Dashboard

An interactive dashboard for the **Operation 326** initiative, presenting unreached
people groups worldwide through a searchable directory, a regional carousel, an
interactive world map and downloadable prayer cards.

Built with **React 19**, **Vite 8** and **Tailwind CSS v4**.

---

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Framework  | React 19                            |
| Build tool | Vite 8                              |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons      | lucide-react                        |
| Fonts      | Inter · Playfair Display            |
| Linting    | ESLint 10                           |

---

## Getting Started

**Requirements:** Node.js 20.19+ (or 22.12+) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (http://localhost:5173)
npm run dev

# 3. Create the production build in ./dist
npm run build
```

Two additional scripts are available:

```bash
npm run preview   # serve the production build locally
npm run lint      # run ESLint across the project
```

---

## Project Structure

```
src/
├── App.jsx                  # Header, layout and lifted filter state
├── index.css                # Tailwind entry + design tokens (@theme)
├── data/
│   └── peopleGroups.js      # Single source of truth: 281 people group records
└── components/
    ├── HeroSection.jsx      # Full-width hero
    ├── MapSection.jsx       # Live stats bar + interactive world map
    ├── RegionSection.jsx    # Clickable region carousel
    ├── TableSection.jsx     # Filterable directory + prayer card modal
    ├── RegionCard.jsx       # Region card
    ├── StatCard.jsx         # Statistic card
    ├── FilterSelect.jsx     # Styled native select
    ├── Button.jsx           # Button (solid / outline, 4 sizes)
    └── statIcons.js         # Icon map for the statistics bar

public/
├── favicon.svg
└── img/                     # Optimised assets (WebP + SVG)
    ├── hero.webp
    ├── pcg-logo.svg
    ├── PCG-logo-white-text.svg
    ├── world-map.png
    └── regions/             # One WebP per region
```

---

## Design Tokens

Brand colours and typography are declared once in `src/index.css` using
Tailwind v4's `@theme` directive, and are available as regular utilities
(`bg-brand`, `text-brand`, `font-display`, …):

| Token                    | Value     | Usage                    |
| ------------------------ | --------- | ------------------------ |
| `--color-brand`          | `#b81d25` | Primary brand red        |
| `--color-brand-dark`     | `#6b1116` | Hover / pressed states   |
| `--color-brand-light`    | `#fca5a5` | Soft accents             |
| `--color-brand-surface`  | `#fee2e2` | Highlight backgrounds    |
| `--font-sans`            | Inter     | Body copy and UI         |
| `--font-display`         | Playfair Display | Headings          |

The neutral scale maps 1:1 to Tailwind's default `gray` palette, so
`gray-50 … gray-900` are used directly.

---

## Updating the Content

All records live in a single decoupled array at `src/data/peopleGroups.js`.
Each entry follows this shape:

```js
{
  id: 1,
  name: "Afitti, Ditti",
  country: "Sudan",
  population: null,
  status: "Unreached",          // "Unreached" | "Reached"
  priority: null,
  region: "East & Southern Africa",
  cardUrl: "https://…/Afitti-Ditti.jpg"   // null hides the prayer card button
}
```

Region filters, country filters, status filters, the map hotspot counts and the
carousel statistics are **all derived from this array at runtime** — adding or
editing a record updates the entire interface automatically, with no changes to
the components.

Region card images resolve by slug: `"East & Southern Africa"` maps to
`/img/regions/east-southern-africa.webp`.

---

## Deployment

The build output is a fully static bundle in `dist/`, deployable to any static
host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3) with no server-side
configuration required.

```bash
npm run build     # generates ./dist
```

---

## Author / Tech Lead

Developed by Ediel Jonathan - Front-end Web Developer.
