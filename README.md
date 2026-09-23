# jawna-sprawa

Darmowy szablon strony do jawnego dokumentowania własnej sprawy z urzędem — pismo po piśmie,
z panelem do edycji w przeglądarce. Bez własnego serwera, bez pisania kodu.

## Chcesz taką samą stronę?

Wystarczy darmowe konto GitHub. Sześć kroków, ok. 5 minut:

1. Kliknij zielony przycisk **„Use this template” → „Create a new repository”** na tym repo,
   wpisz nazwę (np. `moja-sprawa`) i zostaw **Public** (dokumenty mają być jawne, a Public
   jest wymagane pod darmowy hosting i darmowe uwierzytelnianie użyte niżej).
2. Poczekaj chwilę — Twoje nowe repo samo się skonfiguruje (jednorazowy GitHub Action wpisuje
   jego nazwę w odpowiednie miejsca). Nie musisz nic robić.
3. Wejdź na [Cloudflare Pages](https://pages.cloudflare.com/) → **Create a project → Connect
   to Git** → zaloguj GitHubem → wybierz swoje repo → **Save and Deploy**. Po chwili masz
   żywy adres `*.pages.dev`.
4. Wejdź na [Decap Turbo](https://decapcms.org/turbo/) → **Sign up** (logowanie GitHubem) →
   **New site** → wklej adres swojego repo.
5. Wróć na swoją stronę pod adres `/admin` (np. `https://twoja-nazwa.pages.dev/admin`) i
   zaloguj się przez Decap Turbo.
6. Gotowe — dodawaj wnioski w panelu. Każdy zapisany wniosek to commit w Twoim repozytorium.

Chcesz własną domenę zamiast `*.pages.dev`? Zobacz [„Własna domena”](#własna-domena) niżej.

## Co to robi

- Każdy **wniosek** to jedna sprawa prowadzona z instytucją: tytuł, opcjonalny główny
  dokument do podglądu (PDF lub skan, wprost w przeglądarce), oś czasu statusów i treść w
  Markdown.
- **Oś czasu** to kolejne statusy sprawy (złożony, oczekiwanie na odpowiedź, oczekiwanie na
  odwołanie, załatwiony, odrzucony — pełna lista i opis w [„Statusy i
  terminy”](#statusy-i-terminy)), każdy z opcjonalnym terminem w dniach.
- Strona główna pokazuje **zbiorcze statystyki** (liczba wniosków, w toku, zakończonych, po
  terminie) — ten sam pomysł co paski postępu w petycjach na radzymin.mleczki.pl, tylko
  liczony po statusach spraw zamiast po podpisach.
- Panel edycji (`/admin`) **ostrzega przed zapisaniem** wniosku, jeśli wykryje w treści coś,
  co może nie nadawać się do publikacji (PESEL, telefon, e-mail, adres) — patrz
  [„Anonimizacja”](#anonimizacja) niżej.
- Strona jest w pełni statyczna: szybka, tania w hostowaniu (darmowa na Cloudflare Pages),
  dobrze widoczna dla wyszukiwarek i narzędzi AI (patrz [„SEO i LLM”](#seo-i-llm)).

## Statusy i terminy

Każdy krok osi czasu ma status i opcjonalny **termin w dniach** — ile czasu jest na wyjście z
tego statusu, zanim uznajemy go za przeterminowany (domyślnie podpowiadane 14 dni, jak w KPA,
ale to tylko podpowiedź — zmień albo usuń wedle własnej sprawy). Aktualny status sprawy to
zawsze status **ostatniego** (wg daty) kroku — nie ma osobnego pola, które mogłoby się rozjechać
z osią czasu.

Termin liczy się od daty kroku do daty kroku następnego — a jeśli krok jest ostatni (sprawa
wciąż w nim trwa), do dzisiejszej daty. Stąd cztery możliwe oceny, kolorowane na osi czasu:
**w terminie** (zielony), **po terminie** (czerwony, krok już zakończony), **oczekiwanie**
(żółty, krok trwa, termin jeszcze nie minął), **brak reakcji w terminie** (czerwony, krok
trwa, termin już minął — to jedyny stan, który zmienia się sam, bez nowej publikacji, w miarę
upływu czasu). Logika (z testami) jest w `src/lib/stepAssessment.ts`.

## Anonimizacja

To **pomoc, nie gwarancja**. Panel edycji podświetla możliwe dane wrażliwe (regexy: PESEL z
sumą kontrolną, telefon, e-mail, wzorzec adresu) na żywo w podglądzie i próbuje zapytać o
potwierdzenie przed publikacją — ale to repozytorium jest **publiczne**, a historia Gita jest
**trwała**. Samo „usunięcie” pliku później nie usuwa go z historii — poprawka po fakcie
wymaga przepisania historii repo (`git filter-repo` / BFG Repo-Cleaner), nie zwykłego commita.
Zawsze przeczytaj wniosek przed publikacją, zwłaszcza załączany dokument i skany.

## Własna domena

1. Cloudflare Pages → Twój projekt → **Custom domains → Set up a custom domain** → wpisz domenę.
2. Jeśli domena jest już w Cloudflare — rekord DNS i certyfikat SSL dodają się automatycznie.
3. Jeśli domena jest u innego dostawcy — Cloudflare pokaże dokładny rekord `CNAME` (subdomena)
   do dodania ręcznie; dla domeny głównej bez `www.` może być potrzebny mechanizm ALIAS/CNAME
   flattening Twojego dostawcy DNS.
4. Po dodaniu domeny zaktualizuj `SITE_URL` w `astro.config.mjs` (wpływa na `sitemap.xml`,
   `robots.txt`, adresy kanoniczne i `llms.txt`) i ustaw przekierowanie ze starego adresu
   `*.pages.dev` na nową domenę.

## SEO i LLM

- `sitemap-index.xml` generowany automatycznie (`@astrojs/sitemap`).
- `robots.txt` jawnie dopuszcza boty wyszukiwarek i modeli językowych (GPTBot, ClaudeBot,
  PerplexityBot, CCBot) — celem jest jak najszersza widoczność sprawy. Jeśli wolisz to
  odwrócić, edytuj `src/pages/robots.txt.ts`.
- `llms.txt` — zwięzłe, czysto tekstowe podsumowanie strony z linkami do wszystkich wniosków,
  w konwencji [llmstxt.org](https://llmstxt.org/), pomyślane do wczytania przez narzędzia AI.
- Dane strukturalne (JSON-LD: `Article` na każdym wniosku, `WebSite` na stronie głównej) w
  `src/layouts/Layout.astro`.

## Rozwój lokalny

```bash
npm install
npm run dev      # http://localhost:4321
npm run lint      # astro check
npm run test      # vitest — logika terminów (src/lib/stepAssessment.ts)
npm run build
```

## Backend Decap — Turbo czy własny worker?

Domyślnie skonfigurowany jest [Decap Turbo](https://decapcms.org/turbo/) (`backend: name:
turbo-github` w `public/admin/config.yml`) — darmowe hostowane uwierzytelnianie, zero
własnego serwera. Jeśli wolisz nie zależeć od trzeciego podmiotu, możesz zamiast tego
postawić własny OAuth proxy (np. jako Cloudflare Worker) — instrukcja i gotowy szablon są w
[oficjalnej dokumentacji Decap](https://decapcms.org/docs/backends-overview/#using-github-with-an-oauth-proxy).
W takim wypadku zmień `backend.name` na `github` i ustaw `backend.base_url` na adres swojego
workera.

## Plany na później

Czat na stronie z dostępem do historii wniosków, pomagający wyszukiwać informacje w sprawie —
na razie nierozpoczęty, planowany jako osobny etap.

---

Szablon stworzony i utrzymywany przez [organizację petytor](https://github.com/petytor).
