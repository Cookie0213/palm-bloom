import assert from 'node:assert/strict';
import {PalmSwipe,openPalm} from '../dist/swipe.js';
const base=Array.from({length:21},()=>({x:.5,y:.65,z:0}));
base[0]={x:.5,y:.85};base[4]={x:.23,y:.52};
for(const [m,x] of [[5,.38],[9,.46],[13,.54],[17,.62]]) {
 base[m]={x,y:.64};base[m+1]={x,y:.49};base[m+2]={x,y:.37};base[m+3]={x,y:.23};
}
const pose=(dx=0,dy=0)=>base.map(p=>({...p,x:p.x+dx,y:p.y+dy}));
assert(openPalm(base));
let s=new PalmSwipe();
assert.equal(s.update(pose(),0),0);assert.equal(s.update(pose(.08),100),0);assert.equal(s.update(pose(.19),200),1);
assert.equal(s.update(pose(.35),300),0,'cooldown prevents repeated switches');
s=new PalmSwipe();s.update(pose(),0);s.update(pose(-.08),100);assert.equal(s.update(pose(-.19),200),-1);
s=new PalmSwipe();s.update(pose(),0);s.update(pose(0,.08),100);assert.equal(s.update(pose(0,.19),200),0);
s=new PalmSwipe();s.update(pose(),0);s.update(null,100);assert.equal(s.update(pose(.19),200),0);
const closed=pose();for(const i of [8,12,16,20])closed[i]={x:.5,y:.65};assert.equal(openPalm(closed),false);
s=new PalmSwipe();for(let i=0;i<20;i++)assert.equal(s.update(pose(Math.sin(i)*.015),i*50),0);
console.log('Passed: left/right swipe, cooldown, vertical motion, missing hand, closed palm, jitter.');
