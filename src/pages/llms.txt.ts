import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../site.config';
import { statusLabel, type WniosekStatus } from '../lib/wniosekStatus';

// Konwencja llms.txt (https://llmstxt.org/) — zwięzłe, czysto tekstowe podsumowanie strony
// z linkami, pomyślane do wczytania przez narzędzia oparte o modele językowe zamiast
// przedzierania się przez HTML. Ten sam wzorzec, co w innym moim projekcie (eduacademy).
export const GET: APIRoute = async ({ site: astroSite }) => {
  function lastStep(kroki: { status: WniosekStatus; data: Date }[]) {
    return [...kroki].sort((a, b) => b.data.valueOf() - a.data.valueOf())[0];
  }

  const wnioski = (await getCollection('wnioski')).sort(
    (a, b) => lastStep(b.data.kroki).data.valueOf() - lastStep(a.data.kroki).data.valueOf(),
  );

  const lines = [
    `# ${site.nazwaSprawy}`,
    '',
    `> ${site.opisSprawy}`,
    '',
    `Prowadzi: ${site.prowadzacy}.`,
    '',
    '## Wnioski (od najnowszej aktualizacji)',
    '',
    ...wnioski.map((wniosek) => {
      const url = new URL(`${import.meta.env.BASE_URL}wniosek/${wniosek.id}/`, astroSite).toString();
      const status = statusLabel(lastStep(wniosek.data.kroki).status);
      return `- [${wniosek.data.tytul}](${url}) — ${status}${wniosek.data.instytucja ? `, ${wniosek.data.instytucja}` : ''}`;
    }),
  ];

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
