import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages publikuje repozytorium pod adresem https://konto.github.io/nazwa-repo/.
// Jeśli repo ma specjalną nazwę konto.github.io, strona działa od katalogu głównego.
const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const SITE_URL = owner ? `https://${owner}.github.io` : 'https://example.github.io';
const BASE_PATH = owner && repository !== `${owner}.github.io` ? `/${repository}` : '';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
