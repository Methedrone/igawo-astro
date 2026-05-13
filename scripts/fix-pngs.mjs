import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public', 'images');

const files = [
  { name: 'og-pl', w: 1200, h: 630 },
  { name: 'og-en', w: 1200, h: 630 },
  { name: 'og-de', w: 1200, h: 630 },
  { name: 'hero-1', w: 1280, h: 853 },
  { name: 'hero-2', w: 1280, h: 853 },
  { name: 'hero-3', w: 1280, h: 853 },
  { name: 'about-office', w: 1000, h: 667 },
  { name: 'brandkit-reference', w: 1200, h: 800 },
];

for (const f of files) {
  const input = path.join(imagesDir, `${f.name}.png`);
  const tmp = path.join(imagesDir, `${f.name}.tmp.png`);
  
  await sharp(input)
    .resize(f.w, f.h, { fit: 'cover', withoutEnlargement: true })
    .png({ palette: true, colors: 128, compressionLevel: 9, adaptiveFiltering: true })
    .toFile(tmp);
  
  fs.renameSync(tmp, input);
  const size = fs.statSync(input).size;
  console.log(`${f.name}.png: ${Math.round(size/1024)}KB`);
}

console.log('Done');
