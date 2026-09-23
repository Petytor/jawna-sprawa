import { days as formatDays } from './polishPlural';

/**
 * Ocena terminowości KAŻDEGO kroku w osi czasu — uogólnienie mechanizmu terminów
 * z radzymin.mleczki.pl (tam: para złożenie/odpowiedź; tu: dowolne przejście między
 * statusami wniosku). Krok "kończy się" wtedy, gdy zaczyna się kolejny krok; ostatni
 * krok trwa "do dziś".
 */
export type StepTiming = 'on_time' | 'late' | 'awaiting' | 'overdue';

export interface WniosekStep {
  status: string;
  data: Date;
  opis?: string;
  /** Ile dni instytucja/strona ma na wyjście z tego statusu, zanim uznajemy go za przeterminowany. */
  deadlineDni?: number;
}

export interface StepAssessment {
  timing: StepTiming;
  /** Data, do której trzeba było zakończyć ten krok. */
  deadline: Date;
  /** Dni spóźnienia (late/overdue), dni do końca (awaiting) lub dni, ile krok trwał (on_time). */
  days: number;
}

/** Czy ten stan wymaga wizualnego wyróżnienia (spóźnienie, obecne lub historyczne). */
export function isPastDeadline(timing: StepTiming): boolean {
  return timing === 'late' || timing === 'overdue';
}

/** Południe UTC, żeby liczenie dni nie psuło się na zmianie czasu letni/zimowy. */
function toUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((toUtcDay(to) - toUtcDay(from)) / 86_400_000);
}

/**
 * Oceny terminowości dla kroków z ustawionym deadlineDni. Ostatni krok (bez następcy)
 * jest oceniany względem `today` — więc "oczekiwanie" samo zmienia się w "przeterminowane"
 * bez potrzeby nowej publikacji.
 */
export function assessSteps(steps: WniosekStep[], today: Date): Map<number, StepAssessment> {
  const sorted = [...steps]
    .map((step, index) => ({ step, index }))
    .sort((a, b) => a.step.data.valueOf() - b.step.data.valueOf());

  const assessments = new Map<number, StepAssessment>();

  sorted.forEach(({ step, index }, position) => {
    if (step.deadlineDni === undefined) return;

    const deadline = new Date(toUtcDay(step.data) + step.deadlineDni * 86_400_000);
    const next = sorted[position + 1];

    if (next) {
      const endedOn = next.step.data;
      assessments.set(
        index,
        endedOn.valueOf() <= deadline.valueOf()
          ? { timing: 'on_time', deadline, days: daysBetween(step.data, endedOn) }
          : { timing: 'late', deadline, days: daysBetween(deadline, endedOn) },
      );
    } else {
      assessments.set(
        index,
        today.valueOf() <= deadline.valueOf()
          ? { timing: 'awaiting', deadline, days: daysBetween(today, deadline) }
          : { timing: 'overdue', deadline, days: daysBetween(deadline, today) },
      );
    }
  });

  return assessments;
}

const LABELS: Record<StepTiming, string> = {
  on_time: 'W terminie',
  late: 'Po terminie',
  awaiting: 'Oczekiwanie',
  overdue: 'Brak reakcji w terminie',
};

export function assessmentLabel(timing: StepTiming): string {
  return LABELS[timing];
}

export function assessmentSummary(assessment: StepAssessment): string {
  const deadline = assessment.deadline.toLocaleDateString('pl-PL');

  switch (assessment.timing) {
    case 'on_time':
      return `${formatDays(assessment.days)} (termin: ${deadline})`;
    case 'late':
      return `${formatDays(assessment.days)} po upływie terminu (${deadline})`;
    case 'awaiting':
      return assessment.days === 0
        ? `termin upływa dziś (${deadline})`
        : `termin: ${deadline} — zostało ${formatDays(assessment.days)}`;
    case 'overdue':
      return `termin minął ${formatDays(assessment.days)} temu (${deadline})`;
  }
}
