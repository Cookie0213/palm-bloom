import assert from 'node:assert/strict';
import {readFile, readdir, stat, access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve, relative, dirname, extname} from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
async function walk(dir) {
  const results=[];
  for (const item of await readdir(dir,{withFileTypes:true})) {
    if (['.git','node_modules'].includes(item.name)) continue;
    const p=resolve(dir,item.name);
    if(item.isDirectory()) results.push(...await walk(p));
    else if(item.isFile()) results.push(p);
  }
  return results;
}
const files=await walk(root);
for (const p of files) {
  const rel=relative(root,p).replaceAll('\\','/');
  assert.ok(!rel.startsWith('.openai/'), 'Hosting identity must not be exported');
  assert.ok(!/(^|\/)\.env($|\.)/.test(rel), 'Private environment file: '+rel);
  assert.notEqual(rel, 'dist/assets/culture/harvest.webp', 'Original family photograph excluded');
  assert.ok((await stat(p)).size < 100*1024*1024, 'GitHub single file limit: '+rel);
  if (!rel.startsWith('dist/') || rel.startsWith('dist/vendor/') || !['.js','.html','.css'].includes(extname(p))) continue;
  const text=await readFile(p,'utf8');
  const refs=[...text.matchAll(/(?:src|href|poster)=["']([^"']+)["']/g),...text.matchAll(/\b(?:from|import)\s*\(?\s*["'](\.[^"']+)["']/g)];
  for (const [,raw] of refs) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(raw)||raw.includes('${')) continue;
    const path=raw.split(/[?#]/)[0]; if(!path)continue;
    await access(resolve(dirname(p),decodeURIComponent(path)));
  }
}
for (const item of JSON.parse(await readFile(resolve(root,'docs/VENDOR_MANIFEST.json'),'utf8')).files) {
  const bytes=await readFile(resolve(root,item.path));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256,'Vendor changed: '+item.path);
}
assert.match(await readFile(resolve(root,'LICENSE'),'utf8'),/MIT License/);
await access(resolve(root,'LICENSES/MediaPipe-Apache-2.0.txt'));
console.log(`Checked ${files.length} files: local static references, vendor hashes, size limits and export exclusions.`);
