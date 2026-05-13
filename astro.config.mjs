// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://igawo.pl',
  output: 'server',
  trailingSlash: 'never',
  adapter: cloudflare(),
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
    optimizeDeps: {
      exclude: [
        'virtual:keystatic-config',
        '@keystatic/core',
      ],
      force: true,
    },
    ssr: {
      external: ['virtual:keystatic-config'],
    },
  },
  integrations: [keystatic(), sitemap({
    filter: (page) => !page.includes('/404') && !page.includes('/keystatic'),
    i18n: {
      defaultLocale: 'pl',
      locales: {
        pl: 'pl-PL',
        en: 'en-US',
        de: 'de-DE',
      },
    },
  }), react()],
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en', 'de'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
