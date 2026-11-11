import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
let count = 0;
function check(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) check(path);
    else if (/\.(mjs|js)$/.test(entry.name)) {
      const result = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
      if (result.status !== 0) { process.stderr.write(result.stderr); process.exit(result.status ?? 1); }
      count++;
    }
  }
}
for (const folder of ['src', 'test', 'examples', 'scripts']) check(join(root, folder));
console.log(`Syntax checks passed for ${count} JavaScript files.`);
