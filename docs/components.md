# Dokumentacja komponentow Astro — igawo.pl

Dokumentacja wszystkich komponentow UI w projekcie igawo-astro. Stack: Astro 5, React islands, GSAP, Tailwind CSS v4.

---

## Spis tresci

1. [Architektura komponentow](#architektura-komponentow)
2. [Layouty](#layouty)
3. [Komponenty globalne](#komponenty-globalne)
4. [Sekcje strony](#sekcje-strony)
5. [Komponenty animacji (React islands)](#komponenty-animacji)
6. [System designowy — klasy uzytkowe](#system-designowy)
7. [Interfejs tlumaczen (i18n)](#interfejs-tlumaczen)
8. [Wskazowki dla deweloperow](#wskazowki-dla-deweloperow)

---

## Architektura komponentow

```
src/components/
|-- Header.astro          # Nawigacja globalna (glassmorphism pill)
|-- Footer.astro          # Stopka globalna
|-- animations/           # React islands — GSAP + ScrollTrigger
|   |-- ScrollReveal.tsx
|   |-- StaggerReveal.tsx
|   |-- ImageScaleOnScroll.tsx
|   `-- StackingCards.tsx
`-- sections/             # Sekcje strony głównej i podstron
    |-- Hero.astro
    |-- ServicesBento.astro
    |-- ProcessSection.astro
    |-- AboutSection.astro
    |-- ContactSection.astro
    |-- DownloadsSection.astro
    |-- FormsSection.astro
    |-- CtaSection.astro
    |-- PartnersSection.astro
    `-- TestimonialsSection.astro
```

Zasada: Astro komponenty renderuja HTML po stronie serwera. React islands (`client:load`, `client:visible`) hydratuja tylko tam, gdzie potrzebny jest interaktywny JS (GSAP).

---

## Layouty

### `src/layouts/Layout.astro`

Glowny layout kazdej strony. Zawiera `<SEO>` (astro-seo), `<Header>`, `<Footer>`, skip-link i globalne style.

**Props:**

| Prop | Typ | Domyslnie | Opis |
|------|-----|-----------|------|
| `title` | `string` | — | Tytul strony (doklejany `| igawo.pl`) |
| `description` | `string` | `t('common.description')` | Meta description |
| `image` | `string` | `/og-image.jpg` | Obraz Open Graph |

**Uzycie:**

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="Oferta" description="Rozliczenia podatkowe za granica">
  <!-- zawartosc strony -->
</Layout>
```

---

## Komponenty globalne

### `Header.astro`

Szklana nawigacja w formie "pill" — `fixed top-0`, z `backdrop-blur`. Zawiera:
- logo `igawo.pl`
- nawigacje desktopowa (8 linkow)
- przełacznik jezyka PL/EN/DE
- hamburger + menu mobilne

**Zaleznosci:** `../i18n/utils` (`getLangFromUrl`, `useTranslations`, `getLocalizedPath`, `translatePath`)

**Kluczowe cechy:**
- Aktualny link podswietlany tlem `bg-stone-100 rounded-full`
- Przelacznik jezykow zachowuje biezaca sciezke (tlumaczy slugi)
- Menu mobilne togglowane vanilla JS (inline `<script>`)
- Pelna obsluga ARIA (`aria-current`, `aria-expanded`, `aria-label`, `aria-controls`, `role="menu"`)

**Brak propsow** — wszystko czyta z `Astro.url`.

---

### `Footer.astro`

Stopka 4-kolumnowa (2+1+1 na desktopie). Zawiera:
- logo + opis firmy
- ikony social (Facebook, LinkedIn, WhatsApp)
- 2 grupy linkow: "Uslugi" i "Firma"
- copyright + linki prawne

**Zaleznosci:** `../i18n/utils`

**Brak propsow** — jezyk brany z URL.

---

## Sekcje strony

Kazda sekcja przyjmuje jeden prop:

| Prop | Typ | Opis |
|------|-----|------|
| `lang` | `string` | Kod jezyka: `pl`, `en`, `de` |

### `Hero.astro`

Cinematic hero — `min-h-[100dvh]`, wycentrowany tekst, gradient radialny w tle.

**Elementy:**
- H1 max 2 linie (`text-balance`), highlight gradientem
- Podtytul
- 2 CTA: primary (ciemny pill) + secondary (szklany pill)
- 3 trust-badges z ikonami (checkmark, shield, clock)

**Animacje:** `ScrollReveal` client:load (kaskada delay: 0.1, 0.25, 0.4, 0.55)

**Kluczowe klasy:** `gradient-radial`, `text-[clamp(2.5rem,6vw,5rem)]`, `container-wide`

---

### `ServicesBento.astro`

Siatka Bento 3-kolumnowa z `grid-flow-dense`. Pobiera kolekcje `services` z Keystatic CMS.

**Logika CMS:**
```ts
const allServices = await getCollection('services');
const services = allServices
  .filter((s) => {
    const id = s.id;
    if (lang === 'pl') return !id.endsWith('-en') && !id.endsWith('-de');
    if (lang === 'en') return id.endsWith('-en');
    if (lang === 'de') return id.endsWith('-de');
    return true;
  })
  .slice(0, 5);
```

**Uklad kart:**
- Karta 0: `md:col-span-2 md:row-span-2` (duza)
- Karta 2: `md:col-span-2` (szeroka)
- Pozostale: 1x1

**Style:** kazda karta ma unikalny gradient z listy `gradients`, ikone SVG z listy `icons`, efekt hover z `blur-3xl` glow.

---

### `ProcessSection.astro`

Sekcja procesu 4 krokow z animacja stacking cards.

**Dane:** tabela `steps` z tlumaczeniami (label, title, desc, img, alt).

**Animacja:** `StackingCards` z `cardSelector=".stack-card"`. Karty pinnuja sie przy scrollu, zmniejszaja i przyciemniaja (`scale: 0.95`, `brightness(0.85)`).

**Klasy:** `glass-panel rounded-[2.5rem]`, grid 2-kolumnowy (tekst + obraz).

---

### `AboutSection.astro`

Sekcja "O nas" — 2-kolumnowy grid (tekst + obraz).

**Lewa kolumna:**
- H2 z highlightem
- 2 akapity
- 4 statystyki w siatce 2x2 (wartosc + labela)

**Prawa kolumna:**
- Obraz 4:5 z `ImageScaleOnScroll` (scale 0.85 → 1, fade-out przy dalszym scrollu)
- Floating badge (glass-pill) z ikona checkmark

**Tlo:** `bg-stone-50`

---

### `ContactSection.astro`

Sekcja kontaktowa — 2 kolumny: dane kontaktowe + formularz.

**Lewa kolumna:**
- H2, akapit
- 3 bloki kontaktowe: email, telefon (2 numery), adres
- Kazdy blok: ikona w `bg-stone-100 rounded-xl` + labela + wartosc

**Prawa kolumna:**
- Formularz w `glass-panel rounded-[2.5rem]`
- Pola: Imie i nazwisko, Email, Temat (select), Wiadomosc (textarea)
- Przycisk submit: pelna szerokosc, `bg-stone-900 rounded-full`
- Formularz ma `onsubmit="event.preventDefault();"` — wymaga podpiecia backendu

---

### `DownloadsSection.astro`

Siatka plikow do pobrania z CMS (`downloads` collection).

**Filtracja jezykowa:** identyczna jak w ServicesBento.

**Karta pliku:**
- Ikona dokumentu w `bg-stone-100`
- Badge typu pliku (PDF, DOC, itp.)
- Tytul, opis (skrocony do 120 znakow)
- Link "Pobierz" z ikona strzalki w dol

**Siatka:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

### `FormsSection.astro`

Siatka kwestionariuszy/formularzy z CMS (`forms` collection).

**Mapowanie ikon:** `iconMap` — kazdy formularz ma przypisana ikone SVG wedlug slugu (np. `formularz-kontaktowy`, `zapytanie-ofertowe`, `konsultacja-podatkowa`).

**Mapowanie kolorow:** `colorMap` — kolory tla ikony (brand, blue, amber).

**Fallback:** `defaultIcon` + `defaultColor` dla nieznanych slugow.

**Karta:** poziomy layout (ikona 56px + tekst). Link CTA z strzalka.

---

### `CtaSection.astro`

Sekcja call-to-action na ciemnym tle (`bg-stone-900`).

**Tlo:**
- Obraz z `opacity-10`
- Gradient overlay
- Glow effect: `bg-brand-500/10 blur-[120px]`

**Zawartosc:**
- H2 bialy z `text-brand-400` highlight
- Podtytul `text-stone-400`
- 2 przyciski: primary (bialy) + secondary (outline bialy)

---

### `PartnersSection.astro`

Siatka partnerow z CMS (`partners` collection).

**Karta:**
- Ikona uzytkownika w `bg-brand-50`
- Tytul, opis
- Glow hover `bg-brand-200/20 blur-3xl`

**Siatka:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

---

### `TestimonialsSection.astro`

Siatka opinii klientow z CMS (`testimonials` collection).

**Filtracja:** `s.data.lang === lang` (pole `lang` w frontmatter).

**Karta:**
- 5 gwiazdek `text-brand-400`
- Tresc opinii
- Avatar z inicjalami w `bg-brand-100`
- Autor + rola

**Naglowki:** inline `headings` map (bo zawieraja HTML `<span class="text-gradient">`).

---

## Komponenty animacji

Wszystkie to **React islands** wymagajace `client:load` lub `client:visible`.
Kazdy sprawdza `prefers-reduced-motion: reduce` — jesli tak, animacja nie uruchamia sie.

### `ScrollReveal.tsx`

Pojedynczy element pojawiajacy sie przy scrollu.

**Props:**

| Prop | Typ | Domyslnie | Opis |
|------|-----|-----------|------|
| `children` | `ReactNode` | — | Zawartosc |
| `className` | `string` | `""` | Klasy CSS |
| `delay` | `number` | `0` | Opoznienie (s) |
| `duration` | `number` | `0.8` | Czas animacji |
| `y` | `number` | `40` | Przesuniecie Y (px) |
| `scale` | `number` | `1` | Skala poczatkowa |
| `stagger` | `number` | `0` | Stagger miedzy elementami (gdy children to lista) |
| `once` | `boolean` | `true` | Czy animowac raz |

**Trigger:** `top 85%`
**Easing:** `power3.out`

---

### `StaggerReveal.tsx`

Kontener, ktorego dzieci pojawiaja sie kaskadowo.

**Props:**

| Prop | Typ | Domyslnie | Opis |
|------|-----|-----------|------|
| `children` | `ReactNode` | — | Dzieci (musza byc elementami DOM) |
| `className` | `string` | `""` | Klasy kontenera |
| `childClassName` | `string` | `""` | Klasy CSS kazdego dziecka |
| `stagger` | `number` | `0.1` | Odstep miedzy dziecmi (s) |
| `duration` | `number` | `0.7` | Czas pojedynczej animacji |
| `y` | `number` | `30` | Przesuniecie Y |

**Trigger:** `top 80%`

---

### `ImageScaleOnScroll.tsx`

Obraz skalujacy sie i znikajacy przy scrollu.

**Props:**

| Prop | Typ | Domyslnie | Opis |
|------|-----|-----------|------|
| `src` | `string` | — | URL obrazu |
| `alt` | `string` | — | Alt text |
| `className` | `string` | `""` | Klasy kontenera |
| `startScale` | `number` | `0.85` | Poczatkowa skala |

**Animacja:**
1. `scale: 0.85 → 1`, `opacity: 0.6 → 1` (scrub, `top 90%` do `center center`)
2. `opacity → 0.2` (scrub, `center center` do `bottom top`)

---

### `StackingCards.tsx`

Efekt "stosu kart" przy scrollu.

**Props:**

| Prop | Typ | Domyslnie | Opis |
|------|-----|-----------|------|
| `children` | `ReactNode` | — | Karty (musza miec klase z `cardSelector`) |
| `className` | `string` | `""` | Klasy kontenera |
| `cardSelector` | `string` | `".stack-card"` | Selektor kart |

**Mechanika:**
- Kazda karta (oprocz ostatniej) dostaje `pin: true` + `scrub: 1`
- Przy `onEnter`: `scale: 0.95`, `brightness(0.85)`
- Przy `onLeaveBack`: przywrocenie oryginalnego stanu
- Ostatnia karta nie jest pinnwana (koniec stosu)

---

## System designowy

### Paleta kolorow

| Nazwa | Zastosowanie |
|-------|--------------|
| `stone-25` | Tlo strony |
| `stone-50` | Tlo sekcji alternatywnych |
| `stone-100` | Tla elementow, borderki |
| `stone-500` | Tekst drugorzedny |
| `stone-900` | Tekst glowny, przyciski |
| `brand-500` | Accent glowny (emerald) |
| `brand-600/700` | Hover accent, gradient |
| `brand-400` | Tekst accent na ciemnym |

### Klasy uzytkowe (global.css)

| Klasa | Efekt |
|-------|-------|
| `.glass-pill` | Biale szklo z `backdrop-blur-xl`, uzywane w Header i badge'ach |
| `.glass-panel` | Lzejsze szklo z `backdrop-blur-md`, uzywane w kartach i formularzach |
| `.gradient-radial` | Rozmyty zielony gradient na gorze sekcji |
| `.gradient-radial-dark` | Ciemniejsza wersja gradientu (wiecej emerald) |
| `.text-gradient` | Tekstowy gradient `brand-700 → brand-500` |
| `.section-padding` | Responsywny padding poziomy (`px-4 sm:px-6 lg:px-8 xl:px-12`) |
| `.container-wide` | Max-width 1400px + centrowanie |
| `.text-balance` | `text-wrap: balance` |

### Typografia

- **Font:** Geist (primary), Satoshi (fallback)
- **H1:** `clamp(2.5rem, 6vw, 5rem)`, `tracking-tighter`, `leading-[1.05]`
- **H2:** `text-4xl md:text-5xl`, `tracking-tighter`, `leading-none`
- **Body:** `text-lg`, `leading-relaxed`
- **Labels:** `text-sm`, `uppercase`, `tracking-wide`

### Zaokraglenia

- Pill nav: `rounded-full`
- Male elementy (ikony, inputy): `rounded-xl`
- Karty, sekcje: `rounded-[2rem]` lub `rounded-[2.5rem]`

---

## Interfejs tlumaczen

Wszystkie sekcje uzywaja `useTranslations(lang)` z `src/i18n/utils.ts`.

**Kluczowe funkcje:**

```ts
getLangFromUrl(url: URL): 'pl' | 'en' | 'de'
getLocalizedPath(path: string, lang: string): string
translatePath(path: string, fromLang: string, toLang: string): string
useTranslations(lang: string): (key: string) => string
```

**Konwencja nazewnictwa kluczy:**
- `nav.*` — nawigacja
- `hero.*` — sekcja hero
- `process.*` — sekcja procesu
- `about.*` — sekcja o nas
- `contact.*` — sekcja kontaktowa
- `cta.*` — sekcja CTA
- `downloads.*`, `forms.*`, `services.*`, `partners.*` — pozostale sekcje
- `common.*` — wspolne (description, skipToContent)

---

## Wskazowki dla deweloperow

### Dodawanie nowej sekcji

1. Stworz plik w `src/components/sections/NazwaSekcji.astro`
2. Uzywaj `interface Props { lang: string }`
3. Importuj `useTranslations` i animacje wg potrzeby
4. Dodaj sekcje do strony w `src/pages/[lang]/...astro`

### Dodawanie nowej animacji

1. Jesli to prosty fade-in — uzyj `ScrollReveal` lub `StaggerReveal`
2. Jesli customowa logika — stworz nowy `.tsx` w `animations/`
3. Zawsze sprawdzaj `prefers-reduced-motion`
4. Zawsze uzywaj `gsap.context()` + cleanup w `useEffect`
5. Rejestruj pluginy GSAP tylko raz na komponent (`gsap.registerPlugin`)

### Dodawanie nowej strony

1. Stworz `src/pages/[lang]/nowa-strona.astro`
2. Uzyj `Layout` i przekaz `lang` do wszystkich sekcji
3. Dodaj slug do `slugTranslations` w `i18n/utils.ts`
4. Dodaj klucze tlumaczen do `src/i18n/ui.ts`
5. Dodaj link do `navItems` w `Header.astro`

### CMS / Keystatic

Kolekcje zdefiniowane w `src/content/config.ts`:
- `services` — uslugi (title, description)
- `downloads` — pliki (title, fileType, fileUrl)
- `forms` — formularze (title, formId)
- `pages` — strony statyczne (title, description)
- `posts` — wpisy blogowe (title, date, excerpt)
- `partners` — partnerzy (title, description)
- `testimonials` — opinie (author, role, lang)
- `faq` — pytania i odpowiedzi (question, order)

Filtracja jezykowa polega na sufiksach ID (`-en`, `-de`) lub polu `lang`.

### Dostepnosc (a11y)

- Kazda sekcja ma `aria-labelledby` wskazujacy na naglowek
- Linki aktualne maja `aria-current="page"`
- Menu mobilne ma `aria-expanded`, `aria-controls`, `role="menu"`
- Skip-link do glownej tresci
- `:focus-visible` z outline brand
- `prefers-reduced-motion` w CSS i w kazdym komponencie GSAP
