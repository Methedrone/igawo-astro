# Jak dodawać treści w Keystatic CMS

Dokumentacja dla osób zarządzających treściami w projekcie **igawo.pl**.

---

## Szybki start

### 1. Uruchomienie panelu Keystatic

```bash
npm run dev
```

Panel CMS jest dostępny pod adresem: `http://localhost:4321/keystatic`

### 2. Logowanie

W trybie lokalnym (`storage: 'local'`) nie wymaga się logowania. Panel otwiera się od razu.

---

## Struktura kolekcji

W projekcie mamy 8 kolekcji treści. Każda kolekcja = osobny folder w `src/content/`.

| Kolekcja | Folder | Do czego służy |
|---|---|---|
| **Usługi** | `src/content/services/` | Opisy usług (rozliczenia, Kindergeld, SOKA-BAU, upadłość) |
| **Strony** | `src/content/pages/` | Treści podstron statycznych (o nas, kontakt, cennik) |
| **Wpisy** | `src/content/posts/` | Artykuły na bloga / poradniki |
| **Opinie** | `src/content/testimonials/` | Opinie klientów |
| **Partnerzy** | `src/content/partners/` | Loga i opisy partnerów / "zaufali nam" |
| **FAQ** | `src/content/faq/` | Pytania i odpowiedzi |
| **Pliki** | `src/content/downloads/` | Dokumenty do pobrania (kwestionariusze, wzory) |
| **Formularze** | `src/content/forms/` | Opisy i instrukcje formularzy / kwestionariuszy |

---

## Zasada wielojęzyczności (PL / EN / DE)

Każdy dokument musi istnieć w 3 wersjach językowych:

- **pl** — polska (domyślna)
- **en** — angielska
- **de** — niemiecka

### Jak nazewnictwo plików?

Slug w nazwie pliku powinien być **w języku danego dokumentu**:

```
src/content/services/
  rozliczenie-z-niemiec.md      # pl
  german-tax-return.md          # en
  steuererklaerung-deutschland.md # de
```

**Druga aktywnie używana konwencja** — sufiksowa (`-en`, `-de`), gdzie plik bazowy jest w polskim lub angielskim, a warianty językowe dodają sufiks:

```
src/content/services/
  kindergeld.md       # pl
  kindergeld-en.md    # en
  kindergeld-de.md    # de
```

Obie konwencje są poprawne i w użyciu.

Pole `lang` w frontmatterze musi być zgodne z językiem treści.

### Ważne: zawsze dodawaj 3 wersje

Jeśli dodasz tylko polską wersję, strona w języku angielskim i niemieckim będzie wyświetlać pustą lub błędną treść.

---

## Opis pól w każdej kolekcji

### Usługi (services)

| Pole | Typ | Opis |
|---|---|---|
| **Tytuł** | slug | Nazwa usługi. Tworzy URL: `/oferta/[slug]/` |
| **Język** | select | pl / en / de |
| **Opis** | text | Krótki opis pod tytułem (SEO + lista usług) |
| **Wyróżnione** | checkbox | Czy pokazywać na stronie głównej? |
| **Treść** | markdoc | Pełny opis usługi — edytor wizualny |

### Strony (pages)

| Pole | Typ | Opis |
|---|---|---|
| **Tytuł** | slug | Nazwa strony. Tworzy URL: `/[slug]/` |
| **Język** | select | pl / en / de |
| **Opis (SEO)** | text | Meta description |
| **Treść** | markdoc | Treść strony |

### Wpisy (posts)

| Pole | Typ | Opis |
|---|---|---|
| **Tytuł** | slug | Tytuł artykułu |
| **Język** | select | pl / en / de |
| **Data** | date | Data publikacji |
| **Wstęp** | text | Zajawka / lead |
| **Wyróżnione** | checkbox | Czy pokazywać na górze bloga? |
| **Treść** | markdoc | Pełny artykuł |

### Opinie (testimonials)

| Pole | Typ | Opis |
|---|---|---|
| **Tytuł** | slug | Wewnętrzna nazwa (np. `jan-kowalski-kindergeld`) |
| **Język** | select | pl / en / de |
| **Autor** | text | Imię i nazwisko klienta |
| **Rola** | text | Opis (np. "pracownik budowlany, Dortmund") |
| **Wyróżnione** | checkbox | Czy pokazywać w karuzeli na głównej? |
| **Treść opinii** | markdoc | Tekst opinii |

### Partnerzy (partners)

| Pole | Typ | Opis |
|---|---|---|
| **Tytuł** | slug | Nazwa firmy/organizacji |
| **Język** | select | pl / en / de |
| **Opis** | text | Krótki opis działalności partnera |
| **Treść** | markdoc | Dłuższy opis (opcjonalnie) |

### FAQ

| Pole | Typ | Opis |
|---|---|---|
| **Tytuł / URL** | slug | Wewnętrzny identyfikator (np. `ile-trwa-rozliczenie`) |
| **Język** | select | pl / en / de |
| **Pytanie** | text | Treść pytania (wyświetlane na liście) |
| **Kolejność** | integer | Liczba — im mniejsza, tym wyżej na liście |
| **Odpowiedź** | markdoc | Treść odpowiedzi |

### Pliki (downloads)

| Pole | Typ | Opis |
|---|---|---|
| **Tytuł** | slug | Nazwa dokumentu |
| **Język** | select | pl / en / de |
| **URL pliku** | text | Ścieżka do pliku PDF, np. `/downloads/kwestionariusz-niemcy-pl.pdf` |
| **Typ pliku** | text | `pdf` lub `docx` |
| **Treść** | markdoc | Opis dokumentu — do czego służy, jak wypełnić |

### Formularze (forms)

| Pole | Typ | Opis |
|---|---|---|
| **Tytuł** | slug | Nazwa formularza |
| **Język** | select | pl / en / de |
| **ID formularza** | text | Wewnętrzny identyfikator (np. `kontakt`, `zapytanie`) |
| **Treść** | markdoc | Instrukcje lub opis powyżej formularza |

---

## Jak dodać nową treść — krok po kroku

### Metoda A: przez panel Keystatic (zalecana dla redaktorów)

1. Otwórz `http://localhost:4321/keystatic`
2. Wybierz kolekcję z lewego menu (np. "Usługi / Services")
3. Kliknij **"Create"** (przycisk z prawej strony)
4. Wypełnij pola:
   - **Tytuł** — wpisz nazwę, slug wygeneruje się automatycznie
   - **Język** — wybierz odpowiedni
   - Pozostałe pola zgodnie z opisem powyżej
5. Kliknij **"Create"** na dole formularza
6. **Powtórz dla pozostałych 2 języków**

### Metoda B: bezpośrednio w plikach Markdown (zalecana dla deweloperów)

1. Utwórz plik w odpowiednim folderze, np.:
   ```
   src/content/services/nowa-usluga.md
   ```
2. Wklej szablon frontmatteru:
   ```yaml
   ---
   title:
     name: "Nazwa usługi"
     slug: "nowa-usluga"
   lang: pl
   description: "Krótki opis usługi"
   featured: false
   ---
   
   Treść usługi w formacie Markdown...
   ```
3. Zapisz plik
4. Dodaj wersje EN i DE w osobnych plikach

---

## Format slug (tytuł URL)

Keystatic używa pola `title` jako źródła sluga. Struktura w frontmatterze:

```yaml
title:
  name: "Rozliczenie z Niemiec"
  slug: "rozliczenie-z-niemiec"
```

**Zasady:**
- `slug` tworzy URL — używaj małych liter, myślników, bez polskich znaków
- `name` to wyświetlana nazwa — może zawierać polskie znaki i wielkie litery
- Zmiana sluga zmienia URL — stare linki przestaną działać

---

## Edytor Markdoc — jak używać

Pole **Treść** używa edytora Markdoc (rozszerzenie Markdown).

Dostępne formatowanie:

- **Pogrubienie** — `**tekst**` lub przycisk `B`
- *Kursywa* — `*tekst*` lub przycisk `I`
- Nagłówki — `# H1`, `## H2`, `### H3`
- Listy wypunktowane — `- punkt`
- Listy numerowane — `1. punkt`
- Linki — `[tekst](https://...)`
- Cytaty — `> cytat`

---

## Dodawanie plików PDF do pobrania

1. Umieść plik PDF w folderze `public/downloads/`
2. W kolekcji **Pliki** utwórz wpis z polem:
   - **URL pliku**: `/downloads/nazwa-pliku.pdf`
3. Upewnij się, że plik fizycznie istnieje w `public/downloads/`

---

## Sprawdzanie zmian

Po dodaniu lub edycji treści:

1. Strona deweloperska odświeży się automatycznie (hot reload)
2. Otwórz odpowiedni URL w przeglądarce, np.:
   - `http://localhost:4321/oferta/rozliczenie-z-niemiec/`
   - `http://localhost:4321/en/services/german-tax-return/`
   - `http://localhost:4321/de/services/steuererklaerung-deutschland/`
3. Sprawdź, czy treść wyświetla się poprawnie we wszystkich 3 językach

---

## Wdrażanie zmian na produkcję

Keystatic w tym projekcie pracuje w trybie **lokalnym** (`storage: 'local'`). Oznacza to, że:

- Wszystkie zmiany zapisują się w plikach `.md` w repozytorium
- Aby opublikować, trzeba **zcommitować i wypchnąć** zmiany do git

```bash
git add src/content/
git commit -m "Dodano nową usługę: Rozliczenie z Austrii"
git push
```

---

## Częste problemy

### Nie widzę nowej treści na stronie

- Sprawdź, czy `lang` w pliku zgadza się z językiem URL (`/pl/`, `/en/`, `/de/`)
- Sprawdź, czy plik ma poprawny frontmatter (linie `---` na początku)
- Zrestartuj serwer deweloperski: `Ctrl+C`, potem `npm run dev`

### Zmieniłem slug i strona zwraca 404

Slug jest częścią URL. Zmiana sluga = zmiana adresu. Jeśli musisz zmienić slug:
1. Zaktualizuj też wszystkie linki wewnętrzne
2. Rozważ przekierowanie ze starego URL (wymaga zmiany w kodzie Astro)

### Dodaję treść tylko po polsku — czy to wystarczy?

Nie. Zawsze dodawaj 3 wersje. Strona wymaga kompletu. Brakujące wersje będą wyświetlać pustą stronę lub błąd.

---

## Pliki konfiguracyjne (dla deweloperów)

- `keystatic.config.tsx` — konfiguracja panelu CMS, definicje kolekcji i pól
- `src/content/config.ts` — schematy Astro (Zod) walidujące frontmatter

Jeśli chcesz dodać nowe pole do istniejącej kolekcji, musisz zmienić **oba pliki**.
