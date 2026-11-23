import assert from 'node:assert/strict';
import {SequenceStore,ThemeTransition,unpackSequence} from '../dist/sequence-store.js';
import {readFile} from 'node:fs/promises';
const deferred=()=>{let resolve,reject;const promise=new Promise((r,j)=>{resolve=r;reject=j;});return {promise,resolve,reject};};
const gate=deferred(),calls=[];let closed=0;
const store=new SequenceStore({fetchPack:async(theme,kind)=>{calls.push(theme+'/'+kind);if(theme==='daylily')await gate.promise;return Array.from({length:96},(_,index)=>({theme,index}));},decode:async blob=>({...blob,width:960,height:720,close(){closed++;}})});
const pending=store.prepare('daylily');
assert.equal(store.frame('daylily',50),null,'HD not ready means no misleading blurry fallback');
gate.resolve();await pending;store.activate('daylily');
const requests=calls.length;
for(let cycle=0;cycle<4;cycle++)for(const index of [...Array(96).keys(),...[...Array(96).keys()].reverse()]){
 const result=store.frame('daylily',index);
 assert.equal(result.frame,index);assert.equal(result.bitmap.width,960);assert.equal(result.quality,'hd');
}
assert.equal(calls.length,requests,'continuous motion requires no network/decode requests');
await store.prefetch('lotus');assert.equal(store.sequences.size,1,'background preload stores compressed bytes only');
await store.prepare('lotus');assert.equal(store.sequences.size,2);
store.activate('lotus');assert.equal(store.sequences.size,1);assert.equal(closed,96,'inactive decoded sequence is released');
await store.prepare('xinyi');store.activate('xinyi');assert.equal(store.frame('xinyi',95).bitmap.width,960);
const a=deferred(),b=deferred(),commits=[];
const transition=new ThemeTransition({prepare:i=>i===1?a.promise:b.promise,commit:i=>commits.push(i)});
const first=transition.select(1);assert.equal(transition.active,0);
const second=transition.select(2);b.resolve();await second;a.resolve();await first;
assert.deepEqual(commits,[2],'text and flower commit atomically; stale requests never overwrite');
store.dispose();assert.equal(store.sequences.size,0);
for(const theme of ['daylily','xinyi','lotus','jasmine','panzhihua']){
 const raw=await readFile(new URL(`../dist/assets/sequences-v22/${theme}/hd.bin`,import.meta.url));
 const buffer=raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength);
 assert.equal(unpackSequence(buffer).length,96);
 const length=new DataView(buffer).getUint32(0,true),meta=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,4,length)));
 assert.equal(meta.width,960);assert.equal(meta.height,720);
}
console.log('Passed: every opening/closing frame stays HD, no motion-time I/O, bounded decoded themes, atomic transitions, native HD packs.');
