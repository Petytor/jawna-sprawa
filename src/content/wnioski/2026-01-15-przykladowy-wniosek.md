---
tytul: 'Przykładowy wniosek — zastąp własną sprawą'
instytucja: 'Przykładowa instytucja'
kroki:
  - status: zlozony
    data: 2026-01-15
    opis: Złożenie wniosku wraz z uzasadnieniem.
  - status: oczekiwanie_na_odpowiedz
    data: 2026-01-15
    deadlineDni: 14
  - status: oczekiwanie_na_odwolanie
    data: 2026-02-05
    deadlineDni: 14
    opis: Odpowiedź negatywna — otwarty termin na odwołanie.
---

To jest przykładowy wniosek pokazujący pełny model: **dokument** (jeśli go dodasz w polu
`dokument`), **oś czasu statusów** z terminami i treść w Markdown opisująca sprawę.

Pierwszy krok (oczekiwanie na odpowiedź, 14 dni od 15.01) zakończył się 05.02 — 6 dni po
terminie, więc oś czasu pokaże go na czerwono. Drugi krok (oczekiwanie na odwołanie) wciąż
trwa — jego kolor zależy od dzisiejszej daty względem terminu.

Usuń ten plik albo podmień go swoją pierwszą sprawą — albo po prostu zacznij edytować w
panelu pod adresem `/admin`.
