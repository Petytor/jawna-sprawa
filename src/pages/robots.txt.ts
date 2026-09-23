import type { APIRoute } from 'astro';

// Endpoint zamiast statycznego pliku w public/, żeby adres mapy strony był zawsze absolutny
// i zgodny z aktualnym Astro.site (ustawianym automatycznie przy generowaniu instancji —
// patrz .github/workflows/configure-on-first-run.yml).
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const sitemapUrl = new URL(`${base}sitemap-index.xml`, site).toString();
  const adminPath = `${base}admin/`;

  // Boty modeli językowych są świadomie dopuszczone — celem strony jest jawność sprawy,
  // więc im szerzej treść jest znajdowana i cytowana, tym lepiej. Kto chce to odwrócić,
  // po prostu usuwa poniższe sekcje.
  const body = `User-agent: *
Allow: /
Disallow: ${adminPath}

Sitemap: ${sitemapUrl}

User-agent: GPTBot
Allow: /
Disallow: ${adminPath}

User-agent: ClaudeBot
Allow: /
Disallow: ${adminPath}

User-agent: PerplexityBot
Allow: /
Disallow: ${adminPath}

User-agent: CCBot
Allow: /
Disallow: ${adminPath}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
