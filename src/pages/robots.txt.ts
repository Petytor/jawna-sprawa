import type { APIRoute } from 'astro';

// Endpoint zamiast statycznego pliku w public/, żeby adres mapy strony był zawsze absolutny
// i zgodny z aktualnym Astro.site (ustawianym automatycznie przy generowaniu instancji —
// patrz .github/workflows/configure-on-first-run.yml).
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site).toString();

  // Boty modeli językowych są świadomie dopuszczone — celem strony jest jawność sprawy,
  // więc im szerzej treść jest znajdowana i cytowana, tym lepiej. Kto chce to odwrócić,
  // po prostu usuwa poniższe sekcje.
  const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${sitemapUrl}

User-agent: GPTBot
Allow: /
Disallow: /admin/

User-agent: ClaudeBot
Allow: /
Disallow: /admin/

User-agent: PerplexityBot
Allow: /
Disallow: /admin/

User-agent: CCBot
Allow: /
Disallow: /admin/
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
