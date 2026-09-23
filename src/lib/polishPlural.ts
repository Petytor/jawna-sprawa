/**
 * Odmiana rzeczownika po liczbie w języku polskim (jak CLDR "pl": jeden / kilka / wiele),
 * np. 1 dzień, 2 dni, 5 dni. Port tej samej reguły co w radzymin.mleczki.pl (src/Text/PolishPlural.php).
 */
export function pluralForm(count: number, one: string, few: string, many: string): string {
  if (count === 1) return one;

  const lastDigit = Math.abs(count % 10);
  const lastTwoDigits = Math.abs(count % 100);

  return lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14) ? few : many;
}

/** Jak pluralForm(), ale z liczbą wstawioną w miejsce każdego "%d". */
export function plural(count: number, one: string, few: string, many: string): string {
  return pluralForm(count, one, few, many).replaceAll('%d', String(count));
}

export function days(count: number): string {
  return plural(count, '%d dzień', '%d dni', '%d dni');
}
