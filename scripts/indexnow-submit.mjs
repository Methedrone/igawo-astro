/**
 * IndexNow URL submission script
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs
 *
 * Reads the generated sitemap(s) and submits all URLs to IndexNow.
 * Run after `astro build` and deployment.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE = 'https://igawo.pl';
const KEY = 'd9306a5c160ad18a12f6eebee3b1a88154ab12a871e6f3ff5287958d8339a4b9';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const SITEMAP_INDEX = join(__dirname, '..', 'dist', 'sitemap-index.xml');
const BATCH_SIZE = 10000; // IndexNow allows up to 10,000 URLs per request

async function parseSitemapIndex(xml) {
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function parseUrlSet(xml) {
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function submitUrls(urlList) {
  const body = {
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  if (res.status === 200) {
    console.log('IndexNow: OK (200) — URLs accepted.');
    return true;
  } else if (res.status === 202) {
    console.log('IndexNow: Accepted (202) — URLs queued for processing.');
    return true;
  } else {
    const text = await res.text();
    console.error(`IndexNow Error ${res.status}: ${text}`);
    return false;
  }
}

async function main() {
  console.log('IndexNow submission starting...');

  let sitemapUrls;
  try {
    const indexXml = await readFile(SITEMAP_INDEX, 'utf-8');
    sitemapUrls = await parseSitemapIndex(indexXml);
  } catch (err) {
    console.error('Failed to read sitemap index:', err.message);
    process.exit(1);
  }

  const allUrls = [];
  for (const sitemapUrl of sitemapUrls) {
    // Convert absolute URL to local dist path
    const relativePath = sitemapUrl.replace(SITE, '');
    const localPath = join(__dirname, '..', 'dist', relativePath);
    try {
      const xml = await readFile(localPath, 'utf-8');
      const urls = await parseUrlSet(xml);
      allUrls.push(...urls);
      console.log(`  → ${relativePath}: ${urls.length} URLs`);
    } catch (err) {
      console.error(`Failed to read ${localPath}:`, err.message);
    }
  }

  // Deduplicate
  const uniqueUrls = [...new Set(allUrls)];
  console.log(`Total unique URLs: ${uniqueUrls.length}\n`);

  if (uniqueUrls.length === 0) {
    console.log('No URLs to submit.');
    process.exit(0);
  }

  // Submit in batches if needed
  for (let i = 0; i < uniqueUrls.length; i += BATCH_SIZE) {
    const batch = uniqueUrls.slice(i, i + BATCH_SIZE);
    const ok = await submitUrls(batch);
    if (!ok) {
      process.exit(1);
    }
  }

  console.log('\nIndexNow submission complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
