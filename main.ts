// news-image-20261119 entry (Node 22, standard library only).
//
// The image is the entry.png beside this file: a hand-drawn newspaper-style
// infographic summing up Thursday 19 November 2026, rendered from news.html
// with a local headless Chromium. This program only copies that image to the
// output directory and checks it still meets the gate (whole PNG, <= 1 MiB,
// <= 1024 x 1024), so both runs write byte-identical output.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// package.json marks this directory as an ES module, so Node runs main.ts
// without a module-type warning.

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here: string = dirname(fileURLToPath(import.meta.url));
const source: string = join(here, 'entry.png');
const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target: string = join(outDir, 'entry.png');

// The gate: a whole PNG of at most 1 MiB and at most 1024 by 1024 pixels.
const bytes: Buffer = readFileSync(source);
const PNG_MAGIC: Buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error('entry.png is not a PNG file');
}
if (bytes.length > 1048576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}
const width: number = bytes.readUInt32BE(16);
const height: number = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
console.log(
  `wrote ${target} (${statSync(target).size} bytes, ${width}x${height} PNG)`,
);
