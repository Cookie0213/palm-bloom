import assert from 'node:assert/strict';
import {defaultRange,calibratedRange,gestureProgress,fullBloomThreshold,pinchRatio,closedBloomThreshold,rangeWithClosed,stableProgress,smooth} from '../dist/math.js';

// A comfortable spread which previously mapped to about 73% now reaches the end.
assert.equal(gestureProgress(.8,defaultRange),1);
assert.equal(gestureProgress(.09,defaultRange),0);
const upper=fullBloomThreshold(defaultRange);
assert.ok(gestureProgress(upper-.02,defaultRange)<.99,'closing must respond near the open endpoint');
assert.ok(gestureProgress(.4,defaultRange)>0&&gestureProgress(.4,defaultRange)<1);

// A transient overestimate must not mutate or permanently expand the range.
const before={...defaultRange};
assert.equal(gestureProgress(2.4,defaultRange),1);
assert.equal(gestureProgress(.8,defaultRange),1);
assert.deepEqual(defaultRange,before);

// Personalized ranges cover small and large hands, and respond both ways.
for(const open of [.55,.8,1.35]){
 const range={...calibratedRange(.08,open),closedMeasured:true};
 assert.ok(range);
 assert.equal(gestureProgress(.08,range,true),0);
 assert.equal(gestureProgress(open,range,true),1);
 assert.ok(Math.abs(gestureProgress((open+.08)/2,range,true)-.5)<1e-12);
 const values=Array.from({length:101},(_,i)=>gestureProgress(.08+(open-.08)*i/100,range,true));
 assert.equal(new Set(values.map(x=>Math.round(x*100))).size,101);
 assert.ok(values.every((v,i)=>i===0||v>values[i-1]));
}
for(const pair of [[null,.8],[.1,NaN],[.1,.2],[-.1,.8],[.1,Infinity]])assert.equal(calibratedRange(...pair),null);

// Only thumb (4) and index (8) tips control blooming; moving the middle tip
// alone must not be mistaken for a change in the requested pinch distance.
const hand=Array.from({length:21},()=>({x:.5,y:.5}));
hand[5]={x:.4,y:.5};hand[17]={x:.6,y:.5};hand[0]={x:.5,y:.7};hand[9]={x:.5,y:.5};
hand[4]={x:.45,y:.3};hand[8]={x:.55,y:.3};
const ratio=pinchRatio(hand);
hand[12]={x:.99,y:.01};assert.equal(pinchRatio(hand),ratio);
hand[8].x=.65;assert.ok(pinchRatio(hand)>ratio);
console.log('Passed: comfortable full bloom, no outlier ratchet, continuous personalized endpoints, thumb/index identity.');

// Contact tips can still report a ratio around .16 (formerly 10%).
for(const range of [defaultRange,{closed:.09,open:.8}]) {
 const calibrated=range!==defaultRange;
 for(const ratio of [.14,.16,.18,.20])assert.equal(gestureProgress(ratio,range,calibrated),0);
 const lower=closedBloomThreshold(range,calibrated),upper=fullBloomThreshold(range,calibrated);
 const values=Array.from({length:101},(_,i)=>gestureProgress(lower+(upper-lower)*i/100,range,calibrated));
 assert.ok(values.every((v,i)=>i===0||v>values[i-1]));
 assert.equal(values[100],1);
 assert.ok(gestureProgress(lower+.005,range,calibrated)>0,'opening starts continuously above contact');
 const measured=rangeWithClosed(range,.24,calibrated);
 assert.equal(gestureProgress(.24,measured,true),0);
 assert.equal(gestureProgress(upper,measured,true),1,'zero calibration preserves full-open endpoint');
 assert.equal(measured.closedMeasured,true);
 assert.deepEqual(JSON.parse(JSON.stringify(measured)),measured);
}
assert.equal(rangeWithClosed(defaultRange,null),null);
let closing=.1;for(let i=0;i<90;i++)closing=smooth(closing,stableProgress(closing,gestureProgress(.16,defaultRange)),1/60);
assert.equal(Math.round(closing*100),0,'smoothing must settle to displayed zero');
console.log('Passed: real contact gap, legacy full-open calibration, continuous reopening and explicit zero calibration.');
