# Audyt SEO: igawo.pl — Raport techniczny + on-page + i18n

> Data audytu: 2026-05-13  
> Zakres: pełna witryna (PL/EN/DE)  
> URL: https://igawo.pl  
> Stack: Astro 5, Cloudflare, astro-seo, @astrojs/sitemap

---

## 🚨 Podsumowanie wykonawcze

Stan SEO igawo.pl przypomina nowoczesny samochód z silnikiem V8… który nie ma kół. Framework jest świetny, design premium, ale **pod maską kryją się błędy architektoniczne, które skutecznie blokują Google przed dotarciem do treści.**

| Wskaźnik | Ocena | Komentarz |
|----------|-------|-----------|
| Indeksowalność | 🔴 Krytyczna | Strona główna PL prowadzi do 404. |
| Nawigacja wewnętrzna | 🔴 Krytyczna | Wszystkie linki PL wskazują nieistniejące adresy. |
| i18n / hreflang | 🟡 Średnia | Sitemap OK, ale brak tagów w `<head>` i brak `x-default`. |
| Techniczne podstawy | 🟡 Średnia | Brak `robots.txt`, brak schema.org, build niestabilny. |
| On-page / treść | 🟢 Dobra | Tytuły i opisy obecne, ale zbyt generyczne. |

**Top 3 priorytetów:**
1. Napraw strukturę URL-i dla języka polskiego (`/pl/` vs brak prefixu).
2. Napraw `getLocalizedPath` i `translatePath` — linki wewnętrzne i przełącznik języków.
3. Dodaj `robots.txt`, tagi `hreflang` w HTML i schema.org.

---

## 1. Indeksowalność i architektura URL (Krytyczne)

### 1.1 Strona główna PL = 404

**Problem:**  
`/` robi przekierowanie `302` na `/pl`, ale `/pl/` **nie istnieje** jako zbudowany plik (`brak dist/pl/index.html`). Root `src/pages/index.astro` generuje tylko stronę-przekierowanie, a `[lang]/index.astro` filtruje `pl` z `getStaticPaths`.

**Efekt dla Googlebota:**  
→ Wejście na `igawo.pl` → 302 → `/pl` → 404.  
To jak wejście do sklepu i zamiast produktów zobaczyć pustkę.

**Dowód:**
```html
<!-- dist/index.html -->
<title>Redirecting to: /pl</title>
<meta http-equiv="refresh" content="2;url=/pl">
<meta name="robots" content="noindex">
```

**Rekomendacja:**  
- Opcja A: Utwórz `src/pages/pl/index.astro` (lub usuń filter `lang !== 'pl'` z `[lang]/index.astro`).
- Opcja B: Zmień `prefixDefaultLocale: true` → `false` w `astro.config.mjs` i dostosuj middleware, aby PL był bez prefixu (zgodnie z AGENTS.md).

**Priorytet:** 🔴 P0 — blokuje indeksację całej domeny.

---

### 1.2 Wszystkie linki wewnętrzne na stronach PL prowadzą do 404

**Problem:**  
Funkcja `getLocalizedPath('/cennik', 'pl')` zwraca `/cennik`, ale faktyczny URL to `/pl/cennik` (bo `prefixDefaultLocale: true`). W efekcie nawigacja w headerze na każdej stronie PL wskazuje nieistniejące adresy (`/o-nas`, `/oferta`, `/kontakt` itd.).

**Dowód (Header.astro):**
```astro
{ href: getLocalizedPath('/cennik', lang), label: t('nav.pricing') }
<!-- Na stronie PL generuje: /cennik -->
<!-- Faktyczny URL: /pl/cennik -->
```

**Rekomendacja:**  
Ujednolić logikę routingu:
```ts
// getLocalizedPath powinien zwracać /pl/cennik gdy prefixDefaultLocale: true
if (lang === defaultLang && prefixDefaultLocale) {
  return normalizedPath === '/' ? '/pl' : `/pl${normalizedPath}`;
}
```

**Priorytet:** 🔴 P0 — każdy klik w menu na PL = 404.

---

### 1.3 Przełącznik języków generuje błędne URL-e

**Problem:**  
Na stronie `/pl/cennik` link do EN to `/en/pl/cennik` zamiast `/en/cennik`. Funkcja `translatePath` nie usuwa prefixu `/pl/` ze ścieżki źródłowej.

**Dowód (dist/pl/cennik/index.html):**
```html
<a href="/en/pl/cennik" aria-label="Switch to en"> EN </a>
```

**Rekomendacja:**  
Naprawić `translatePath`, aby przy `fromLang !== defaultLang` (lub gdy path zaczyna się od `/pl/`) prawidłowo usuwał prefix językowy przed translacją.

**Priorytet:** 🔴 P0 — linki alternatywne są niepoprawne.

---

## 2. i18n i Hreflang (Wysoki)

### 2.1 Brak tagów hreflang w HTML `<head>`

**Problem:**  
Mimo że sitemap zawiera `<xhtml:link rel="alternate" hreflang="...">`, same strony **nie mają** `<link rel="alternate" hreflang="...">` w `<head>`. Google zaleca obie metody jednocześnie.

**Rekomendacja:**  
Dodać w `Layout.astro` (lub przez `astro-seo` jeśli wspiera):
```astro
<link rel="alternate" hreflang="pl-PL" href={`${siteUrl}/pl${canonicalPath}`} />
<link rel="alternate" hreflang="en-US" href={`${siteUrl}/en${canonicalPath}`} />
<link rel="alternate" hreflang="de-DE" href={`${siteUrl}/de${canonicalPath}`} />
<link rel="alternate" hreflang="x-default" href={`${siteUrl}/pl${canonicalPath}`} />
```

**Priorytet:** 🟠 P1

---

### 2.2 Brak x-default w sitemapie i na stronach

**Problem:**  
Sitemap nie zawiera `hreflang="x-default"`. To oznacza, że Google nie wie, gdzie wysłać użytkownika z językiem spoza PL/EN/DE (np. francuskiego).

**Rekomendacja:**  
Wskazać wersję polską lub dedykowany language-selector jako `x-default`.

**Priorytet:** 🟡 P2

---

### 2.3 Sitemap zawiera nieistniejące URL-e

**Problem:**  
Sitemap wskazuje `https://igawo.pl/pl/cennik` jako kanoniczny dla PL, ale ze względu na błąd z sekcji 1.1 i 1.2, wiele z tych URL-i może być problematycznych. Dodatkowo sitemap nie uwzględnia faktu, że root `/` jest `noindex` + redirect.

**Rekomendacja:**  
Po naprawie routingu wygenerować sitemap na nowo i zweryfikować w Google Search Console.

**Priorytet:** 🟠 P1

---

## 3. Techniczne podstawy (Wysoki)

### 3.1 Brak robots.txt

**Problem:**  
W `public/` nie ma `robots.txt`. Roboty nie mają instrukcji, nie znajdą sitemapy automatycznie.

**Rekomendacja:**  
Utworzyć `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://igawo.pl/sitemap-index.xml
```

**Priorytet:** 🟠 P1

---

### 3.2 Brak schema.org / structured data

**Problem:**  
Żadna strona nie zawiera JSON-LD (LocalBusiness, Service, FAQPage, Offer, BreadcrumbList). To oznacza brak rich snippets w wynikach wyszukiwania.

**Rekomendacja:**  
Dodać podstawowe schema:
- **Homepage + Kontakt:** `LocalBusiness` (adres, telefon, email, URL)
- **Oferta:** `Service` dla każdej usługi
- **Cennik:** `Offer` wewnątrz `Service`
- **FAQ:** `FAQPage` z `mainEntity`
- **Wszystkie strony:** `BreadcrumbList`

**Priorytet:** 🟠 P1

---

### 3.3 Niestabilność builda

**Problem:**  
W trakcie audytu build zawiódł z błędem `ERR_MODULE_NOT_FOUND` w `astro/dist/cli/throw-and-exit.js`. Oznacza to uszkodzone `node_modules` lub konflikt wersji. Dodatkowo `Layout.astro` był wcześniej modyfikowany przez inny proces i zawierał niekompletny kod (brak zamknięcia `}`).

**Rekomendacja:**  
- `rm -rf node_modules && npm install`
- Wprowadzić CI check (GitHub Actions) weryfikujący `astro build` przy każdym PR.

**Priorytet:** 🟠 P1

---

### 3.4 Przekierowanie 302 zamiast 301 (root → /pl)

**Problem:**  
`middleware.ts` używa `302` dla `/` → `/pl`. To tymczasowe przekierowanie; Google może nie przekazać mocy SEO.

**Rekomendacja:**  
Zmienić na `301` (trwałe), jeśli struktura z `/pl/` jest docelowa.

**Priorytet:** 🟡 P2

---

## 4. On-Page SEO (Średni)

### 4.1 Zbyt generyczne meta descriptions

**Problem:**  
Fallback `common.description` to `"igawo.pl - profesjonalne usługi."` — brak CTA, brak słów kluczowych, brak specyfiki.

**Rekomendacja:**  
Dedykowane opisy per strona (min. 120-155 znaków):
- Home: "Odzyskaj nadpłacony podatek z Niemiec i Holandii. 15 lat doświadczenia, 10 000+ rozliczonych spraw. Bezpłatna wycena w 24h."
- Oferta: "Rozliczenia podatkowe Niemcy, Holandia, Kindergeld, SOKA-BAU. Trzy pakiety: Start 150 EUR, Rozwój 280 EUR, Premium 450 EUR."

**Priorytet:** 🟡 P2

---

### 4.2 Obrazy — placeholdery i brak wymiarów

**Problem:**  
- Hero i AboutSection używają `https://picsum.photos/seed/...` — zewnętrzne, nieoptymalizowane, niezwiązane z marką.
- Brak atrybutów `width` / `height` na `<img>` — wpływa na CLS (Cumulative Layout Shift).
- `ImageScaleOnScroll.tsx` używa `loading="lazy"` dla obrazu above-the-fold — powinien być `eager`.

**Rekomendacja:**  
- Zamienić picsum na własne obrazy (mamy już `hero-1.jpg`, `about-office.jpg` w `public/images/`!).
- Dodać `width` i `height`.
- Dla hero: `loading="eager"`, dla reszty: `loading="lazy"`.

**Priorytet:** 🟡 P2

---

### 4.3 RSS linkuje do nieistniejących stron

**Problem:**  
`rss.xml.ts` generuje linki `/posts/${post.slug}`, ale nie ma routingu `src/pages/posts/[slug].astro`. Użytkownicy RSS dostaną 404.

**Rekomendacja:**  
Albo dodać stronę bloga/postów, albo zmienić linki w RSS na istniejące podstrony (np. `/pl/blog/${slug}`).

**Priorytet:** 🟡 P2

---

## 5. Drobne poprawki (Niski)

| # | Problem | Rekomendacja |
|---|---------|--------------|
| 5.1 | `<meta name="generator" content="Astro v5.18.1" />` — ujawnia stack. | Opcjonalnie usunąć (nie krytyczne). |
| 5.2 | `site.webmanifest` ma `lang: "pl"` na sztywno. | Ustawić dynamicznie lub usunąć pole `lang`. |
| 5.3 | Brak `404` w sitemapie — filtrowane. | OK, ale upewnić się, że `404.astro` ma `noindex`. |
| 5.4 | `og-image.jpg` jest jeden dla wszystkich języków. | `[lang]/index.astro` ma już `ogImageMap` — użyć go we wszystkich layoutach. |
| 5.5 | Brak breadcrumbów w UI i w schema. | Dodać nawigację okruszkową na podstronach. |

---

## 6. Plan działania — priorytety

### Faza 1: Napraw indeksowanie (tydzień 1)
- [ ] Napraw routing PL: `/pl/index.html` musi istnieć.
- [ ] Napraw `getLocalizedPath` i `translatePath` dla prefixu `/pl/`.
- [ ] Dodaj `robots.txt` z `Sitemap`.
- [ ] Zmień `/` → `/pl` z `302` na `301`.

### Faza 2: i18n SEO (tydzień 1-2)
- [ ] Dodaj `<link rel="alternate" hreflang="...">` w `Layout.astro`.
- [ ] Dodaj `x-default` do sitemap i do HTML.
- [ ] Zweryfikuj sitemap w Google Search Console po naprawie.

### Faza 3: Rich Snippets i treść (tydzień 2)
- [ ] Dodaj schema.org: LocalBusiness, Service, FAQPage, BreadcrumbList.
- [ ] Napisz dedykowane meta descriptions per strona.
- [ ] Zamień picsum na własne obrazy z `public/images/`.

### Faza 4: Stabilność (ciągłe)
- [ ] `rm -rf node_modules && npm install`.
- [ ] Dodaj GitHub Action: `astro build` na każdym PR.

---

## Załączniki

- **Sitemap:** `dist/sitemap-0.xml` (zawiera hreflang, ale bez x-default)
- **Layout:** `src/layouts/Layout.astro` (brak hreflang, brak schema)
- **Middleware:** `src/middleware.ts` (302 redirect)
- **Konfiguracja i18n:** `astro.config.mjs` (`prefixDefaultLocale: true`)
- **Utils i18n:** `src/i18n/utils.ts` (błąd w `getLocalizedPath` i `translatePath`)

---

*Raport przygotowany przez agenta SEO. W razie pytań — komentarz do zadania.*
