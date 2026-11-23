import assert from 'node:assert/strict';
import {FlowerChoir} from '../dist/home-sequences.js';
import {frameForTheme} from '../dist/themes.js';
import {readFile} from 'node:fs/promises';
import {unpackSequence} from '../dist/sequence-store.js';
let closed=0,decodes=0;const commits=[];let release;
const gate=new Promise(r=>release=r);
const choir=new FlowerChoir({fetchPack:async key=>Array.from({length:96},(_,frame)=>({key,frame})),decode:async b=>{decodes++;if(b.key==='lotus'&&b.frame===0)await gate;return {...b,close(){closed++;}};},commit:(frames,p,indices)=>{assert.equal(frames.length,5);assert.deepEqual(frames.map(f=>f.frame),indices);assert.deepEqual(indices,Array.from({length:5},(_,i)=>frameForTheme(i,p)));commits.push(p);}});
await choir.prepare();const pending=choir.request(0);await new Promise(r=>setTimeout(r,0));assert.equal(commits.length,0,'do not update four flowers while one is still decoding');
choir.request(.3);choir.request(.5);choir.request(1);release();await pending;
assert.deepEqual(commits,[0,1],'coalesce motion to latest pending position, avoid a lagging decode queue');
for(let n=0;n<=95;n++)await choir.request(n/95);
assert.ok(choir.caches.every(c=>c.size<=6),'bound five-flower decoded memory');
const before=decodes;await choir.request(1);assert.equal(decodes,before,'no repeat decode at a steady position');
choir.dispose();assert.equal(closed,decodes,'release every decoded frame');
let releaseLate,lateClosed=0;const late=new FlowerChoir({fetchPack:async()=>Array(96).fill(0),decode:()=>new Promise(r=>{(releaseLate??=[]).push(()=>r({close(){lateClosed++;}}));}),commit:()=>assert.fail('disposed session must never draw')});
await late.prepare();const waiting=late.request(.5);late.dispose();releaseLate.forEach(r=>r());await waiting;assert.equal(lateClosed,5);
for(const key of ['daylily','xinyi','lotus','jasmine','panzhihua']){const raw=await readFile(new URL(`../dist/assets/home-sequences-v42/${key}.bin`,import.meta.url));assert.equal(unpackSequence(raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength)).length,96);}
console.log('Passed: five-flower atomic frames, latest target, endpoints, bounded cache, disposal and full 96-frame packs.');
