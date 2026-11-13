#!/usr/bin/env node
import {readFileSync, readdirSync} from 'node:fs';
import {resolve, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'web');
const defaultUrl = 'https://tux2won.github.io/fubon-sales-slide-skill/web/';
const args = process.argv.slice(2);
const flag = args.indexOf('--url');
if (flag >= 0 && !args[flag + 1]) throw new Error('Provide a URL after --url.');
const base = new URL(flag >= 0 ? args[flag + 1] : defaultUrl);
if (base.protocol !== 'https:' || !base.pathname.endsWith('/')) {
  throw new Error('Use the HTTPS website directory URL with a trailing slash.');
}
const revision = execFileSync('git', ['rev-parse', 'HEAD:web'], {cwd: root, encoding: 'utf8'}).trim();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function files(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const name = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Website source must not contain symlinks.');
    return entry.isDirectory() ? files(name) : [name];
  });
}
let checked = 0;
const pending = files(source);
const failures = [];
// Three downloads at a time avoid an unnecessary burst of font requests.
await Promise.all(Array.from({length: 3}, async () => {
  for (;;) {
    const file = pending.shift();
    if (!file) return;
    const name = relative(source, file).replaceAll('\\', '/');
    try {
      const url = new URL(name.split('/').map(encodeURIComponent).join('/'), base);
      url.searchParams.set('verify', revision);
      const response = await fetch(url, {cache: 'no-store', signal: AbortSignal.timeout(30000)});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const actual = Buffer.from(await response.arrayBuffer());
      if (hash(actual) !== hash(readFileSync(file))) throw new Error('SHA-256 differs from web/');
      checked++;
    } catch (error) { failures.push(`${name}: ${error.message}`); }
  }
}));
if (failures.length) {
  throw new Error(`Published website verification failed:\n${failures.join('\n')}`);
}
console.log(`Verified ${checked} published files match web/ byte-for-byte (SHA-256).`);
console.log(`Website: ${base.href}`);
console.log(`Source web tree: ${revision}`);
