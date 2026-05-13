import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function svgToPng(input, output, size, bg) {
  const svg = fs.readFileSync(input);
  let pipeline = sharp(svg).resize(size, size);
  if (bg) pipeline = pipeline.flatten({ background: bg });
  await pipeline.png({ compressionLevel: 9 }).toFile(output);
  console.log(`Generated ${output}`);
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const base = path.join(__dirname, '..', 'public');

await svgToPng(path.join(base, 'images/logo-light.svg'), path.join(base, 'images/logo-512.png'), 512);
await svgToPng(path.join(base, 'images/logo-dark.svg'), path.join(base, 'images/logo-512-dark.png'), 512);

const fav = path.join(base, 'favicon');
await svgToPng(path.join(base, 'images/logo-light.svg'), path.join(fav, 'favicon-16x16.png'), 16);
await svgToPng(path.join(base, 'images/logo-light.svg'), path.join(fav, 'favicon-32x32.png'), 32);
await svgToPng(path.join(base, 'images/logo-light.svg'), path.join(fav, 'apple-touch-icon.png'), 180);
await svgToPng(path.join(base, 'images/logo-light.svg'), path.join(fav, 'favicon-192x192.png'), 192);
await svgToPng(path.join(base, 'images/logo-light.svg'), path.join(fav, 'favicon-512x512.png'), 512);

await svgToPng(path.join(base, 'images/logo-wordmark-light.svg'), path.join(base, 'images/logo-wordmark-light.png'), 1024, '#F5F0E8');
await svgToPng(path.join(base, 'images/logo-wordmark-dark.svg'), path.join(base, 'images/logo-wordmark-dark.png'), 1024, '#1A120B');

console.log('Done');
