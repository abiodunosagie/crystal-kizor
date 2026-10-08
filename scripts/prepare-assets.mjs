// Turns the source photography and the logo sheet in /assets into the
// web-ready files in /public. Run with `npm run assets` after changing
// anything in /assets. The source folder is large and stays out of git;
// only the optimised output is committed.

import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "assets");
const OUT_IMAGES = path.join(ROOT, "public", "images");
const OUT_BRAND = path.join(ROOT, "public", "brand");
const MANIFEST = path.join(ROOT, "src", "lib", "image-manifest.json");

const WIDTHS = [640, 960, 1440, 2000];
// Same values as --color-ink and --color-cream in src/app/globals.css.
const INK = { r: 22, g: 17, b: 13 };
const CREAM = { r: 247, g: 243, b: 237 };

// Output name -> source file. Names describe the picture, not the camera roll.
const PHOTOS = {
  "crystal-standing": "Crystal_s pictures/Architectural Studio Portrait.png",
  "crystal-arms-crossed": "Crystal_s pictures/Confident Designer in Studio Workspace.png",
  "crystal-white-shirt": "Crystal_s pictures/Architectural Designer in Her Studio.png",
  "crystal-microphone": "Crystal_s pictures/Cozy Architecture Podcast Workspace.png",

  "nature-home-front": "Other assets/Nature Home/Front View with Tree shade.jpeg",
  "nature-home-cantilever": "Other assets/Nature Home/Shade with Cantilevers.jpeg",
  "nature-home-garden": "Other assets/Nature Home/New tree_back garden.jpeg",
  "nature-home-living": "Other assets/Nature Home/Family Sitting Room 2.jpeg",
  "nature-home-lounge": "Other assets/Nature Home/Dividers.jpeg",
  "nature-home-study": "Other assets/Nature Home/B56D4EDB-41B6-48F7-AF8C-13AFA6AFCC76_1_201_a.jpeg",

  "earth-house-garden": "Other assets/Nature Home 2/1.png",

  "community-centre-courtyard": "Other assets/Community Centre Project/IMG_2105 2.JPG",

  // Published by Studio COKA on studiocoka.com/projects/nigeria-first-off-grid-hospital
  // and credited on the page.
  "tesh-before": "studio-coka-public/tesh-before.jpeg",
  "tesh-after": "studio-coka-public/tesh-1.jpg",
};

// Ink bounding boxes of each lockup on "Crystal Kizor Logo Collection.png",
// measured once from the 2172x724 sheet.
const LOGO_SHEET = "Other assets/Crystal Kizor Logo Collection.png";
const LOGOS = {
  primary: { left: 103, top: 186, width: 754, height: 332 },
  monogram: { left: 1111, top: 100, width: 192, height: 150 },
  horizontal: { left: 1557, top: 156, width: 523, height: 34 },
  signature: { left: 1009, top: 463, width: 394, height: 121 },
  social: { left: 1723, top: 415, width: 204, height: 206 },
};

async function photo(name, file) {
  const input = sharp(path.join(SRC, file)).rotate();
  const { width, height } = await input.metadata();
  const widths = WIDTHS.filter((w) => w < width).concat(Math.min(width, 2400));
  for (const w of [...new Set(widths)]) {
    await input
      .clone()
      .resize({ width: w })
      .webp({ quality: 74, effort: 5 })
      .toFile(path.join(OUT_IMAGES, `${name}-${w}.webp`));
  }
  const blur = await input.clone().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  return {
    width,
    height,
    widths: [...new Set(widths)].sort((a, b) => a - b),
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

// The sheet is dark ink on cream paper. Luminance becomes alpha so the mark
// sits cleanly on any background, then it is filled with the ink colour.
// Paper reads at about 240 and ink at about 5 on the sheet: anything at or
// above PAPER is fully transparent, anything at or below SOLID fully opaque,
// and the anti-aliased edge in between keeps its softness.
const PAPER = 236;
const SOLID = 30;

async function logo(name, box, scale = 2) {
  const pad = 6; // keeps the anti-aliased edge of the outermost strokes
  const region = {
    left: box.left - pad,
    top: box.top - pad,
    width: box.width + pad * 2,
    height: box.height + pad * 2,
  };
  const { data, info } = await sharp(path.join(SRC, LOGO_SHEET))
    .extract(region)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const alpha = Math.max(0, Math.min(255, Math.round(((PAPER - data[i]) / (PAPER - SOLID)) * 255)));
    rgba[i * 4] = INK.r;
    rgba[i * 4 + 1] = INK.g;
    rgba[i * 4 + 2] = INK.b;
    rgba[i * 4 + 3] = alpha;
  }
  const mark = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize({ width: info.width * scale, kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toBuffer();
  // The PNG feeds the icon and Open Graph generators; pages load the WebP.
  await writeFile(path.join(OUT_BRAND, `logo-${name}.png`), mark);
  await sharp(mark).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(OUT_BRAND, `logo-${name}.webp`));
}

async function icons() {
  const mark = path.join(OUT_BRAND, "logo-monogram.png");
  const size = 512;
  const glyph = await sharp(mark).resize({ width: 300, height: 300, fit: "inside" }).toBuffer();
  // Composite first, then resize from the finished buffer: sharp applies a
  // resize before compositing within a single pipeline.
  const icon = await sharp({ create: { width: size, height: size, channels: 4, background: { ...CREAM, alpha: 1 } } })
    .composite([{ input: glyph, gravity: "center" }])
    .png()
    .toBuffer();
  await sharp(icon).toFile(path.join(ROOT, "src", "app", "icon.png"));
  await sharp(icon).resize(180).toFile(path.join(ROOT, "src", "app", "apple-icon.png"));
}

async function openGraph() {
  const W = 1200;
  const H = 630;
  const portrait = await sharp(path.join(SRC, PHOTOS["crystal-standing"]))
    .resize({ width: 470, height: H, fit: "cover", position: "top" })
    .toBuffer();
  const wordmark = await sharp(path.join(OUT_BRAND, "logo-primary.png")).resize({ width: 560 }).toBuffer();
  // Text colours match --color-muted and --color-ink.
  const line = Buffer.from(
    `<svg width="600" height="80" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="30" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="3" fill="#5a4a3e">ARCHITECT · DESIGNER · BUILDER</text>
      <text x="0" y="66" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="1" fill="#16110d">Building for this climate, and for the people in it.</text>
    </svg>`,
  );
  await sharp({ create: { width: W, height: H, channels: 4, background: { ...CREAM, alpha: 1 } } })
    .composite([
      { input: portrait, left: W - 470, top: 0 },
      { input: wordmark, left: 72, top: 150 },
      { input: line, left: 72, top: 430 },
    ])
    .jpeg({ quality: 86 })
    .toFile(path.join(ROOT, "src", "app", "opengraph-image.jpg"));
}

// Start clean so renamed or removed photos never linger in /public.
await rm(OUT_IMAGES, { recursive: true, force: true });
await rm(OUT_BRAND, { recursive: true, force: true });
await mkdir(OUT_IMAGES, { recursive: true });
await mkdir(OUT_BRAND, { recursive: true });

const manifest = {};
for (const [name, file] of Object.entries(PHOTOS)) {
  manifest[name] = await photo(name, file);
  process.stdout.write(`image ${name}\n`);
}
for (const [name, box] of Object.entries(LOGOS)) {
  await logo(name, box);
}
await icons();
await openGraph();
await writeFile(MANIFEST, JSON.stringify({ images: manifest }, null, 2) + "\n");
process.stdout.write("done\n");
