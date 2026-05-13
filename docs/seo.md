# Checklista SEO — per strona

> Dokumentacja dla deweloperów i osób publikujących treści w projekcie **igawo.pl**.  
> Stack: Astro 5, astro-seo, Cloudflare.  
> Języki: PL / EN / DE.

---

## Szybki start

Przed każdym wdrożeniem nowej strony lub aktualizacją treści przejdź przez sekcję **„Uniwersalna”** oraz dedykowaną checklistę dla danego typu strony.

**Poziom pilności:**
- 🔴 P0 — blokuje indeksowanie, musi być zrobione przed publikacją
- 🟠 P1 — wpływa na ranking, zrób w ciągu 1-2 dni
- 🟡 P2 — optymalizacja, zrób gdy masz czas

---

## Uniwersalna checklista (każda strona)

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| U1 | `<title>` | Unikalny, 30-60 znaków, zawiera główne słowo kluczowe + markę. Format: `Tytuł strony | igawo.pl` | 🔴 P0 |
| U2 | `meta description` | Unikalny, 120-155 znaków, z CTA (np. „Dowiedz się więcej”, „Bezpłatna wycena”). Nie kopiuj z innych stron. | 🔴 P0 |
| U3 | Kanoniczny URL | `<link rel="canonical" href="https://igawo.pl/pl/o-nas/" />` — zawsze z pełnym adresem, z `/` na końcu. | 🔴 P0 |
| U4 | Hreflang | W `<head>` muszą być 4 tagi: `pl-PL`, `en-US`, `de-DE`, `x-default` (wskazuje PL). | 🟠 P1 |
| U5 | Open Graph | `og:title`, `og:description`, `og:image`, `og:url`, `og:type` (dla podstron: `article` lub `website`). | 🟠 P1 |
| U6 | Twitter Card | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` | 🟡 P2 |
| U7 | Język dokumentu | `<html lang="pl">` (lub `en`, `de`) — zgodny z zawartością strony. | 🔴 P0 |
| U8 | Nagłówki H1 | Dokładnie jeden H1 na stronę, unikalny, zawiera słowo kluczowe. | 🟠 P1 |
| U9 | Struktura H2-H6 | Logiczna hierarchia, bez przeskoków (np. H1 → H3). Minimum 2 podnagłówki na stronę tekstową. | 🟡 P2 |
| U10 | Obrazy | Każdy `<img>` ma `alt` opisujący zawartość (nie „image1.jpg”), oraz atrybuty `width` i `height`. | 🟠 P1 |
| U11 | Linki wewnętrzne | Wszystkie linki działają (brak 404), anchor text jest opisowy (nie „kliknij tutaj”). | 🔴 P0 |
| U12 | Linki zewnętrzne | Linki do zewnętrznych stron mają `rel="noopener noreferrer"` i otwierają się w nowej karcie (`target="_blank"`). | 🟡 P2 |
| U13 | Schema.org | Co najmniej `BreadcrumbList` na każdej stronie. Inne schemy zależnie od typu (patrz niżej). | 🟠 P1 |
| U14 | Szybkość | Obrazy < 200 KB (WebP), czcionki `font-display: swap`, brak nieużywanego JS. | 🟡 P2 |
| U15 | Meta robots | `index, follow` jako domyślna. Tylko strony specjalne (np. polityka prywatności, wyniki wyszukiwania) mogą mieć `noindex`. | 🔴 P0 |

---

## Checklisty per typ strony

### 1. Strona główna (`[lang]/index.astro`)

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| H1 | Tytuł | Maksymalnie 60 znaków, zawiera główną frazę (np. „Odzyskaj podatek z Niemiec i Holandii — igawo.pl”). | 🔴 P0 |
| H2 | Opis | 150-155 znaków, z wartością i CTA (np. „15 lat doświadczenia, 10 000+ spraw. Bezpłatna wycena w 24h.”). | 🔴 P0 |
| H3 | Schema.org | `LocalBusiness` (adres, telefon, email, godziny otwarcia, URL) + `WebSite` (z `potentialAction` Search). | 🟠 P1 |
| H4 | OG Image | 1200×630 px, < 500 KB, język zgodny ze stroną. Nie używaj jednego obrazu dla wszystkich języków. | 🟠 P1 |
| H5 | H1 na stronie | Jednoznaczny, nie generyczny (nie „Witamy”). | 🟠 P1 |
| H6 | CTA | Co najmniej 2 przyciski z action-driven anchor text (nie „Dalej”). | 🟡 P2 |

**Przykład meta (PL):**
```astro
<SEO
  title="Odzyskaj podatek z Niemiec i Holandii | igawo.pl"
  description="15 lat doświadczenia, 10 000+ rozliczonych spraw. Rozliczenia podatkowe, Kindergeld, SOKA-BAU. Bezpłatna wycena w 24h."
  canonical="https://igawo.pl/pl/"
/>
```

---

### 2. O nas (`[lang]/o-nas.astro`)

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| O1 | Tytuł | Zawiera słowo „o nas” lub „about” + markę. | 🔴 P0 |
| O2 | Opis | Podkreśl doświadczenie i zespół. Min. 120 znaków. | 🟠 P1 |
| O3 | Schema.org | `AboutPage` (opcjonalnie) lub `LocalBusiness` (jeśli zawiera dane kontaktowe). | 🟡 P2 |
| O4 | Obrazy zespołu | `alt` z imionami i rolami, `width`/`height` ustawione. | 🟡 P2 |

---

### 3. Oferta / Usługi (`[lang]/oferta.astro` + `[lang]/oferta/[slug].astro`)

**Lista usług (oferta.astro):**

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| S1 | Tytuł | Zawiera słowo „oferta” / „services” + branża (np. „Rozliczenia podatkowe Niemcy, Holandia | igawo.pl”). | 🔴 P0 |
| S2 | Opis | Wymień konkretne usługi i pakiety. Min. 120 znaków. | 🟠 P1 |
| S3 | Schema.org | `ItemList` z listą `Service` (lub `Service` per kafelek). | 🟠 P1 |

**Szczegółowa usługa (`[lang]/oferta/[slug].astro`):**

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| S4 | Tytuł | Nazwa usługi + lokalizacja/język (np. „Rozliczenie z Niemiec — igawo.pl”). | 🔴 P0 |
| S5 | Opis | 150-155 znaków, z ceną lub CTA (np. „Pakiet Start od 150 EUR. Odzyskaj nadpłacony podatek w 3 miesiące.”). | 🟠 P1 |
| S6 | Schema.org | `Service` (nazwa, opis, provider → `LocalBusiness`, areaServed). | 🟠 P1 |
| S7 | Cennik na stronie | Jeśli jest cena, dodaj `Offer` wewnątrz `Service` z `price` i `priceCurrency`. | 🟡 P2 |
| S8 | FAQ na stronie | Jeśli zawiera FAQ, dodaj `FAQPage` schema. | 🟡 P2 |
| S9 | Linki do powiązanych | Linki do „Pliki do pobrania” i „Kwestionariusze” dla tej usługi. | 🟡 P2 |

---

### 4. Cennik (`[lang]/cennik.astro`)

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| C1 | Tytuł | „Cennik usług podatkowych | igawo.pl” (lub „Pricing / Preise”). | 🔴 P0 |
| C2 | Opis | Zawiera konkretne ceny (np. „Start 150 EUR, Rozwój 280 EUR, Premium 450 EUR”). | 🟠 P1 |
| C3 | Schema.org | `Offer` per pakiet w ramach `Service` lub `ItemList`. | 🟠 P1 |
| C4 | Tabela cennika | Użyj semantycznego `<table>` lub listy z `<dl>` — nie same divy. | 🟡 P2 |
| C5 | CTA pod cenami | „Zamów bezpłatną wycenę” lub „Skontaktuj się z nami”. | 🟡 P2 |

---

### 5. Kontakt (`[lang]/kontakt.astro`)

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| K1 | Tytuł | „Kontakt — igawo.pl” (zawiera słowo „kontakt”). | 🔴 P0 |
| K2 | Opis | Zawiera dane kontaktowe lub CTA (np. „Napisz lub zadzwoń. Odpowiadamy w ciągu 24h.”). | 🟠 P1 |
| K3 | Schema.org | `ContactPage` + `LocalBusiness` (adres, telefon, email, geo). | 🟠 P1 |
| K4 | Dane kontaktowe | Widoczne jako tekst (nie tylko w obrazkach), z linkami `tel:` i `mailto:`. | 🟠 P1 |
| K5 | Formularz | Etykiety `<label>` powiązane z polami (`for`), walidacja HTML5, `autocomplete`. | 🟡 P2 |
| K6 | Mapa | Jeśli osadzona, lazy-load iframe (`loading="lazy"`), `title` opisujący lokalizację. | 🟡 P2 |

---

### 6. FAQ (`[lang]/faq.astro`)

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| F1 | Tytuł | „Najczęściej zadawane pytania | igawo.pl” (lub „FAQ / Häufige Fragen”). | 🔴 P0 |
| F2 | Opis | Zawiera najpopularniejsze pytanie lub liczbę odpowiedzi. | 🟡 P2 |
| F3 | Schema.org | `FAQPage` z `mainEntity` → `Question` + `AcceptedAnswer` per pozycja. | 🟠 P1 |
| F4 | Struktura HTML | Pytania jako `<h2>` lub `<h3>`, odpowiedzi jako `<p>` lub `<div>`. Nie używaj `<dl>` dla schema FAQPage. | 🟠 P1 |
| F5 | Linkowanie wewnętrzne | Z odpowiedzi linkuj do powiązanych usług lub plików do pobrania. | 🟡 P2 |

---

### 7. Pliki / Downloads (`[lang]/pliki.astro`)

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| D1 | Tytuł | „Pliki do pobrania — igawo.pl” (lub „Downloads / Dateien”). | 🔴 P0 |
| D2 | Opis | Zawiera typy dokumentów (PDF, DOCX) i ich przeznaczenie. | 🟡 P2 |
| D3 | Linki do plików | `download` atrybut lub `Content-Disposition`, `rel="nofollow"` dla PDF (opcjonalnie). | 🟡 P2 |
| D4 | Schema.org | `DigitalDocument` lub `ItemList` z listą dokumentów. | 🟡 P2 |

---

### 8. Kwestionariusze / Forms (`[lang]/kwestionariusze.astro`)

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| Q1 | Tytuł | „Kwestionariusze do pobrania | igawo.pl”. | 🔴 P0 |
| Q2 | Opis | Zawiera instrukcję wypełnienia i kontakt w razie pytań. | 🟡 P2 |
| Q3 | Schema.org | `ItemList` lub `HowTo` (jeśli zawiera instrukcję krok-po-kroku). | 🟡 P2 |

---

### 9. Polityka prywatności (`[lang]/polityka-prywatnosci.astro`)

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| P1 | Tytuł | „Polityka prywatności | igawo.pl”. | 🔴 P0 |
| P2 | Meta robots | `noindex, follow` — nie indeksujemy stron prawnych. | 🔴 P0 |
| P3 | Opis | Krótki, generyczny wystarczy (np. „Polityka prywatności i cookies serwisu igawo.pl.”). | 🟡 P2 |
| P4 | Link w footerze | Widoczny na każdej stronie. | 🟠 P1 |

---

### 10. Strona 404 (`404.astro`)

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| E1 | Meta robots | `noindex, follow` — wyraźnie zablokuj indeksowanie. | 🔴 P0 |
| E2 | Tytuł | „Strona nie została znaleziona | igawo.pl”. | 🔴 P0 |
| E3 | CTA | Link do strony głównej + linki do najpopularniejszych podstron. | 🟡 P2 |
| E4 | Nagłówek | Przyjazny komunikat („Ups, zabłądziłeś”), nie techniczny. | 🟡 P2 |

---

### 11. Wyszukiwarka (`[lang]/search.astro`, `szukaj.astro`)

| # | Element | Co sprawdzić | Priorytet |
|---|---------|--------------|-----------|
| W1 | Meta robots | `noindex, follow` — wyniki wyszukiwania nie powinny być indeksowane. | 🔴 P0 |
| W2 | Tytuł | „Wyszukiwarka | igawo.pl” (bez query string w title). | 🔴 P0 |
| W3 | Canonical | Stały URL bez parametrów (np. `/pl/search/`). | 🟠 P1 |

---

## Weryfikacja techniczna po publikacji

Po każdej zmianie (nowa strona, edycja meta, nowa treść) wykonaj:

1. **Lokalny build:**
   ```bash
   npm run build
   ```
   Build musi przejść bez błędów. Jeśli nie — nie wdrażaj.

2. **Sprawdź HTML wyjściowy:**
   ```bash
   cat dist/pl/o-nas/index.html | grep -E "<title>|<meta name=\"description\"|<link rel=\"canonical\"|<link rel=\"alternate\""
   ```

3. **Sprawdź w przeglądarce (DevTools → Elements → `<head>`):**
   - [ ] `<title>` jest poprawny
   - [ ] `description` istnieje
   - [ ] `canonical` wskazuje właściwy URL
   - [ ] 4 tagi `hreflang` są obecne
   - [ ] `og:*` i `twitter:*` są wypełnione
   - [ ] Schema.org (JSON-LD) jest w `<head>` lub w odpowiednich elementach

4. **Testy online (po deploy):**
   - [Google Rich Results Test](https://search.google.com/test/rich-results) — schema.org
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — Open Graph
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator) — Twitter Cards
   - [Google Search Console](https://search.google.com/search-console) — indeksowanie

---

## Wielojęzyczność — zasady SEO

### Hreflang — co musi być w `<head>`

Każda strona w każdym języku musi zawierać **4 tagi** + self-referencing:

```astro
<link rel="alternate" hreflang="pl-PL" href={`https://igawo.pl/pl${canonicalPath}`} />
<link rel="alternate" hreflang="en-US" href={`https://igawo.pl/en${canonicalPath}`} />
<link rel="alternate" hreflang="de-DE" href={`https://igawo.pl/de${canonicalPath}`} />
<link rel="alternate" hreflang="x-default" href={`https://igawo.pl/pl${canonicalPath}`} />
```

**Zasady:**
- `x-default` wskazuje na wersję polską (domyślną).
- Jeśli strona nie istnieje w danym języku — nie pomijaj tagu. Zamiast tego wskaż `x-default` lub najbliższą wersję.
- Ścieżka `canonicalPath` musi być identyczna we wszystkich wariantach (np. `/o-nas/`, nie `/about/` w wersji angielskiej — tutaj slug jest tłumaczony, więc upewnij się, że hreflang wskazuje prawidłowy URL per język).

**Uwaga:** W naszym projekcie slugi są tłumaczone (`/o-nas` → `/about` → `/about`). Hreflang musi wskazywać na **rzeczywisty URL** po przekierowaniu, a nie na abstrakcyjny „canonical path”. Przykład:
- PL: `https://igawo.pl/pl/o-nas/`
- EN: `https://igawo.pl/en/about/`
- DE: `https://igawo.pl/de/about/`

### Tłumaczenia meta

| Język | Tytuł | Opis |
|-------|-------|------|
| PL | Odzyskaj podatek z Niemiec i Holandii \| igawo.pl | 15 lat doświadczenia, 10 000+ rozliczonych spraw... |
| EN | German & Dutch Tax Refund Services \| igawo.pl | 15 years of experience, 10,000+ cases settled... |
| DE | Steuererstattung aus Deutschland & Niederlande \| igawo.pl | 15 Jahre Erfahrung, 10.000+ erledigte Fälle... |

**Nie tłumaczymy mechanicznie.** Opis musi brzmieć naturalnie w danym języku i zawierać słowa kluczowe popularne w tej wersji językowej.

---

## Typowe błędy (lista z audytu)

| Błąd | Skutek | Jak uniknąć |
|------|--------|-------------|
| Brak `/pl/` w URL dla języka polskiego | 404 na stronie głównej | Upewnij się, że `prefixDefaultLocale: true` jest obsługiwane w całym kodzie |
| `getLocalizedPath` zwraca `/o-nas` zamiast `/pl/o-nas` | Wszystkie linki PL = 404 | Zawsze używaj prefixu dla PL w helperach i18n |
| `translatePath` generuje `/en/pl/o-nas` | Przełącznik języków prowadzi do 404 | Przed translacją usuń istniejący prefix językowy |
| Brak `robots.txt` | Google nie znajduje sitemapy | Dodaj `public/robots.txt` ze ścieżką do sitemap |
| Brak schema.org | Brak rich snippets w Google | Dodaj JSON-LD w `Layout.astro` lub per strona |
| Generyczny `description` | Niska CTR w wynikach wyszukiwania | Każda strona = unikalny opis z CTA |
| Picsum / placeholderowe obrazy | Słaba jakość, brak CLS | Używaj własnych obrazów z `public/images/` |
| Brak `width`/`height` na `<img>` | Wysoki CLS, gorsze Core Web Vitals | Zawsze deklaruj wymiary |
| Lazy-loading obrazu above-the-fold | Opóźnienie LCP | Hero = `loading="eager"`, reszta = `loading="lazy"` |
| RSS linkuje do `/posts/` | Użytkownicy RSS dostają 404 | Zaktualizuj URL-e w `rss.xml.ts` do istniejących routów |
| `302` z `/` na `/pl` | Brak przekazania mocy SEO | Zmień na `301` w `middleware.ts` |

---

## Pliki do edycji

| Co zmieniasz | Plik |
|--------------|------|
| Tytuł / opis / canonical per strona | `src/layouts/Layout.astro` (props `title`, `description`, `canonical`) |
| Hreflang globalnie | `src/layouts/Layout.astro` |
| Schema.org globalne | `src/layouts/Layout.astro` (JSON-LD w `<head>`) |
| Schema.org per strona | W pliku `.astro` danej strony (przekaż do `Layout`) |
| Meta per język | `src/i18n/ui.ts` — klucze `meta.*.title`, `meta.*.description` |
| Open Graph / Twitter | `src/layouts/Layout.astro` (props `ogImage`, `ogType`) |
| robots.txt | `public/robots.txt` |
| Sitemap | Generowany automatycznie przez `@astrojs/sitemap` |
| Przekierowanie `/` → `/pl` | `src/middleware.ts` (zmień 302 na 301) |
| Helpery i18n (URL-e) | `src/i18n/utils.ts` (`getLocalizedPath`, `translatePath`) |

---

*Dokument stworzony na podstawie audytu SEO z 2026-05-13. W razie pytań lub nowych typów stron — zaktualizuj tę checklistę.*
