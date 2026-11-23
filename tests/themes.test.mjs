import assert from 'node:assert/strict';
import {themes,wrapTheme,frameForTheme,swipeHint,initialTheme} from '../dist/themes.js';
assert.deepEqual(themes.map(t=>t.name),['渠县黄花','江油辛夷','中江荷花','犍为茉莉','攀枝花木棉']);
assert.equal(initialTheme('',''),0);
assert.equal(initialTheme('?flower=jasmine',''),3);
assert.equal(initialTheme('?flower=jasmine','#home'),3);
assert.equal(initialTheme('?flower=jasmine','#kitchen'),3);
assert.equal(initialTheme('?flower=lotus','#culture'),2);
assert.equal(initialTheme('?flower=xinyi','#market'),1);
assert.equal(initialTheme('?flower=unknown','#kitchen'),0);
assert.equal(initialTheme('?flower=panzhihua',''),4);
assert.equal(initialTheme('?flower=panzhihua','#kitchen'),4);
let index=0;
for(const expected of [1,2,3,4,0]){index=wrapTheme(index+1);assert.equal(index,expected);}
for(const expected of [4,3,2,1,0]){index=wrapTheme(index-1);assert.equal(index,expected);}
for(let t=0;t<themes.length;t++){
 assert.equal(frameForTheme(t,0),0);assert.equal(frameForTheme(t,1),95);
 const frames=Array.from({length:1001},(_,i)=>frameForTheme(t,i/1000));
 assert.ok(frames.every((v,i)=>v>=0&&v<=95&&(i===0||v>=frames[i-1])));
 assert.equal(new Set(frames).size,96);
}
assert.match(swipeHint(1),/向左 → 中江荷花 · 向右 → 渠县黄花/);
assert.match(swipeHint(4),/向左 → 渠县黄花 · 向右 → 犍为茉莉/);
console.log('Passed: five-theme order, bidirectional wrap, dynamic hint, every bloom frame reachable, endpoints.');
