import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  // With prefixDefaultLocale: false, root / serves Polish content directly.
  // No redirect needed — Astro i18n routing handles locale detection.
  return next();
});
