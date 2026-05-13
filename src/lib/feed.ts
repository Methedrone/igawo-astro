import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getPostsByLang(lang: string): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts');
  return posts
    .filter((p) => p.data.lang === lang)
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
