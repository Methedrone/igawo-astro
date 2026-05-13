import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public', 'images');

async function compress(input, w, h, colors) {
  const tmp = input + '.tmp';
  await sharp(input)
    .resize(w, h, { fit: 'cover', withoutEnlargement: true })
    .png({ palette: true, colors, compressionLevel: 9, adaptiveFiltering: true })
    .toFile(tmp);
  fs.renameSync(tmp, input);
  const size = fs.statSync(input).size;
  console.log(`${path.basename(input)}: ${Math.round(size/1024)}KB`);
}

// OG images with 64 colors
await compress(path.join(imagesDir, 'og-pl.png'), 1200, 630, 64);
await compress(path.join(imagesDir, 'og-en.png'), 1200, 630, 64);
await compress(path.join(imagesDir, 'og-de.png'), 1200, 630, 64);

// Hero images slightly smaller + 64 colors
await compress(path.join(imagesDir, 'hero-1.png'), 1200, 800, 64);
await compress(path.join(imagesDir, 'hero-2.png'), 1200, 800, 64);
await compress(path.join(imagesDir, 'hero-3.png'), 1200, 800, 64);

console.log('Done');
