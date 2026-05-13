# igawo.pl — Agent Instructions

> Last updated: 2026-05-13 after i18n + content collection integration.
> Stack: Astro 5, React 19 islands, GSAP, Tailwind CSS v4, Keystatic CMS.

---

## 1. Tech Stack & Architecture

| Layer | Technology |
|---|---|
| Framework | Astro 5 (SSG + Cloudflare adapter) |
| Components | Astro (.astro) + React 19 islands (.tsx) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Animations | GSAP 3 + ScrollTrigger (React islands only) |
| CMS | Keystatic (Git-based, local storage) |
| i18n | Custom (dictionary + middleware) — PL / EN / DE |
| Icons | Inline SVG (Phosphor-style strokes) |
| Fonts | Geist + Satoshi via CDN (WOFF2 variable) |

**Key config files:**
- `astro.config.mjs` — site URL, i18n routing (`prefixDefaultLocale: true`), sitemap, Cloudflare adapter
- `src/styles/global.css` — Tailwind theme, font-face, utilities, reduced-motion
- `src/middleware.ts` — redirects `/` → `/pl` (default locale)
- `keystatic.config.tsx` — CMS collections, fields, local storage mode

---

## 2. Design System

### 2.1 Color Palette

Primary brand is **emerald** (`brand-*`). Neutrals are **warm stone** (`stone-*`).

| Token | Role |
|---|---|
| `stone-25` | Page background (`#fdfcfa`) |
| `stone-50 … 950` | Text, borders, surfaces |
| `brand-500` | Primary accent (`#10b981`) |
| `brand-700` | Hover states, gradients |
| `white/60 … white/80` | Glassmorphism panels |

### 2.2 Typography

| Font | Usage |
|---|---|
| Geist (sans) | Headings, UI, body |
| Geist Mono | Code, labels |
| Satoshi (fallback) | If Geist fails |

Hero H1: `clamp(2.5rem, 6vw, 5rem)` with `tracking-tighter` and `leading-[1.05]`.
Max **2 lines** for H1 — keep it cinematic.

### 2.3 Custom Utilities (in `global.css`)

```
.glass-pill      — frosted glass pill (navbar)
.glass-panel     — lighter frosted panel
.gradient-radial — subtle emerald radial glow top
.text-gradient   — brand-700 → brand-500 gradient text
.section-padding — responsive px-4 → px-12
.container-wide  — max-w-[1400px] mx-auto
```

---

## 3. Component Inventory

### 3.1 Layout (Astro)

| Component | Path | Notes |
|---|---|---|
| `Layout` | `src/layouts/Layout.astro` | SEO (astro-seo), skip-link, Header, Footer, OG image support |
| `Header` | `src/components/Header.astro` | Glass pill navbar, mobile hamburger, i18n switcher |
| `Footer` | `src/components/Footer.astro` | 4-col grid, social icons, footer links |

**Header behavior:**
- Fixed top, glass-pill container rounded-full
- Mobile menu toggles with `aria-expanded`
- Language switcher: pill buttons with shadow on active
- Nav items use `currentPath` match for active state

### 3.2 Sections (Astro)

All sections receive `lang: string` prop and use `useTranslations(lang)`.
Content-driven sections (Services, Downloads, Forms, Testimonials, Partners) fetch entries via `getCollection()` and filter by the `lang` field:

```ts
const items = allItems.filter((item) => item.data.lang === lang);
```

Some pages (e.g. `[lang]/oferta.astro`) use an alternative suffix-based filter (`-en`, `-de`) on the entry ID. Both patterns exist in the codebase.

| Section | File | Key Features |
|---|---|---|
| Hero | `sections/Hero.astro` | 100dvh, gradient-radial bg, 2 CTAs, trust badges |
| Services Bento | `sections/ServicesBento.astro` | Gapless grid (`grid-flow-dense`), auto-rows, content-driven |
| Process | `sections/ProcessSection.astro` | StackingCards animation (4 steps) |
| About | `sections/AboutSection.astro` | Stats grid, badge |
| Contact | `sections/ContactSection.astro` | Form + contact info |
| Downloads | `sections/DownloadsSection.astro` | File cards from `downloads` collection |
| Forms | `sections/FormsSection.astro` | Questionnaire cards from `forms` collection |
| CTA | `sections/CtaSection.astro` | Final conversion block |
| Partners | `sections/PartnersSection.astro` | Logo grid from `partners` collection |
| Testimonials | `sections/TestimonialsSection.astro` | Quote cards from `testimonials` collection |

**Important schema quirk:** The `title` field in all content collections is a `slugField` object `{ name: string, slug: string }`. Access the display name via `item.data.title.name`, never `item.data.title` directly.

### 3.3 GSAP Animation Components (React islands)

All components check `prefers-reduced-motion: reduce` and bail out if true.
All use `gsap.context()` for scoped cleanup + `ctx.revert()` on unmount.

| Component | File | Behavior |
|---|---|---|
| `ScrollReveal` | `animations/ScrollReveal.tsx` | Fade + translateY on scroll into view. Props: `delay`, `duration`, `y`, `scale`, `once` |
| `StaggerReveal` | `animations/StaggerReveal.tsx` | Staggers direct children. Props: `stagger`, `duration`, `y` |
| `ImageScaleOnScroll` | `animations/ImageScaleOnScroll.tsx` | Scale-in + opacity scrub, then fade out. Props: `startScale` |
| `StackingCards` | `animations/StackingCards.tsx` | Pin + scale-down cards as user scrolls. Uses `cardSelector` default `.stack-card` |

**Usage pattern in Astro:**
```astro
<ScrollReveal client:load delay={0.2}>
  <h2>...</h2>
</ScrollReveal>
```

Use `client:load` for above-fold, `client:visible` for below-fold.

---

## 4. i18n System

### 4.1 Routing

- `prefixDefaultLocale: true` is set in `astro.config.mjs`
- PL is prefixed: `/pl/o-nas`, `/pl/oferta`, `/pl/kontakt`
- EN prefixed: `/en/o-nas`, `/en/oferta`, `/en/kontakt`
- DE prefixed: `/de/o-nas`, `/de/oferta`, `/de/kontakt`
- Root `/` serves a redirect page; middleware also redirects `/` → `/pl` (302)
- Root `index.astro` is the PL homepage; Astro moves it to `/pl/` automatically
- `[lang]/index.astro` explicitly excludes `pl` from `getStaticPaths` to avoid collision

**Note:** The `getLocalizedPath()` and `translatePath()` helpers currently return unprefixed paths for PL (`/o-nas`, `/oferta`), which assumes `prefixDefaultLocale: false` behavior. With the current config set to `true`, this creates a routing mismatch — PL nav links and language-switcher URLs may 404 until the helpers are updated to always include the `/pl/` prefix for the default locale.

### 4.2 Slug Translation

Slugs are translated per locale via `slugTranslations` in `src/i18n/utils.ts`:

| PL | EN | DE |
|---|---|---|
| `/o-nas` | `/about` | `/about` |
| `/oferta` | `/services` | `/services` |
| `/pliki` | `/downloads` | `/downloads` |
| `/kwestionariusze` | `/forms` | `/forms` |
| `/kontakt` | `/contact` | `/contact` |
| `/cennik` | `/pricing` | `/preise` |
| `/faq` | `/faq` | `/faq` |

### 4.3 Dictionary

All UI strings live in `src/i18n/ui.ts` — flat key→string object per locale.
Keys use dot notation: `nav.home`, `hero.title`, `contact.form.email`.

Use `useTranslations(lang)` to get the `t(key)` function.

### 4.4 Page-Level Content (`pageIdMap`)

Static pages that need CMS-driven descriptions use a `pageIdMap` to look up the correct `pages` collection entry per language:

```ts
const pageIdMap: Record<string, string> = {
  pl: 'pliki',
  en: 'downloads',
  de: 'dateien',
};
const pageEntry = await getEntry('pages', pageIdMap[lang] ?? 'pliki');
const pageDesc = pageEntry?.data.description ?? t('meta.downloads.description');
```

Each `[lang]/*.astro` page file defines its own map. The slug keys must match entries in `src/content/pages/`.

---

## 5. Content Collections

Defined in `src/content.config.ts`:

| Collection | Schema Highlights |
|---|---|
| `services` | `title` {name,slug}, `lang`, `description`, `featured` |
| `downloads` | `title` {name,slug}, `lang`, `fileUrl`, `fileType` |
| `forms` | `title` {name,slug}, `lang`, `formId` |
| `pages` | `title` {name,slug}, `lang`, `description` |
| `posts` | `title` {name,slug}, `lang`, `date`, `excerpt`, `featured` |
| `testimonials` | `title` {name,slug}, `lang`, `author`, `role`, `featured` |
| `partners` | `title` {name,slug}, `lang`, `description` |
| `faq` | `title` {name,slug}, `lang`, `question`, `order` |

**Multilingual entry naming — two conventions in use:**

1. **Translated slugs** (preferred for public-facing URLs):
   ```
   rozliczenie-z-niemiec.md   # pl
   german-tax-return.md       # en
   steuererklaerung-deutschland.md # de
   ```

2. **Suffix convention** (used in some page files like `[lang]/oferta.astro`):
   ```
   kindergeld.md      # pl
   kindergeld-en.md   # en
   kindergeld-de.md   # de
   ```

Section components filter by the `lang` field (`item.data.lang === lang`). Some pages filter by suffix (`-en`, `-de`) on the entry ID. If using translated slugs, ensure the logic still matches the correct entries (e.g. via `lang` field or manual allow-lists).

**Existing page collection entries (examples):**
- PL: `strona-glowna`, `o-nas`, `oferta`, `pliki`, `kwestionariusze`, `kontakt`, `cennik`
- EN: `home`, `about`, `services`, `downloads`, `forms`, `contact`, `pricing`
- DE: `startseite`, `uber-uns`, `angebot`, `dateien`, `frageboegen`, `kontakt-de`, `preise`

---

## 6. File Structure

```
src/
├── components/
│   ├── animations/          # React GSAP islands
│   │   ├── ScrollReveal.tsx
│   │   ├── StaggerReveal.tsx
│   │   ├── ImageScaleOnScroll.tsx
│   │   └── StackingCards.tsx
│   ├── sections/            # Astro page sections
│   │   ├── Hero.astro
│   │   ├── ServicesBento.astro
│   │   ├── ProcessSection.astro
│   │   ├── AboutSection.astro
│   │   ├── ContactSection.astro
│   │   ├── DownloadsSection.astro
│   │   ├── FormsSection.astro
│   │   ├── CtaSection.astro
│   │   ├── PartnersSection.astro
│   │   └── TestimonialsSection.astro
│   ├── Header.astro
│   └── Footer.astro
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro           # PL homepage only (hardcoded lang='pl')
│   ├── 404.astro
│   ├── rss.xml.ts
│   └── [lang]/
│       ├── index.astro       # EN + DE homepages (excludes 'pl')
│       ├── o-nas.astro
│       ├── oferta.astro
│       ├── kontakt.astro
│       ├── pliki.astro
│       ├── kwestionariusze.astro
│       ├── cennik.astro
│       ├── faq.astro
│       ├── polityka-prywatnosci.astro
│       └── search.astro
├── content.config.ts
├── content/
│   ├── services/
│   ├── downloads/
│   ├── forms/
│   ├── pages/
│   ├── posts/
│   ├── testimonials/
│   ├── partners/
│   └── faq/
├── i18n/
│   ├── ui.ts                 # Dictionary (pl/en/de)
│   └── utils.ts              # Helpers + slug translations
├── styles/
│   └── global.css
└── middleware.ts
docs/
├── components.md             # Component API documentation
├── content.md                # Content editing guide (PL)
└── i18n.md                   # i18n developer guide
```

---

## 7. Key Decisions & Conventions

1. **React islands for GSAP** — Not vanilla JS. Better composition, lifecycle cleanup, and prop-driven configs.
2. **Geist + Satoshi** — Chosen over Inter for warmer, more editorial feel.
3. **Stone + emerald** — Replaced earlier zinc/blue palette. Warm, trustworthy, premium.
4. **`grid-flow-dense` on bento** — Prevents empty cells when services vary in size.
5. **`prefers-reduced-motion`** — Checked in every GSAP component AND in CSS (`@media` block zeroes transitions).
6. **Glass pill navbar** — Not full-width glass. Floating rounded pill for modern aesthetic.
7. **Language switcher preserves path** — `translatePath()` converts slugs when switching languages.
8. **`client:load` vs `client:visible`** — Above-fold animations load immediately; below-fold wait for intersection.
9. **Title schema is `{ name, slug }`** — All content collections use a `slugField` for titles. Always access the display name via `.title.name`.
10. **`pageIdMap` per page file** — Static pages map `lang` → content entry slug to fetch CMS-driven descriptions. Each page owns its map.
11. **Root `index.astro` = PL only** — The root homepage hardcodes `lang = 'pl'` and does NOT use `[lang]` routing. EN/DE homepages live under `[lang]/index.astro` which explicitly excludes `pl` from `getStaticPaths`.
12. **Content-driven sections use `getCollection`** — Services, Downloads, Forms, Testimonials, and Partners pull from collections rather than hardcoded arrays. Language filtering uses the `lang` field (`item.data.lang === lang`).
13. **Testimonials use `item.body`** — The `.rendered?.html` property causes a `toString` crash in Astro content collections; raw `item.body` is used instead.
14. **OG images per language** — Language-specific OG images are defined in `[lang]/index.astro` (`/images/og-pl.jpg`, `/images/og-en.jpg`, `/images/og-de.jpg`).

---

## 8. Working with This Project

### Adding a new section
1. Create `src/components/sections/MySection.astro`
2. Accept `lang: string` prop and call `useTranslations(lang)`
3. Add translation keys to `src/i18n/ui.ts` (all 3 locales)
4. Import and use in `src/pages/index.astro` (PL) and `src/pages/[lang]/index.astro` (EN/DE)
5. Wrap animated elements in `<ScrollReveal client:visible>`

### Adding a new GSAP animation
1. Create React component in `src/components/animations/`
2. Always check `prefers-reduced-motion` before running GSAP
3. Always use `gsap.context()` + `ctx.revert()`
4. Register ScrollTrigger once at top: `gsap.registerPlugin(ScrollTrigger)`

### Adding i18n strings
1. Add to `ui.pl`, `ui.en`, `ui.de` in `src/i18n/ui.ts`
2. Use `t('my.new.key')` in components
3. Keep keys flat and namespaced: `section.element.property`

### Adding content
1. Create `.md` file in appropriate `src/content/<collection>/`
2. Follow naming convention for language variants (translated slug or `-en`/`-de` suffix)
3. Ensure `lang` frontmatter matches the content language
4. Run `npm run build` to verify schema validation

### Adding a new static page that needs CMS content
1. Create `src/pages/[lang]/my-page.astro`
2. Define `pageIdMap` mapping each language to the corresponding `pages` collection slug
3. Use `getEntry('pages', pageIdMap[lang])` to fetch SEO description
4. Add slugs to `slugTranslations` in `src/i18n/utils.ts` if the page appears in nav/footer
5. Add nav label keys to `src/i18n/ui.ts`

---

## 9. Build & Deploy

```bash
npm run dev      # Astro dev server
npm run build    # Static build (exit 0 = success)
npm run preview  # Preview production build
```

Build target: Cloudflare (via `@astrojs/cloudflare`).
Sitemap auto-generated with i18n alternates.
RSS feed at `/rss.xml`.
