import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Each app keeps its own build. Add future projects here with a separate output path.
await import('../projects/heart-pathway-config/scripts/build.mjs');
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '_site');
await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'projects'), { recursive: true });
await cp(path.join(root, 'index.html'), path.join(output, 'index.html'));
await cp(
  path.join(root, 'projects/heart-pathway-config/dist'),
  path.join(output, 'projects/heart-pathway-config'),
  { recursive: true },
);
await writeFile(path.join(output, '.nojekyll'), '');
console.log('Project catalog and HEART built in _site/');
