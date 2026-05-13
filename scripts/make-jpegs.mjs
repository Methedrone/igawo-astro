import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public', 'images');

const files = [
  { name: 'og-pl', w: 1200, h: 630, q: 85 },
  { name: 'og-en', w: 1200, h: 630, q: 85 },
  { name: 'og-de', w: 1200, h: 630, q: 85 },
  { name: 'hero-1', w: 1536, h: 1024, q: 80 },
  { name: 'hero-2', w: 1536, h: 1024, q: 80 },
  { name: 'hero-3', w: 1536, h: 1024, q: 80 },
  { name: 'about-office', w: 1200, h: 800, q: 80 },
  { name: 'brandkit-reference', w: 1536, h: 1024, q: 75 },
];

for (const f of files) {
  const input = path.join(imagesDir, `${f.name}.png`);
  const output = path.join(imagesDir, `${f.name}.jpg`);
  await sharp(input)
    .resize(f.w, f.h, { fit: 'cover', withoutEnlargement: true })
    .jpeg({ quality: f.q, progressive: true, mozjpeg: true })
    .toFile(output);
  const size = fs.statSync(output).size;
  console.log(`${f.name}.jpg: ${Math.round(size/1024)}KB`);
}

console.log('Done');
