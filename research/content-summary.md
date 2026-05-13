# Research Summary: Iza-Strona / podatki.help

**Data audytu:** 2026-05-13
**Źródło:** `/home/m/Work/Iza-Strona` (WordPress block theme `igawo-theme`)
**Cel:** Ekstrakcja treści, struktury, danych firmy, słów kluczowych i design tokenów dla projektu `igawo-astro`.

---

## 1. Struktura stron i podstron

### Strona główna (front-page.html)
Składa się z 8 sekcji (patternów) w kolejności:

1. **Header** — logo + nawigacja + CTA "Konsultacja"
2. **Hero** — headline + obraz + 2 przyciski
3. **Trust Bar** — 3 statystyki (Google 5.0, 10 lat, 1200 klientów)
4. **Services** — 5 usług (2 duże karty + 3 małe)
5. **About** — zdjęcie portretowe + bio Izabeli
6. **Process** — 3 kroki procesu (01-03)
7. **Testimonials** — 2 opinie klientów
8. **Contact** — dane kontaktowe + formularz CF7
9. **Pricing CTA** — wezwanie do cennika
10. **Footer** — nawigacja usług/firmy + dane biura + legal

### Podstrony (12 stron WP)

| Slug | Tytuł | Uwagi |
|------|--------|-------|
| `/rozliczenie-z-niemiec/` | Rozliczenie z Niemiec | ID 8 |
| `/rozliczenie-z-holandii/` | Rozliczenie z Holandii | ID 9 |
| `/kindergeld/` | Kindergeld | ID 10 |
| `/soka-bau/` | SOKA-BAU | ID 11 |
| `/upadlosc/` | Upadłość | ID 12 |
| `/kontakt/` | Kontakt | ID 15, zawiera formularz |
| `/cennik/` | Cennik | ID 16 |
| `/o-nas/` | O nas | ID 17 |
| `/polityka-prywatnosci` | Polityka prywatności | ID 3 |
| `/rodo` | RODO | ID 45 |
| `/impressum` | Impressum | ID 46 |

### Szablony

- `front-page.html` — landing
- `page.html` — podstrony
- `single.html` — wpisy bloga
- `archive.html` — archiwum
- `search.html` — wyniki wyszukiwania
- `404.html` — strona błędu

---

## 2. Treści sekcji

### Oferta (5 usług)

1. **Rozliczenie z Niemiec** — Kompletne przygotowanie deklaracji, ulgi rodzinne i korekty wcześniejszych rozliczeń w oparciu o aktualne orzecznictwo BFH.
2. **Rozliczenie z Holandii** — Wsparcie od pierwszego dokumentu po ostateczną decyzję Belastingdienst i optymalizację zwrotu.
3. **Kindergeld** — Prowadzenie wniosków rodzinnych i profesjonalna komunikacja z Familienkasse.
4. **SOKA-BAU** — Obsługa świadczeń urlopowych i dokumentacji w branży budowlanej (Urlaubs- und Lohnausgleichskasse).
5. **Upadłość** — Strategia oddłużeniowa i wsparcie w procedurze upadłościowej (Insolvenzverfahren).

### O nas (About)

**Headline:** Osobiste wsparcie w świecie finansów
**Bio (2 akapity):**
- Izabela Gawłowska-Wolak pomaga polskim przedsiębiorcom i pracownikom odnaleźć się w przepisach podatkowych Niemiec i Holandii.
- Specjalizacja: trudne przypadki – SOKA-BAU, Kindergeld, upadłość konsumencka. Podejście empatyczne i zaangażowane.
**CTA:** "Poznajmy się lepiej" → /kontakt/
**Zdjęcie:** `izabela-portrait.png`

### Kontakt

**Headline:** Porozmawiajmy o Twojej sprawie.
**Telefony (z theme):**
- PL: +48 572 762 919
- DE: +49 157 3140 1482
**Email (z theme):** biuro@igawo.pl
**Formularz:** Contact Form 7 (id="51", tytuł "Formularz Kontaktowy")
**Notka RODO:** "Twoje dane są bezpieczne i przetwarzane zgodnie z polityką prywatności."

### Proces (3 kroki)

1. **Konsultacja i Analiza** — analiza sytuacji i dokumentów (rozmowa lub formularz online)
2. **Realizacja Formalności** — przygotowanie rozliczenia, wysyłka do urzędu, monitoring
3. **Finalizacja i Zwrot** — decyzja podatkowa i zwrot na konto

### Referencje (2 opinie)

- **Marek Kowalski** — "Pełen profesjonalizm i ogromna wiedza. Pani Izabela pomogła mi w trudnej sprawie z Kindergeld..."
- **Anna Nowak** — "Najlepsza obsługa podatkowa z jaką miałem do czynienia. Wszystko wyjaśnione prosto i klarownie..."

### Pliki do pobrania / Kwestionariusze

**⚠️ Nie znaleziono** dedykowanych patternów/bloków "Pliki do pobrania" ani "Kwestionariusze" w obecnym theme. Formularz kontaktowy (CF7) istnieje w sekcji Kontakt. Te elementy mogą istnieć jako treści stron WP lub na żywej stronie podatki.help.

---

## 3. Dane firmy

| Pole | Wartość (z zadania) | Wartość w theme |
|------|---------------------|-----------------|
| Imię i nazwisko | Izabela Gawłowska-Wolak | Izabela Gawłowska-Wolak |
| Wykształcenie | Akademia Ekonomiczna w Katowicach | — |
| Telefon PL | +48 570016826 | +48 572 762 919 |
| Telefon DE | +49 15752666922 | +49 157 3140 1482 |
| Email | igawo14@gmail.com | biuro@igawo.pl |
| WWW | — | igawo.pl |

---

## 4. Słowa kluczowe i target SEO

### Główne (primary)
- rozliczenie podatku z Niemiec
- rozliczenie podatku z Holandii
- podatki Niemcy / podatki Holandia
- Kindergeld
- SOKA-BAU
- upadłość konsumencka Niemcy

### Poboczne (secondary)
- zwrot podatku z Niemiec / z Holandii
- ulgi rodzinne Niemcy
- Familienkasse / Belastingdienst / BFH orzecznictwo
- Insolvenzverfahren
- doradca podatkowy Polacy za granicą

### Meta description (z functions.php, zakomentowane)
> "Profesjonalne wsparcie w rozliczeniach podatkowych z Niemiec i Holandii. Ekspertka od Kindergeld, SOKA-BAU i upadłości konsumenckiej."

---

## 5. Kolorystyka i design tokens

### Paleta OKLCH (theme.json)

| Token | Nazwa | Wartość OKLCH | Zastosowanie |
|-------|-------|---------------|--------------|
| `base` | Warm Base | `oklch(0.985 0.005 85)` | tło strony |
| `surface` | Ivory Surface | `oklch(0.98 0.003 85)` | tło kart |
| `contrast` | Slate Ink | `oklch(0.18 0.01 70)` | główny tekst |
| `muted` | Muted Text | `oklch(0.5 0.01 70)` | tekst drugorzędny |
| `primary` | Sophisticated Gold | `oklch(0.65 0.12 75)` | CTA, akcenty |
| `primary-soft` | Soft Gold | `oklch(0.92 0.04 80)` | podświetlenia |
| `secondary` | Midnight Blue | `oklch(0.32 0.05 245)` | hover przycisków |
| `deep` | Deep Overlay | `oklch(0.15 0.01 70)` | tło stopki |

### Dziedzictwo z podatki.help (HEX)

| Kolor | HEX | Uwagi |
|-------|-----|-------|
| Primary (gold) | `#dea932` | z podatki.help |
| Secondary (blue) | `#2f5aae` | z podatki.help |

### Typografia

- **Display:** Playfair Display (serif) — nagłówki
- **Body:** Geist (sans-serif, wagi 400/600/700) — treść
- **Legacy:** Montserrat (z podatki.help)

### Skala fontów

| Token | Wartość |
|-------|---------|
| xs | 0.75rem |
| sm | 0.875rem |
| base | 1.0625rem |
| md | 1.25rem |
| lg | 1.5rem |
| xl | clamp(2rem, 5vw, 2.5rem) |
| display | clamp(2.5rem, 8vw, 4.5rem) |

### Spacing (fluid)

| Token | Wartość |
|-------|---------|
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | clamp(1.25rem, 2vw, 1.5rem) |
| 6 | clamp(1.5rem, 3vw, 2rem) |
| 7 | clamp(2rem, 5vw, 3rem) |
| 8 | clamp(3rem, 7vw, 4rem) |
| 9 | clamp(4rem, 10vw, 6rem) |
| 10 | clamp(6rem, 15vw, 10rem) |

### Efekty

- **Glassmorphism:** blur 12px, bg `oklch(0.985 0.005 85 / 0.7)`
- **Double Bezel:** zagnieżdżone subtelne obramowania dla głębi
- **Shadows:** soft / lifted / deep luxury
- **Easing:** out-quart, productive, emphasis

### Breakpoints

`375px → 768px → 1024px → 1440px → 1920px`

---

## 6. Zasoby (assets)

### Obrazy
- `hero-primary` (PNG + WebP)
- `izabela-portrait` (PNG + WebP)
- `service-germany` (PNG + WebP)
- `service-holland` (PNG + WebP)
- `og-image` (PNG + WebP)
- `favicon` (PNG + WebP)

### Fonty (self-hosted woff2)
- Geist Regular, SemiBold, Bold
- Playfair Display Regular, Variable

### Skrypty
- `nav.js` — nawigacja mobilna, sticky header (IntersectionObserver)
- `animations.js` — reveal animations, counters, reduced-motion

---

## 7. Głos marki (Brand Voice)

- **Język:** polski
- **Ton:** Pewna, ciepła, fachowa
- **Styl:** Empatyczna, jasna, bez żargonu. Codzienne metafory dla skomplikowanych konceptów podatkowych.
- **Grupa docelowa:** Polscy pracownicy 25–55 lat, pracujący/pracowali w Niemczech/Holandii
- **Kontekst:** Mobile-first — przeglądanie w przerwach pracy, wieczorami

---

## 8. Uwagi i luki

1. **Rozbieżności w danych kontaktowych:** telefony i email w theme różnią się od tych podanych w zadaniu. Należy zweryfikować, które są aktualne.
2. **Brak sekcji "Pliki do pobrania" i "Kwestionariusze"** w plikach theme — do uzupełnienia lub wyciągnięcia z żywej strony.
3. **Social media** w footerze to placeholder'y (`#`) — wymagają realnych URLi.
4. **WooCommerce** wyłączony i usunięty z theme (naprawa-plan.md potwierdza).
5. **SEO meta** w functions.php jest zakomentowane — wymaga włączenia lub pluginu SEO.
