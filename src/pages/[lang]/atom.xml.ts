import type { APIRoute } from 'astro';
export const prerender = true;
import { getPostsByLang, escapeXml } from '../../lib/feed';
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
  const feedUrl = `${site}/${lang}/atom.xml`;
  const homeUrl = `${site}/${lang}`;

  const updated = posts.length > 0
    ? new Date(posts[0].data.date).toISOString()
    : new Date().toISOString();

  const entries = posts.map((post) => {
    const postUrl = `${site}/${lang}/posts/${post.data.title.slug}`;
    return `
    <entry>
      <title>${escapeXml(post.data.title.name)}</title>
      <link href="${postUrl}" />
      <id>${postUrl}</id>
      <updated>${new Date(post.data.date).toISOString()}</updated>
      <summary>${escapeXml(post.data.excerpt)}</summary>
    </entry>`;
  }).join('');

  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(ui[lang]['feed.atomTitle'])}</title>
  <subtitle>${escapeXml(ui[lang]['feed.atomDescription'])}</subtitle>
  <link href="${feedUrl}" rel="self" />
  <link href="${homeUrl}" />
  <updated>${updated}</updated>
  <id>${homeUrl}</id>
  <author>
    <name>igawo.pl</name>
  </author>
  ${entries}
</feed>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
};
