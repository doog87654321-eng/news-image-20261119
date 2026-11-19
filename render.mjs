// Render news.html to entry.png with the local headless Chromium.
// Usage: node render.mjs [out.png]  (default: entry.png next to this file)
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const out = resolve(process.argv[2] ?? join(dir, 'entry.png'));
const html = join(dir, 'news.html');
const chrome =
  '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux/chrome';

if (!existsSync(chrome)) throw new Error('Chromium binary not found: ' + chrome);
if (!existsSync(html)) throw new Error('news.html not found: ' + html);

execFileSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=1024,1024`,
    `--screenshot=${out}`,
    `file://${html}`,
  ],
  { stdio: 'inherit' },
);

const st = statSync(out);
console.log(`wrote ${out} (${st.size} bytes)`);
if (st.size > 1048576) throw new Error('entry.png exceeds 1 MiB');
