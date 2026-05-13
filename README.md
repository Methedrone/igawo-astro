# igawo.pl — onboarding deweloperów

> Astro 5 + Keystatic CMS + i18n PL/EN/DE + Cloudflare

---

## Wymagania wstępne

- **Node.js** >= 22.12.0
- **npm** (instalowane razem z Node.js)

Sprawdź wersję:

```sh
node -v
npm -v
```

---

## Instalacja

```sh
git clone <repo-url>
cd igawo-astro
npm install
```

---

## Podstawowe komendy

| Komenda           | Co robi                                              |
| :---------------- | :--------------------------------------------------- |
| `npm run dev`     | Serwer deweloperski pod `localhost:4321`             |
| `npm run build`   | Build produkcyjny do `./dist/`                       |
| `npm run preview` | Podgląd buildu lokalnie przed deployem               |
| `npx astro check` | Sprawdzenie typów i błędów w całym projekcie         |
| `npx astro add`   | Dodawanie integracji Astro (np. `astro add sitemap`) |

---

## Architektura projektu

### Stack

- **Astro 5** — SSR/SSG z adapterem Cloudflare
- **React 19** — komponenty interaktywne (animacje, formularze)
- **Tailwind CSS v4** — `@tailwindcss/vite` (nie `@astrojs/tailwind`)
- **Keystatic CMS** — headless CMS z lokalnym storage, edycja w `/keystatic`
- **GSAP** — animacje scroll-triggered
- **Phosphor Icons** — ikony React
- **astro-seo** — meta tagi i SEO

### Struktura katalogów

```text
├── public/
│   ├── downloads/          # PDF-y do pobrania (kwestionariusze, wzory)
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── animations/     # Komponenty GSAP (ScrollReveal, StackingCards, ...)
│   │   ├── sections/       # Sekcje stron (Hero, About, Services, ...)
│   │   ├── Footer.astro
│   │   └── Header.astro
│   ├── content/
│   │   ├── config.ts       # Schematy kolekcji Astro Content Collections
│   │   ├── services/       # Usługi (PL/EN/DE)
│   │   ├── downloads/      # Pliki do pobrania (metadane + opisy)
│   │   ├── forms/          # Kwestionariusze/formularze
│   │   ├── pages/          # Treści stron statycznych
│   │   ├── posts/          # Wpisy blogowe
│   │   ├── testimonials/   # Opinie klientów
│   │   ├── partners/       # Partnerzy / "Zaufali nam"
│   │   └── faq/            # FAQ (pytania i odpowiedzi)
│   ├── i18n/
│   │   ├── ui.ts           # Słownik tłumaczeń (ui strings)
│   │   └── utils.ts        # Funkcje pomocnicze i18n
│   ├── layouts/
│   │   └── Layout.astro    # Główny layout z SEO, nav, footer
│   ├── pages/
│   │   ├── index.astro     # Root — redirect do /pl/
│   │   ├── 404.astro
│   │   ├── rss.xml.ts      # Feed RSS
│   │   └── [lang]/         # Strony językowe:
│   │       ├── index.astro
│   │       ├── o-nas.astro
│   │       ├── oferta.astro
│   │       ├── cennik.astro
│   │       ├── pliki.astro
│   │       ├── kwestionariusze.astro
│   │       ├── kontakt.astro
│   │       └── faq.astro
│   ├── styles/
│   │   └── global.css      # Tailwind + custom CSS
│   └── middleware.ts       # Redirect /pl/ → root (301)
├── astro.config.mjs
├── keystatic.config.tsx    # Konfiguracja Keystatic CMS
└── package.json
```

---

## Internacjonalizacja (i18n)

Projekt obsługuje 3 języki:

- **PL** (`pl`) — domyślny, bez prefixu w URL
- **EN** (`en`) — `/en/...`
- **DE** (`de`) — `/de/...`

Konfiguracja w `astro.config.mjs`:

```js
i18n: {
  defaultLocale: 'pl',
  locales: ['pl', 'en', 'de'],
  routing: { prefixDefaultLocale: false },
}
```

### Dodawanie nowych tekstów UI

1. Otwórz `src/i18n/ui.ts`
2. Dodaj klucz w obiektach `pl`, `en`, `de`
3. Użyj w komponencie przez `getLangFromUrl()` + `useTranslations()`

### Routing stron

Strony w `src/pages/[lang]/` renderują się dla każdego języka. Parametr `lang` jest walidowany przez Astro automatycznie.

---

## Keystatic CMS

Lokalny CMS do edycji treści. Dostępny pod `/keystatic` w trybie dev.

### Kolekcje (collections)

| Kolekcja     | Ścieżka                    | Do czego służy                    |
| :----------- | :------------------------- | :-------------------------------- |
| `services`   | `src/content/services/*`   | Usługi podatkowe                  |
| `downloads`  | `src/content/downloads/*`  | Pliki do pobrania (PDF, DOCX)     |
| `forms`      | `src/content/forms/*`      | Kwestionariusze online            |
| `pages`      | `src/content/pages/*`      | Treści stron statycznych          |
| `posts`      | `src/content/posts/*`      | Wpisy blogowe / poradniki         |
| `testimonials`| `src/content/testimonials/*`| Opinie klientów                  |
| `partners`   | `src/content/partners/*`   | Partnerzy / loga                  |
| `faq`        | `src/content/faq/*`        | FAQ — pytania i odpowiedzi        |

### Dodawanie nowej kolekcji

1. **Schemat Astro** — dopisz w `src/content/config.ts` (Zod)
2. **Schemat Keystatic** — dopisz w `keystatic.config.tsx` (fields API)
3. Upewnij się, że `slugField` i `path` są zgodne między oboma miejscami

---

## Praca z treścią

### Markdown / Markdoc

Keystatic używa pola `fields.markdoc()` dla treści. Pliki są zapisywane jako `.md` z frontmatterem.

### Format frontmatteru (przykład — services)

```yaml
---
title:
  name: Rozliczenie z Niemiec
  slug: rozliczenie-z-niemiec
lang: pl
description: Kompleksowe rozliczenie podatkowe z Niemiec dla pracowników i osób prowadzących działalność.
featured: true
---

Treść usługi w Markdoc...
```

### Zasady nazewnictwa plików treści

- Każdy język to osobny plik (np. `kindergeld.md`, `kindergeld-en.md`, `kindergeld-de.md`)
- Pole `lang` musi być zgodne z sufiksem / zawartością

---

## Style i Tailwind

- Tailwind v4 z pluginem Vite (`@tailwindcss/vite`)
- Globalne style w `src/styles/global.css`
- Nie używamy `@astrojs/tailwind` — to stara integracja na v3

---

## SEO

- `astro-seo` w layoucie (`<SEO title={...} description={...} />`)
- Sitemap generowany automatycznie (`@astrojs/sitemap`)
- RSS pod `/rss.xml`
- Meta opisy per język w `src/i18n/ui.ts` pod kluczami `meta.*.description`

---

## Deploy

Adapter: `@astrojs/cloudflare`

```sh
npm run build
```

Build trafia do `./dist/` i jest gotowy do deployu na Cloudflare Pages.

---

## Troubleshooting

### `npm run dev` nie startuje

- Sprawdź `node -v` — musi być >= 22.12.0
- Usuń `node_modules` i `package-lock.json`, potem `npm install`

### Keystatic nie działa

- Keystatic działa tylko w trybie dev (`npm run dev`)
- URL: `http://localhost:4321/keystatic`

### Problemy z typami po zmianach w content collections

```sh
npx astro sync
```

Astro regeneruje typy dla kolekcji.

### Błędy po dodaniu nowej kolekcji

Upewnij się, że:
1. Schemat w `config.ts` pokrywa wszystkie pola z Keystatic
2. `slugField` w Keystatic to `title`, a w Astro też jest pole `title` (obiekt `{name, slug}`)
3. Wszystkie pliki `.md` mają poprawny frontmatter

---

## Linki przydatne

- [Astro docs](https://docs.astro.build)
- [Keystatic docs](https://keystatic.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta)
- [Astro i18n routing](https://docs.astro.build/en/guides/internationalization/)
