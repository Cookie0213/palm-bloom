import assert from 'node:assert/strict';
import {mkdtemp, writeFile, symlink, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createLocalServer} from '../scripts/serve.mjs';

const root = await mkdtemp(join(tmpdir(), 'palmbloom-test-'));
const outside = await mkdtemp(join(tmpdir(), 'palmbloom-private-'));
await writeFile(join(root, 'index.html'), '<h1>Home</h1>');
await writeFile(join(root, 'model.wasm'), '0123456789');
await writeFile(join(outside, 'secret.txt'), 'private');
const server = createLocalServer({root});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
try {
  let response = await fetch(base + '/');
  assert.equal(response.status, 200); assert.equal(await response.text(), '<h1>Home</h1>');
  response = await fetch(base + '/model.wasm', {method:'HEAD'});
  assert.equal(response.headers.get('content-type'), 'application/wasm');
  assert.equal(response.headers.get('content-length'), '10'); assert.equal(await response.text(), '');
  response = await fetch(base + '/model.wasm', {headers:{Range:'bytes=2-5'}});
  assert.equal(response.status, 206); assert.equal(await response.text(), '2345');
  response = await fetch(base + '/model.wasm', {headers:{Range:'bytes=-3'}});
  assert.equal(response.status, 206); assert.equal(await response.text(), '789');
  assert.equal((await fetch(base + '/model.wasm', {headers:{Range:'bytes=99-100'}})).status, 416);
  assert.equal((await fetch(base + '/model.wasm', {headers:{Range:'bytes=1-2,4-5'}})).status, 416);
  assert.equal((await fetch(base + '/missing')).status, 404);
  assert.equal((await fetch(base, {method:'POST'})).status, 405);
  assert.equal((await fetch(base + '/%00')).status, 400);
  assert.equal((await fetch(base + '/..%2fsecret.txt')).status, 403);
  try {
    await symlink(join(outside, 'secret.txt'), join(root, 'escape.txt'));
    assert.equal((await fetch(base + '/escape.txt')).status, 403);
  } catch (error) { if (error.code !== 'EPERM') throw error; }
  console.log('Passed: local server homepage, MIME, HEAD, ranges, missing files and path isolation.');
} finally {
  await new Promise(resolve => server.close(resolve));
  await rm(root, {recursive:true, force:true}); await rm(outside, {recursive:true, force:true});
}
