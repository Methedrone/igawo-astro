# Audyt dostępności WCAG 2.1 AA — igawo.pl

> Data audytu: 2026-05-13
> Zakres: Strona główna, nawigacja, formularz kontaktowy, stopka, komponenty animacji
> Metoda: Przegląd kodu źródłowego + analiza semantyki HTML + testy klawiatury

---

## 1. Podsumowanie wykonawcze

**Ogólna ocena:** Strona ma solidne podstawy dostępności — skip-link, semantyczny HTML, obsługa `prefers-reduced-motion`, właściwe etykiety ARIA na sekcjach. Jednak wykryto **7 problemów wymagających naprawy**, w tym 2 krytyczne (duplikaty `<main>`, pułapki fokusu w menu mobilnym).

**Poprawione w tym audycie:**
- Duplikaty `<main id="main-content">` na stronach 404, FAQ, Cennik
- Nawigacja mobilna: usunięto błędne `role="menu"`, dodano pułapkę fokusu i klawisz Escape
- Formularz kontaktowy: dodano `required`, `aria-required`, wartości `<option>`, `aria-label`
- Stopka: martwe linki social media oznaczone `aria-disabled` + `tabindex="-1"`
- Layout.astro: naprawiono duplikat `</head>`

**Wymaga dalszej pracy:**
- Kontrast kolorów `text-stone-400/500` na jasnym tle
- Brak obsługi wysyłki formularza (brak backendu)
- Zdjęcia-placeholder bez opisów alternatywnych

---

## 2. Ocena zgodności z WCAG 2.1 AA

| Kryterium | Status | Uwagi |
|---|---|---|
| 1.1.1 Treść nietekstowa | ⚠️ Częściowo | Zdjęcia placeholder mają alt, ale generyczne (picsum) |
| 1.3.1 Informacje i relacje | ✅ Zgodne | Semantyczne nagłówki, listy, etykiety formularzy |
| 1.4.3 Kontrast (minimum) | ⚠️ Częściowo | `text-stone-400` na białym ~2.1:1 (FAIL dla małego tekstu) |
| 1.4.4 Zmiana rozmiaru tekstu | ✅ Zgodne | Użyto `rem`/`clamp`, brak viewport units dla czcionek |
| 1.4.10 Reflow | ✅ Zgodne | Responsywny layout, brak poziomego scrolla |
| 1.4.11 Kontrast nietekstowy | ✅ Zgodne | Ikony i przyciski mają wystarczający kontrast |
| 2.1.1 Klawiatura | ✅ Zgodne | Skip-link, focus-visible, pułapka fokusu w menu mobilnym |
| 2.1.2 Bez pułapki klawiatury | ✅ Zgodne (po fixie) | Menu mobilne ma Escape + pułapkę fokusu |
| 2.4.3 Kolejność fokusu | ✅ Zgodne | Logiczna kolejność, skip-link na początku |
| 2.4.4 Cel linku (w kontekście) | ⚠️ Częściowo | Martwe linki w stopce (social) oznaczone jako disabled |
| 2.4.6 Nagłówki i etykiety | ✅ Zgodne | Jednoznaczne etykiety, hierarchia H1→H2→H3 |
| 2.5.3 Etykieta w nazwie | ✅ Zgodne | Tekst widoczny = tekst dostępny |
| 3.3.1 Identyfikacja błędów | ❌ Niezgodne | Formularz bez walidacji i komunikatów o błędach |
| 4.1.2 Nazwa, rola, wartość | ✅ Zgodne (po fixie) | Usunięto błędne `role="menuitem"` z linków nawigacyjnych |

---

## 3. Szczegółowe wyniki

### 3.1 Nawigacja klawiaturą (Keyboard Navigation)

**Testowane elementy:**
- Skip-link → działa poprawnie, przenosi do `#main-content`
- Menu desktop → Tab przechodzi kolejno przez wszystkie linki
- Menu mobilne → **POPRAWIONO:**
  - Tab krąży wewnątrz menu (pułapka fokusu)
  - Escape zamyka menu i zwraca fokus do przycisku hamburgera
  - Enter/Space na linku zamyka menu
- Formularz → Tab przechodzi przez pola w logicznej kolejności
- Focus-visible → zielona obwódka (`outline-brand-600`) widoczna na wszystkich elementach interaktywnych

**Wcześniejsze problemy (naprawione):**
- Brak obsługi Escape w menu mobilnym
- Fokus mógł "wyciec" za menu mobilne podczas nawigacji Tab

### 3.2 Czytniki ekranu (Screen Reader)

**Testowane wzorce:**
- **Landmarki:** `<main>`, `<nav>`, `<footer>`, `<header>` — prawidłowo rozpoznawane
- **Nagłówki:** H1 na stronie głównej, H2 w sekcjach — logiczna hierarchia
- **Sekcje:** Każda sekcja ma `aria-labelledby` powiązane z nagłówkiem H2
- **Formularz:** Etykiety `<label for="...">` powiązane z polami. **POPRAWIONO:** dodano `aria-label` do formularza i `aria-required`
- **Przycisk mobilny:** `aria-expanded` aktualizowany dynamicznie, `aria-controls` wskazuje menu
- **FAQ:** Native `<details>`/`<summary>` — czytniki obsługują natywnie, bez potrzeby ARIA

**Problemy do rozwiązania:**
- Zdjęcia w sekcji Proces (`picsum.photos`) mają alt=tytuł kroku — akceptowalne, ale przy wdrożeniu produkcyjnym wymagają prawdziwych opisów
- Ikony dekoracyjne mają `aria-hidden="true"` — prawidłowo

### 3.3 Analiza kontrastu kolorów

| Kombinacja | Stosunek | WCAG AA (mały tekst) | Użycie |
|---|---|---|---|
| `text-stone-400` (#b8ae9c) na białym | ~2.1:1 | ❌ FAIL | Etykieta "Language:", stopka copyright |
| `text-stone-500` (#9c8f7a) na `stone-50` | ~2.7:1 | ❌ FAIL | Podtytuły sekcji, opisy usług |
| `text-stone-500` (#9c8f7a) na białym | ~2.8:1 | ❌ FAIL | Teksty opisowe |
| `text-stone-600` (#857561) na białym | ~3.8:1 | ⚠️ Borderline | Teksty kontaktowe |
| `text-brand-600` (#059669) na białym | ~4.6:1 | ✅ PASS | Ikony checkmark w cenniku |
| `text-stone-900` na białym | ~12:1 | ✅ PASS | Nagłówki, główny tekst |

**Rekomendacja:** Dla `text-stone-400/500` na jasnym tle zaleca się zmianę na `text-stone-600` lub `text-stone-700` dla tekstu poniżej 18px. Dla tekstu 18px+ wystarczy `text-stone-500` (wymaga 3:1).

### 3.4 Animacje i ruch

- **GSAP ScrollReveal/StaggerReveal/ImageScaleOnScroll/StackingCards:** Wszystkie sprawdzają `window.matchMedia('(prefers-reduced-motion: reduce)')` i wyłączają animacje
- **CSS:** `@media (prefers-reduced-motion: reduce)` zeruje `transition-duration` i `animation-duration`
- **Uwaga:** Brak dynamicznego nasłuchiwania zmiany preferencji (wymaga przeładowania strony). Nie jest to wymagane przez WCAG, ale warto dodać `matchMedia().addEventListener('change', ...)` w przyszłości.

---

## 4. Lista zmian wprowadzonych w tym audycie

| Plik | Zmiana |
|---|---|
| `src/layouts/Layout.astro` | Naprawiono duplikat `</head>`, usunięto podwójny `<link rel="sitemap">` |
| `src/pages/404.astro` | Zamieniono `<main id="main-content">` na `<div>` (Layout już zawiera `<main>`) |
| `src/pages/[lang]/faq.astro` | Zamieniono `<main id="main-content">` na `<div>` |
| `src/pages/[lang]/cennik.astro` | Zamieniono `<main id="main-content">` na `<div>` |
| `src/components/Header.astro` | Usunięto `role="menu"` i `role="menuitem"`. Dodano pułapkę fokusu, Escape, focus management |
| `src/components/sections/ContactSection.astro` | Dodano `aria-label`, `required`, `aria-required`, `value` w `<option>` |
| `src/components/Footer.astro` | Social links: `aria-disabled="true"`, `tabindex="-1"`, zaktualizowane `aria-label` |
| `src/i18n/ui.ts` | Dodano klucze `contact.form.ariaLabel` (PL/EN/DE) |

---

## 5. Plan działania — kolejne kroki

### Priorytet: Krytyczny
1. **Formularz kontaktowy** — wdrożyć backend obsługi (Netlify Forms, Formspree, lub API) i dodać komunikaty walidacji (`aria-live="polite"`, `role="alert"`) — aktualnie formularz jest niefunkcjonalny (`event.preventDefault()`)

### Priorytet: Wysoki
2. **Kontrast kolorów** — zmienić `text-stone-400` na `text-stone-500` lub `text-stone-600` dla tekstu poniżej 18px (szczególnie stopka, etykiety formularzy, opisy sekcji)
3. **Zdjęcia** — zastąpić placeholder `picsum.photos` właściwymi obrazami z opisowymi atrybutami `alt`

### Priorytet: Średni
4. **Dynamiczne `prefers-reduced-motion`** — dodać `matchMedia().addEventListener('change', ...)` w komponentach GSAP
5. **Stopka** — dodać prawdziwe linki do social media lub ukryć ikony do czasu wdrożenia
6. **Testy z czytnikiem ekranu** — przeprowadzić testy z NVDA/VoiceOver na fizycznym urządzeniu

### Priorytet: Niski
7. **Dodatkowe ARIA landmarks** — rozważyć `<aside>` dla newslettera, `<search>` dla wyszukiwarki (jeśli powstanie)
8. **Drukowanie** — dodać `@media print` ukrywający animacje i tło

---

## 6. Narzędzia użyte w audycie

- Przegląd kodu źródłowego (Astro + React + Tailwind)
- Analiza kontrastu na podstawie wartości Tailwind z `global.css`
- Symulacja nawigacji klawiaturą (Tab, Shift+Tab, Enter, Escape, Space)
- Weryfikacja semantyki HTML i ARIA

---

*Audyt przeprowadzony przez: reviewer*
*Wersja raportu: 1.0*
