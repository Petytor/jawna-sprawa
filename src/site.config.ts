// Dane widoczne publicznie na każdej wygenerowanej instancji: kto prowadzi TĘ konkretną
// sprawę (uzupełnia osoba klikająca szablon) i skromny podpis autora samego szablonu
// (w stopce — patrz src/components/Footer.astro). To drugie zostaje z Twoim podpisem po
// sforkowaniu; ktokolwiek chce, może go usunąć edytując Footer.astro.
export const site = {
  // Tytuł/opis widoczny w <title>, meta description, Open Graph i danych strukturalnych.
  nazwaSprawy: 'Nazwa Twojej sprawy',
  opisSprawy: 'Krótki, rzeczowy opis — czego dotyczy sprawa i z jaką instytucją.',
  // Imię i nazwisko lub pseudonim osoby prowadzącej TĘ sprawę — używane w danych
  // strukturalnych (schema.org/Person) jako autor wniosków.
  prowadzacy: 'Imię i nazwisko',
};

// Podpis twórcy szablonu — TODO: uzupełnić przed pierwszą publikacją repozytorium petytor/jawna-sprawa.
export const tworcaSzablonu = {
  nazwa: 'TODO',
  linkKawa: 'https://suppi.pl/mleczakm',
  linkInneProjekty: 'https://TODO',
};
