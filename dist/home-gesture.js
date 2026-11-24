import { FlowerChoir } from './home-sequences.js?v=46';
import { defaultRange, rangeWithClosed, pinchRatio, gestureProgress, calibratedRange, median, stableProgress, smooth } from './math.js?v=43';
const $=id=>document.getElementById(id), button=$('choirCamera'), slider=$('choirProgress'), video=$('choirVideo'), overlay=$('choirOverlay'), context=overlay.getContext('2d');
const panels=[...document.querySelectorAll('.flower-photo')];
const canvases=panels.map((panel,i)=>{const c=document.createElement('canvas');c.width=640;c.height=480;c.hidden=true;c.setAttribute('role','img');c.setAttribute('aria-label',`随双指开合的${['渠县黄花','江油辛夷','中江荷花','犍为茉莉','攀枝花木棉'][i]}`);panel.append(c);return c;});
const contexts=canvases.map(c=>c.getContext('2d',{alpha:false}));
const edges=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
let choir=null, preparation=null, ready=false, loaded=0, target=1,current=1, loop=0,lastTime=0, destroyed=false;
let session=null,serial=0,worker=null,stream=null,active=false,inFlight=false,lastVideoTime=-1,lastCapture=0,flightStarted=0,manualUntil=0,lastSeen=0,raw=null,samples=[];
let trackerLoad=null,trackerCancel=null,preparingVisible=false;
let demoStart=null,demoRequested=false,demoRun=0;
let range={...defaultRange},calibrated=false;
try{const saved=JSON.parse(localStorage.getItem('home-flower-range-v1'));const valid=calibratedRange(saved?.closed,saved?.open);if(valid){range={...valid,closedMeasured:saved.closedMeasured===true};calibrated=true;$('choirReset').hidden=false;}}catch{}
function status(text,error=false){$('choirStatus').textContent=text;$('choirStatus').classList.toggle('is-error',error);}
function hand(text){if($('choirHand').textContent!==text)$('choirHand').textContent=text;}
function commit(frames,p,indices){
 if(destroyed)return;
 frames.forEach((frame,i)=>{contexts[i].drawImage(frame,0,0,640,480);canvases[i].hidden=false;canvases[i].dataset.frame=indices[i];panels[i].classList.add('is-live');});
 $('choirPercent').textContent=Math.round(p*100)+'%';slider.value=String(Math.round(p*100));
}
async function prepare(quiet=false){
 if(!quiet)preparingVisible=true;
 if(preparation){if(!ready&&!quiet)status(`正在准备五朵花的同步画面（${loaded}/5）…`);return preparation;}
 loaded=0;$('choirManual').disabled=true;if(!quiet)status('正在准备五朵花的同步画面（0/5）…');
 choir=new FlowerChoir({commit,onload:()=>{loaded++;if(preparingVisible&&!destroyed&&!ready&&!$('choirStatus').classList.contains('is-error'))status(`正在准备五朵花的同步画面（${loaded}/5）…`);}});
 const owner=choir;
 preparation=(async()=>{try{await owner.prepare();if(destroyed) return;await owner.request(current);ready=true;slider.disabled=false;$('choirManual').textContent='五花已就绪';if(!quiet&&!session&&!demoRequested&&!$('choirStatus').classList.contains('is-error'))status('拖动下方滑块，五朵花会一起开合。也可开启摄像头。');wake();}catch(error){owner.dispose();if(choir===owner){choir=null;preparation=null;ready=false;$('choirManual').disabled=false;$('choirManual').textContent='重试加载五花';}throw error;}})();
 return preparation;
}
function renderFailure(){if(destroyed)return;stopDemo();stopCamera();choir?.dispose();choir=null;preparation=null;ready=false;slider.disabled=true;$('choirManual').disabled=false;$('choirManual').textContent='重试加载五花';status('花朵画面暂未准备好，请重试加载。仍可点击花卉进入独立展厅。',true);}
function wake(){if(!loop&&!destroyed){lastTime=performance.now();loop=requestAnimationFrame(tick);}}
function tick(time){
 loop=0;if(destroyed)return;const dt=(time-lastTime)/1000;lastTime=time;
 if(active&&!document.hidden){
  if(inFlight&&time-flightStarted>5000){fail('手部识别响应超时，请重新开启；也可使用滑块。');}
  else capture(time);
 }
 if(ready&&choir){
  if(demoStart!==null){
   // Match the single-flower cadence, with one shared clock for all five.
   target=(1-Math.cos((time-demoStart)/4500*Math.PI))/2;current=target;
  }else{current=smooth(current,target,dt);if(Math.abs(current-target)<.002)current=target;}
  choir.request(current).catch(renderFailure);
 }
 if(active||demoStart!==null||Math.abs(current-target)>.001)loop=requestAnimationFrame(tick);
}
function stopDemo(){
 demoRun++;demoRequested=false;demoStart=null;target=current;
 $('choirDemo').textContent='▷ 自动演示';$('choirDemo').setAttribute('aria-pressed','false');
}
async function startDemo(){
 stopCamera();const run=++demoRun;demoRequested=true;
 $('choirDemo').textContent=ready?'Ⅱ 暂停演示':'取消演示';$('choirDemo').setAttribute('aria-pressed','true');
 try{
  await prepare();if(destroyed||!demoRequested||run!==demoRun)return;
  // Start at the displayed progress, without jumping back to the bud.
  demoStart=performance.now()-Math.acos(1-2*Math.min(1,Math.max(0,current)))*4500/Math.PI;
  $('choirDemo').textContent='Ⅱ 暂停演示';status('自动演示中，五朵花一起绽放、收拢。可暂停、拖动滑块，或开启手势互动。');wake();
 }catch{if(run===demoRun)renderFailure();}
}
function stopCamera(){
 serial++;const old=session;session=null;active=false;old?.cancel?.();
 stream?.getTracks().forEach(t=>t.stop());stream=null;video.pause();video.srcObject=null;
 inFlight=false;lastVideoTime=-1;raw=null;samples=[];target=current;
 button.textContent='开启五花手势互动';button.setAttribute('aria-pressed','false');$('choirCameraCard').hidden=true;$('choirCalibrate').disabled=true;$('choirClosed').disabled=true;
}
function fail(text){stopCamera();releaseTracker();status(text,true);}
async function connect(s){
 const media=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640,max:640},height:{ideal:480,max:480},frameRate:{ideal:30,max:30},facingMode:'user'},audio:false});
 if(session!==s){media.getTracks().forEach(t=>t.stop());return;}
 stream=media;media.getVideoTracks().forEach(t=>t.addEventListener('ended',()=>{if(session===s)fail('摄像头已断开，可以重新开启或使用滑块。');},{once:true}));
 video.srcObject=media;await video.play();if(session!==s)return;
 overlay.width=video.videoWidth;overlay.height=video.videoHeight;context.drawImage(video,0,0);$('choirCameraCard').hidden=false;hand('正在准备识别');
}
function releaseTracker(){
 trackerCancel?.();trackerCancel=null;worker?.terminate();worker=null;trackerLoad=null;
}
function tracker(){
 if(trackerLoad)return trackerLoad;
 button.dataset.trackerState='loading';
 trackerLoad=new Promise((resolve,reject)=>{
  const w=new Worker(new URL('./home-hand-worker.js?v=50',import.meta.url));worker=w;
  let done=false;const timer=setTimeout(()=>finish(Error('MODEL_TIMEOUT')),30000);
  function finish(error){if(done)return;done=true;clearTimeout(timer);trackerCancel=null;if(error){button.dataset.trackerError=error.message;console.warn('Palm Bloom hand tracker:',error.message);w.terminate();if(worker===w){worker=null;trackerLoad=null;}button.dataset.trackerState='error';reject(error);}else{button.dataset.trackerState='ready';resolve();}}
  trackerCancel=()=>finish(Error('CANCELLED'));
  w.onerror=event=>{if(!done)finish(Error(event.message||'MODEL'));else{releaseTracker();if(session)fail('手势识别遇到问题，请重新开启。滑块仍可使用。');}};
  w.onmessage=({data})=>{
   if(worker!==w){data.bitmap?.close();return;}
   if(data.type==='ready')finish();
   else if(data.type==='error'){if(!done)finish(Error(data.message));else{releaseTracker();if(session)fail('手势识别遇到问题，请重新开启。');}}
   else if(data.type==='result'){if(session)result(data,session);else data.bitmap?.close();}
  };
  w.postMessage({type:'init',delegate:'CPU'});
 });
 return trackerLoad;
}
function warmTracker(){
 if(!destroyed&&!document.hidden&&!navigator.connection?.saveData&&navigator.mediaDevices?.getUserMedia)tracker().catch(()=>{});
}
async function startCamera(){
 stopDemo();
 const s={id:++serial,cancel:null};session=s;button.textContent='取消开启';button.setAttribute('aria-pressed','true');status('请允许摄像头权限，正在准备五花互动…');
 try{
  if(!navigator.mediaDevices?.getUserMedia)throw Error('SECURE');
  await Promise.all([connect(s),tracker(),prepare()]);if(session!==s)return;
  active=true;lastSeen=performance.now();button.textContent='关闭摄像头';hand('等待手部识别');status('将一只手完整放入镜头：拇指与食指张开，五花同开；合拢，一起收拢。');wake();
 }catch(e){if(session!==s)return;const messages={NotAllowedError:'摄像头权限未开启。可使用手动滑块（首次请点“手动试开”），或允许摄像头后重试。',NotFoundError:'未找到摄像头。可使用下方滑块体验；首次加载请点“手动试开”。',NotReadableError:'摄像头被占用或暂不可用，请关闭其他摄像头应用后重试。',SECURE:'请在 HTTPS 网站或本地 localhost 页面中使用摄像头；也可手动体验。',MODEL_TIMEOUT:'识别模型加载超时，请重试；滑块仍可使用。'};fail(messages[e.name]||messages[e.message]||'手势互动启动失败，请重试或使用手动滑块。');}
}
async function capture(time){
 if(!active||inFlight||video.readyState<2||video.currentTime===lastVideoTime||time-lastCapture<25)return;
 const s=session,w=worker;lastVideoTime=video.currentTime;lastCapture=time;flightStarted=time;inFlight=true;
 try{const bitmap=await createImageBitmap(video);if(session!==s||worker!==w||!active){bitmap.close();return;}w.postMessage({type:'frame',bitmap,time,session:s.id},[bitmap]);}catch{if(session===s)fail('摄像头画面读取失败，请重新开启。');}
}
function result(data,s){
 if(session!==s||data.session!==s.id||!active){data.bitmap?.close();return;}inFlight=false;
 const now=performance.now(),hands=(data.hands||[]).filter(h=>h.landmarks?.length===21),points=hands[0]?.landmarks;
 const bitmap=data.bitmap;
 try{context.drawImage(bitmap,0,0,overlay.width,overlay.height);if(points){context.strokeStyle='#96ef9b';context.lineWidth=3;context.beginPath();for(const [a,b] of edges){context.moveTo(points[a].x*overlay.width,points[a].y*overlay.height);context.lineTo(points[b].x*overlay.width,points[b].y*overlay.height);}context.stroke();points.forEach((p,i)=>{context.beginPath();context.arc(p.x*overlay.width,p.y*overlay.height,i===4||i===8?6:3,0,Math.PI*2);context.fillStyle=i===4||i===8?'#ffe39b':'#c5ffbd';context.fill();});}}finally{bitmap?.close();}
 if(!points){raw=null;samples=[];$('choirCalibrate').disabled=true;$('choirClosed').disabled=true;if(now-lastSeen>160){target=current;hand('等待手部识别');}return;}
 if(now-lastSeen>250)samples=[];lastSeen=now;samples.push(pinchRatio(points,overlay.width/overlay.height));if(samples.length>3)samples.shift();raw=median(samples);
 $('choirClosed').disabled=samples.length<3||!rangeWithClosed(range,raw,calibrated);
 $('choirCalibrate').disabled=samples.length<3||!calibratedRange(range.closed,raw);hand('已识别手部 · 21 点');
 if(now>manualUntil)target=stableProgress(target,gestureProgress(raw,range,calibrated));
}
button.onclick=()=>{if(session){stopCamera();status('摄像头已关闭，仍可使用滑块控制五花。');}else startCamera();};
$('choirDemo').onclick=()=>{if(demoRequested){stopDemo();status('演示已暂停，可拖动滑块或开启手势互动。');}else startDemo();};
$('choirManual').onclick=()=>{stopDemo();prepare().catch(renderFailure);};
slider.addEventListener('input',()=>{stopDemo();status(active?'手动调整中，稍后恢复手势控制。':'手动体验中，拖动滑块让五朵花一起开合。');target=current=Number(slider.value)/100;manualUntil=performance.now()+2500;wake();});
$('choirClosed').onclick=()=>{const next=rangeWithClosed(range,raw,calibrated);if(!active||performance.now()-lastSeen>250||samples.length<3||!next)return;range=next;calibrated=true;target=current=0;manualUntil=0;$('choirReset').hidden=false;try{localStorage.setItem('home-flower-range-v1',JSON.stringify(range));}catch{}status('已记录合拢位置。双指合拢到这里，五朵花即可回到0%的花苞状态。');wake();};
$('choirCalibrate').onclick=()=>{const next=calibratedRange(range.closed,raw);if(!active||performance.now()-lastSeen>250||!next)return;range={...next,closedMeasured:range.closedMeasured===true};calibrated=true;target=current=1;$('choirReset').hidden=false;try{localStorage.setItem('home-flower-range-v1',JSON.stringify(range));}catch{}status('已记录满开位置。张到这里即可100%盛放，往回收时五朵花同步收拢。');wake();};
$('choirReset').onclick=()=>{range={...defaultRange};calibrated=false;$('choirReset').hidden=true;try{localStorage.removeItem('home-flower-range-v1');}catch{}status('已恢复默认开合范围。');};
document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseTracker();if(document.hidden&&demoRequested){stopDemo();status('页面已切到后台，自动演示已暂停。');}if(document.hidden&&session){stopCamera();status('页面已切到后台，摄像头已关闭。回来后可重新开启。');}});
window.addEventListener('pagehide',()=>{destroyed=true;stopDemo();stopCamera();releaseTracker();cancelAnimationFrame(loop);choir?.dispose();});
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});

// Start fetching on approach, before a click, without requesting camera access.
button.addEventListener('pointerenter',warmTracker);
button.addEventListener('focus',warmTracker);
if(!navigator.connection?.saveData){
 const warmFlowers=()=>{if(!destroyed&&!document.hidden)prepare(true).then(warmTracker).catch(()=>{});};
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();warmFlowers();}},{rootMargin:'240px'});observer.observe($('choirTitle'));window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});}
 else setTimeout(warmFlowers,250);
}
