import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');

async function processImage(inputPath, outputBase, options = {}) {
  const { width, height, quality = 80, avifQuality = 60 } = options;
  
  let pipeline = sharp(inputPath);
  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit: 'cover', withoutEnlargement: true });
  }
  
  // WebP
  await pipeline.clone().webp({ quality, effort: 6 }).toFile(outputBase + '.webp');
  console.log(`Generated ${outputBase}.webp`);
  
  // AVIF
  await pipeline.clone().avif({ quality: avifQuality, effort: 4 }).toFile(outputBase + '.avif');
  console.log(`Generated ${outputBase}.avif`);
  
  // Optimized PNG (for fallback) - write to tmp then move
  const pngPath = outputBase + '.png';
  const tmpPath = outputBase + '.tmp.png';
  await pipeline.clone().png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(tmpPath);
  fs.renameSync(tmpPath, pngPath);
  console.log(`Generated ${pngPath}`);
  
  // Check size
  const stats = fs.statSync(pngPath);
  if (stats.size > 200 * 1024) {
    console.warn(`WARNING: ${pngPath} is ${Math.round(stats.size/1024)}KB (>200KB)`);
  }
}

// OG images: 1200x630
for (const lang of ['pl', 'en', 'de']) {
  const input = path.join(imagesDir, `og-${lang}.png`);
  const output = path.join(imagesDir, `og-${lang}`);
  await processImage(input, output, { width: 1200, height: 630, quality: 85, avifQuality: 65 });
}

// Hero images: keep ~1536x1024 but compress
for (let i = 1; i <= 3; i++) {
  const input = path.join(imagesDir, `hero-${i}.png`);
  const output = path.join(imagesDir, `hero-${i}`);
  await processImage(input, output, { width: 1536, height: 1024, quality: 75, avifQuality: 55 });
}

// About image: 1200x800
const aboutInput = path.join(imagesDir, 'about-office.png');
const aboutOutput = path.join(imagesDir, 'about-office');
await processImage(aboutInput, aboutOutput, { width: 1200, height: 800, quality: 75, avifQuality: 55 });

// Brandkit reference: compress
const brandkitInput = path.join(imagesDir, 'brandkit-reference.png');
const brandkitOutput = path.join(imagesDir, 'brandkit-reference');
await processImage(brandkitInput, brandkitOutput, { width: 1536, height: 1024, quality: 70, avifQuality: 50 });

console.log('Done optimizing images');
