import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const url = context.url;

  // Redirect root to default locale (permanent)
  if (url.pathname === '/' || url.pathname === '') {
    return context.redirect('/pl', 301);
  }

  return next();
});
