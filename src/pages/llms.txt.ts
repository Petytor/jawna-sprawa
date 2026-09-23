import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../site.config';

// Konwencja llms.txt (https://llmstxt.org/) — zwięzłe, czysto tekstowe podsumowanie strony
// z linkami, pomyślane do wczytania przez narzędzia oparte o modele językowe zamiast
// przedzierania się przez HTML. Ten sam wzorzec, co w innym moim projekcie (eduacademy).
export const GET: APIRoute = async ({ site: astroSite }) => {
  const wpisy = (await getCollection('wpisy')).sort(
    (a, b) => b.data.data.valueOf() - a.data.data.valueOf(),
  );

  const lines = [
    `# ${site.nazwaSprawy}`,
    '',
    `> ${site.opisSprawy}`,
    '',
    `Prowadzi: ${site.prowadzacy}.`,
    '',
    '## Wpisy (od najnowszego)',
    '',
    ...wpisy.map((wpis) => {
      const url = new URL(`/wpis/${wpis.id}/`, astroSite).toString();
      const data = wpis.data.data.toISOString().slice(0, 10);
      return `- [${wpis.data.tytul}](${url}) — ${data}${wpis.data.urzad ? `, ${wpis.data.urzad}` : ''}`;
    }),
  ];

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
