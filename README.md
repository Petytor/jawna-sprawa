# jawna-sprawa

**Pokaż, o co pytasz urząd, co urząd odpowiada i jakie działania podejmujesz dalej.**

To szablon publicznej strony dla osób składających wnioski do urzędów, aktywistów, radnych i
mieszkańców, którzy chcą pokazać swoją pracę. Wszystkie pisma, odpowiedzi i aktualizacje
sprawy są w jednym miejscu, aby inni mogli sami ocenić, jak władza odpowiada obywatelom.

## Dlaczego powstał ten szablon?

Chciałem w przejrzysty sposób dzielić się odpowiedziami, które dostaję z urzędów, tak aby
ludzie mogli sami ocenić podejście władzy do obywatela. Ten szablon pozwala pokazać całą
sprawę — od wysłanego pisma, przez odpowiedź, po kolejne działania.

## Koszty

**Korzystanie z szablonu nic nie kosztuje.** Dla jednej strony prowadzonej przez jedną osobę
wystarczą obecne bezpłatne plany GitHub Pages i Decap Turbo. Nie potrzeba płatnego hostingu,
własnego serwera ani własnej domeny. Nie planuję pobierać opłat za szablon ani jego używanie.
Bezpłatne plany i zasady zewnętrznych usług mogą się kiedyś zmienić; dodatkowa osoba
redagująca stronę może wymagać płatnego planu Decap Turbo.

## Jak uruchomić swoją stronę

Potrzebujesz konta GitHub i konta Decap Turbo. Konfiguracja wymaga kilku kroków opisanych
poniżej; nie trzeba instalować programu na komputerze ani wynajmować serwera.

1. Na stronie tego repozytorium wybierz **Use this template → Create a new repository**.
   Nadaj kopii nazwę i ustaw ją jako **Public**. Strona będzie publiczna, a GitHub Pages
   wymaga publicznego repozytorium na bezpłatnym planie.
2. W swojej kopii otwórz **Settings → Pages** i w polu źródła wybierz **GitHub Actions**.
   Publikacja rozpocznie się automatycznie po zapisaniu tej zmiany i potrwa kilka minut.
   Adres strony będzie wyglądać tak: `https://TWÓJ_LOGIN.github.io/NAZWA_REPOZYTORIUM/`.
3. Załóż bezpłatne konto w [Decap Turbo](https://decapcms.org/turbo/), utwórz tam stronę i
   połącz ją z repozytorium GitHub. W razie potrzeby Decap poprosi o zgodę na dostęp do kopii.
   Pomoc znajdziesz w [oficjalnym przewodniku Decap Turbo](https://decapcms.org/docs/turbo-getting-started/).
4. W ustawieniach utworzonej strony Decap skopiuj jej identyfikator. Otwórz w GitHubie plik
   `public/admin/config.yml`, znajdź `turbo_site_id` i zastąp tekst
   `UZUPELNIJ_ID_Z_DECAP_TURBO` skopiowanym identyfikatorem. Zapisz zmianę przyciskiem
   **Commit changes**.
5. Otwórz adres swojej strony zakończony na `/admin/`, np.
   `https://TWÓJ_LOGIN.github.io/NAZWA_REPOZYTORIUM/admin/`, i zaloguj się do panelu Decap.
   Dodawaj tam sprawy, pisma, odpowiedzi urzędu i kolejne działania.

GitHub Pages wystarcza do opublikowania strony — Cloudflare Pages ani własny serwer nie są
potrzebne. Szczegóły konfiguracji panelu można znaleźć też w
[przewodniku łączenia Decap Turbo z repozytorium](https://decapcms.org/docs/turbo-connecting-a-site/).

## Co można pokazać na stronie

- Osobna sprawa dla każdego wniosku lub tematu, z nazwą urzędu i opisem.
- Treść pisma, odpowiedź urzędu i załączniki.
- Kolejne etapy sprawy z datami, terminami i krótką informacją o postępie.
- Zbiorcze liczby pokazujące sprawy w toku, zakończone i oczekujące na odpowiedź.
- Podpowiedź w panelu, gdy treść może zawierać dane osobowe.

## Zanim opublikujesz dokument

Twoja strona i repozytorium są publiczne. Historia zmian w repozytorium zostaje zachowana,
więc późniejsze usunięcie pliku ze strony nie usuwa go automatycznie z historii. Ostrzeżenia
w panelu pomagają, ale nie wykryją wszystkiego. Przed publikacją sprawdź treść i każdy skan,
a z dokumentów usuń dane swoje i innych osób, których nie chcesz ujawniać.

## Edycja i rozwój

Treść strony edytuje się w panelu pod adresem `/admin/`. Jeśli chcesz rozwijać szablon na
swoim komputerze, uruchom:

```bash
npm install
npm run dev
```

Szablon stworzył [Petytor](https://github.com/petytor). Jeśli uważasz go za przydatny,
możesz [postawić mi kawę](https://suppi.pl/mleczakm).
