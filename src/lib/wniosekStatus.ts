export const WNIOSEK_STATUSES = [
  'zlozony',
  'oczekiwanie_na_odpowiedz',
  'oczekiwanie_na_odwolanie',
  'zalatwiony',
  'odrzucony',
] as const;

export type WniosekStatus = (typeof WNIOSEK_STATUSES)[number];

const LABELS: Record<WniosekStatus, string> = {
  zlozony: 'Złożony',
  oczekiwanie_na_odpowiedz: 'Oczekiwanie na odpowiedź',
  oczekiwanie_na_odwolanie: 'Oczekiwanie na odwołanie',
  zalatwiony: 'Załatwiony',
  odrzucony: 'Odrzucony',
};

export function statusLabel(status: WniosekStatus): string {
  return LABELS[status];
}

/** Aktywne sprawy najpierw (jak w radzymin.mleczki.pl: w toku -> oczekujące -> zakończone). */
const SORT_ORDER: Record<WniosekStatus, number> = {
  oczekiwanie_na_odpowiedz: 0,
  oczekiwanie_na_odwolanie: 1,
  zlozony: 2,
  zalatwiony: 3,
  odrzucony: 4,
};

export function statusSortOrder(status: WniosekStatus): number {
  return SORT_ORDER[status];
}

export function isOpenStatus(status: WniosekStatus): boolean {
  return status !== 'zalatwiony' && status !== 'odrzucony';
}
