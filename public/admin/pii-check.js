/**
 * Heurystyczne wykrywanie danych, które mogą nie nadawać się do publikacji w jawnym repozytorium
 * (PESEL, telefon, e-mail, adres). To jest POMOC, nie gwarancja — nie zastępuje przeczytania
 * dokumentu przed publikacją. Żadnej biblioteki: to kilkanaście linii regexów, uruchamianych
 * w przeglądarce, zero danych wysyłanych na zewnątrz.
 *
 * WAŻNE dla wdrażającego ten szablon: raz opublikowany plik zostaje w historii Gita nawet po
 * "usunięciu" — to narzędzie musi zadziałać PRZED pierwszym commitem, poprawka po fakcie
 * wymaga przepisania historii repozytorium (git filter-repo / BFG), nie zwykłego nowego commita.
 */
(function (global) {
  'use strict';

  /** Suma kontrolna numeru PESEL (11 cyfr, wagi 1,3,7,9,1,3,7,9,1,3 na pierwszych dziesięciu). */
  function isValidPesel(digits) {
    if (!/^\d{11}$/.test(digits)) return false;
    var weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    var sum = 0;
    for (var i = 0; i < 10; i++) sum += Number(digits[i]) * weights[i];
    var control = (10 - (sum % 10)) % 10;
    return control === Number(digits[10]);
  }

  var PATTERNS = [
    {
      type: 'PESEL',
      // 11 cyfr pod rząd; dalej odsiewane przez sumę kontrolną, żeby nie łapać przypadkowych
      // ciągów liczb (numery spraw, kwoty).
      regex: /\b\d{11}\b/g,
      validate: isValidPesel,
    },
    {
      type: 'e-mail',
      regex: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g,
    },
    {
      type: 'telefon',
      regex: /\b(?:\+48[\s-]?)?(?:\d{3}[\s-]?){2}\d{3}\b/g,
    },
    {
      type: 'adres',
      regex: /\b(?:ul\.|ulica|al\.|aleja|pl\.|plac)\s+[A-ZŁŚŻŹĆŃÓĄĘ][\wąćęłńóśźż-]*(?:\s+[A-ZŁŚŻŹĆŃÓĄĘ]?[\wąćęłńóśźż-]*)?\s+\d+[a-zA-Z]?(?:\/\d+)?\b/g,
    },
  ];

  /**
   * @param {string} text
   * @returns {{type: string, match: string}[]} znalezione fragmenty, każdy raz
   */
  function scanText(text) {
    if (!text) return [];
    var found = [];
    var seen = new Set();
    PATTERNS.forEach(function (p) {
      var m;
      p.regex.lastIndex = 0;
      while ((m = p.regex.exec(text))) {
        if (p.validate && !p.validate(m[0])) continue;
        var key = p.type + ':' + m[0];
        if (seen.has(key)) continue;
        seen.add(key);
        found.push({ type: p.type, match: m[0] });
      }
    });
    return found;
  }

  /** Skanuje wszystkie pola tekstowe wpisu Decap CMS (Immutable Map). */
  function scanEntryData(dataMap) {
    var all = [];
    dataMap.forEach(function (value) {
      if (typeof value === 'string') {
        all = all.concat(scanText(value));
      }
    });
    return all;
  }

  global.PiiCheck = { scanText: scanText, scanEntryData: scanEntryData };
})(window);
