import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  return context.redirect('/pl/rss.xml', 308);
};
