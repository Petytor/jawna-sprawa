import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Zastąpione automatycznie przez .github/workflows/configure-on-first-run.yml zaraz po
// wygenerowaniu instancji z szablonu (patrz ten plik) — do tego czasu jest to tylko placeholder.
const SITE_URL = 'https://jawna-sprawa.pages.dev'; // zgadnięte — po podpięciu własnej domeny zmień ręcznie

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
