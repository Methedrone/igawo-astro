import rss from '@astrojs/rss';
export const prerender = true;
import type { APIRoute } from 'astro';
import { getPostsByLang } from '../../lib/feed';
import { ui } from '../../i18n/ui';

export const getStaticPaths = () => [
  { params: { lang: 'pl' } },
  { params: { lang: 'en' } },
  { params: { lang: 'de' } },
];

export const GET: APIRoute = async (context) => {
  const lang = context.params.lang as 'pl' | 'en' | 'de';
  if (!lang || !['pl', 'en', 'de'].includes(lang)) {
    return new Response('Not Found', { status: 404 });
  }

  const posts = await getPostsByLang(lang);
  const site = context.site?.toString().replace(/\/$/, '') || 'https://igawo.pl';

  return rss({
    title: ui[lang]['feed.rssTitle'],
    description: ui[lang]['feed.rssDescription'],
    site,
    items: posts.map((post) => ({
      title: post.data.title.name,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/${lang}/posts/${post.data.title.slug}`,
    })),
  });
};
