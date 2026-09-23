import { describe, expect, it } from 'vitest';
import { assessSteps, assessmentSummary, isPastDeadline, type WniosekStep } from './stepAssessment';

function d(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

function step(status: string, iso: string, deadlineDni?: number): WniosekStep {
  return { status, data: d(iso), deadlineDni };
}

describe('assessSteps', () => {
  it('answered on the deadline day counts as on time', () => {
    const steps = [step('zlozony', '2026-09-01', 14), step('zalatwiony', '2026-09-15')];
    const a = assessSteps(steps, d('2026-12-01')).get(0);
    expect(a?.timing).toBe('on_time');
    expect(a?.days).toBe(14);
  });

  it('one day after the deadline is late', () => {
    const steps = [step('oczekiwanie_na_odpowiedz', '2026-09-01', 14), step('zalatwiony', '2026-09-16')];
    const a = assessSteps(steps, d('2026-12-01')).get(0);
    expect(a?.timing).toBe('late');
    expect(a?.days).toBe(1);
  });

  it('pending step is "awaiting" until the deadline day inclusive', () => {
    const steps = [step('oczekiwanie_na_odpowiedz', '2026-09-01', 14)];

    const before = assessSteps(steps, d('2026-09-12')).get(0);
    expect(before?.timing).toBe('awaiting');
    expect(before?.days).toBe(3);

    const lastDay = assessSteps(steps, d('2026-09-15')).get(0);
    expect(lastDay?.timing).toBe('awaiting');
    expect(lastDay?.days).toBe(0);
  });

  it('pending step becomes overdue after the deadline', () => {
    const steps = [step('oczekiwanie_na_odpowiedz', '2026-09-01', 14)];
    const a = assessSteps(steps, d('2026-09-20')).get(0);
    expect(a?.timing).toBe('overdue');
    expect(a?.days).toBe(5);
    expect(isPastDeadline(a!.timing)).toBe(true);
  });

  it('steps without deadlineDni are not assessed', () => {
    const steps = [step('zlozony', '2026-09-01'), step('zalatwiony', '2026-09-20')];
    expect(assessSteps(steps, d('2026-12-01')).size).toBe(0);
  });

  it('each step is measured independently, sorted by date even if authored out of order', () => {
    // Authored out of chronological order; sorted, the real sequence is:
    //   A 2026-01-01 (deadline 01-15) -> B 2026-01-10 (deadline 01-24) -> C 2026-02-01
    const stepB = step('oczekiwanie_na_odwolanie', '2026-01-10', 14);
    const stepA = step('oczekiwanie_na_odpowiedz', '2026-01-01', 14);
    const stepC = step('zalatwiony', '2026-02-01');
    const steps = [stepB, stepA, stepC]; // index 0 = B, index 1 = A, index 2 = C

    const assessments = assessSteps(steps, d('2026-12-01'));

    // A ended on B's date (01-10), before its own deadline (01-15): on time, lasted 9 days.
    expect(assessments.get(1)?.timing).toBe('on_time');
    expect(assessments.get(1)?.days).toBe(9);

    // B ended on C's date (02-01), after its own deadline (01-24): late by 8 days.
    expect(assessments.get(0)?.timing).toBe('late');
    expect(assessments.get(0)?.days).toBe(8);
  });

  it('counts correctly across a daylight-saving change (Poland: 2026-03-29)', () => {
    const steps = [step('oczekiwanie_na_odpowiedz', '2026-03-20', 14), step('zalatwiony', '2026-04-03')];
    const a = assessSteps(steps, d('2026-12-01')).get(0);
    expect(a?.timing).toBe('on_time');
    expect(a?.days).toBe(14);
  });

  it('summary text uses correct Polish plural forms', () => {
    const oneLate = assessSteps([step('a', '2026-09-01', 14), step('b', '2026-09-16')], d('2026-12-01')).get(0)!;
    expect(assessmentSummary(oneLate)).toBe('1 dzień po upływie terminu (15.09.2026)');

    const overdue = assessSteps([step('a', '2026-09-01', 14)], d('2026-09-20')).get(0)!;
    expect(assessmentSummary(overdue)).toBe('termin minął 5 dni temu (15.09.2026)');

    const dueToday = assessSteps([step('a', '2026-09-01', 14)], d('2026-09-15')).get(0)!;
    expect(assessmentSummary(dueToday)).toBe('termin upływa dziś (15.09.2026)');
  });
});
