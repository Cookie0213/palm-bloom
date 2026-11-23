import { panzhihuaCulture } from './panzhihua-content.js?v=47';
import { jasmineCulture } from './jasmine-content.js?v=47';
import { SequenceStore, ThemeTransition } from './sequence-store.js?v=46';
import { themes, wrapTheme, frameForTheme, swipeHint, initialTheme } from './themes.js?v=41';
import { HandRoles } from './hand-roles.js?v=23';
import { lotusCulture, xinyiCulture, renderRecipes } from './content.js?v=47';
import { renderOrigins } from './origins.js?v=47';
import { PalmSwipe } from './swipe.js?v=17';
import { defaultRange, rangeWithClosed, calibratedRange, gestureProgress, median, pinchRatio, smooth, stableProgress } from './math.js?v=43';

const byId = id => document.getElementById(id);
const flower = byId('flower');
const flowerContext = flower.getContext('2d', { alpha: false });
const slider = byId('progress');
const video = byId('camera');
const overlay = byId('handOverlay');
const handContext = overlay.getContext('2d', { alpha: false });
const hasVideoFrameCallback = typeof video.requestVideoFrameCallback === 'function';
const mobile = matchMedia('(max-width: 650px)').matches;
const rangeKey = 'daylily-pinch-range-v2';
const handEdges = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20],
];

let ready = false;
let current = 1;
let target = 1;
let lastFrame = -1;
let lastTick = performance.now();
let demoStart = null;
let manualUntil = 0;

let cameraSession = null;
let cameraEpoch=0;
let stream = null;
let worker = null;
let trackerLoad = null;
let cameraOn = false;
let inFlight = false;
let lastCapture = -Infinity;
let lastVideoTime = -1;
let videoFrameRequest = null;
let lastSeen = 0;
let rawRatio = null;
let pinchSamples = [];
let range = { ...defaultRange };
let calibrated = false;
let pendingClosed = null;
let calibrationTimer;


const originalCulture = document.querySelector('.culture-grid').innerHTML;
const sequences=new SequenceStore();
let themeIndex = 0;
const swipe = new PalmSwipe();
const handRoles = new HandRoles();
let navigationSide = 'Right';
try { navigationSide=localStorage.getItem('flower-navigation-side-v1')==='Left'?'Left':'Right'; } catch {}
let latestHands = [];


let activePinchSide = null;
let swipeNoticeUntil = 0;

function applyTheme(index) {
  themeIndex=index;
  flower.width=mobile?600:960;
  flower.height=mobile?450:720;
  flowerContext.imageSmoothingEnabled=true;
  flowerContext.imageSmoothingQuality='high';
  const t=themes[index];
  document.body.dataset.flower=t.key;
  const themeUrl=new URL(location.href);
  themeUrl.searchParams.set('flower',t.key);
  history.replaceState(history.state,'',themeUrl);
  // Keep palette state local to the animated gallery as well. Inherited custom
  // properties can otherwise remain cached on this animation boundary.
  document.querySelector('.gallery').dataset.flower=t.key;
  document.title='掌间花开——'+t.subtitle;
  document.querySelector('.location').textContent=t.location;
  document.querySelector('.introduction .eyebrow').innerHTML=t.name+' <span class="rule"></span> 数字艺术展';
  document.querySelector('.subtitle').textContent=t.subtitle;
  document.querySelector('.intro-copy').innerHTML=t.intro;
  document.querySelector('.specimen-number').textContent=String(index+1).padStart(2,'0');
  setText('flowerTitle',t.name);
  document.querySelector('.specimen-en').textContent=t.en;
  document.querySelectorAll('.specimen dd').forEach((n,i)=>n.textContent=t.profile[i]);
  document.querySelector('figcaption > span').textContent=t.caption;
  document.querySelector('figcaption a').href=t.video||t.folder+'original.mp4';
  document.querySelector('.gallery').setAttribute('aria-label',t.name+'互动展品');
  flower.setAttribute('aria-label','随手势或滑块开合的'+t.name);
  document.querySelector('.site-footer > span').textContent='掌间花开 · '+t.location;
  const poster=byId('poster');
  const posterFolder='assets/'+(t.key==='jasmine'?'display-v39':'display-v21')+'/'+t.key;
  const posterVersion=t.key==='panzhihua'?'?v=34':'';
  poster.querySelector('source').srcset=posterFolder+'/small/poster.webp'+posterVersion;
  poster.querySelector('img').src=posterFolder+'/hd/poster.webp'+posterVersion;
  poster.querySelector('img').alt=t.name+'盛放画面';
  poster.hidden=false;
  flower.style.opacity='0';
  document.querySelectorAll('.theme-tab').forEach(n=>n.setAttribute('aria-pressed',String(Number(n.dataset.theme)===index)));
  document.querySelector('#culture .culture-grid').innerHTML=t.key==='panzhihua'?panzhihuaCulture:t.key==='jasmine'?jasmineCulture:t.key==='lotus'?lotusCulture:t.key==='xinyi'?xinyiCulture:originalCulture;
  const cultureTitle=t.key==='panzhihua'?'从枝头到指尖':t.key==='lotus'?'从池间到指尖':t.key==='xinyi'?'从林间到指尖':'从田间到指尖';
  setText('cultureTitle',cultureTitle);
  document.querySelector('.more-sections a[href="#culture"]').textContent=cultureTitle;
  renderRecipes(t.key);
  renderOrigins(t.key);
  byId('cultureCredit').hidden=false;
  byId('cultureCredit').textContent=t.key==='daylily'?'花田与竹筛配图为 AI 场景示意；田间记忆依据家庭原照 AI 重绘。花卉动态取自原有互动素材。':'本栏场景配图为 AI 生成示意，非产地实拍；花卉动态取自原有互动素材。';
  setText('swipeStatus',swipeHint(index));
  byId('moreMenu').open=false;
}

const transition=new ThemeTransition({
  prepare:index=>sequences.prepare(themes[index].key),
  commit:(index,direction)=>{
    sequences.activate(themes[index].key);
    applyTheme(index);lastFrame=-1;render();
    const gallery=document.querySelector('.gallery');
    gallery.getAnimations().forEach(animation=>animation.cancel());
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)
      gallery.animate([{opacity:.65,transform:`translateX(${direction*20}px)`},{opacity:1,transform:'translateX(0)'}],{duration:180});
    swipeNoticeUntil=performance.now()+1600;
    setText('swipeStatus','已切换至'+themes[index].name);
  },
  onerror:()=>setText('swipeStatus','主题画面暂未载入，请再点击箭头重试。')
});
function switchTheme(index,direction=1) {
  index=wrapTheme(index);
  if(index===themeIndex&&transition.requested===index)return;
  swipeNoticeUntil=performance.now()+60000;
  setText('swipeStatus','正在准备'+themes[index].name+'…');
  return transition.select(index,direction);
}
byId('prevFlower').onclick=()=>switchTheme(transition.requested-1,-1);
byId('nextFlower').onclick=()=>switchTheme(transition.requested+1,1);
document.querySelectorAll('.theme-tab').forEach(n=>n.onclick=()=>switchTheme(Number(n.dataset.theme),Number(n.dataset.theme)>themeIndex?1:-1));
byId('originExplore').addEventListener('click',async event=>{
  const button=event.target.closest('button[data-origin]');
  if(!button)return;
  const key=button.dataset.origin;
  const index=themes.findIndex(theme=>theme.key===key);
  await switchTheme(index,index>themeIndex?1:-1);
  if(themes[themeIndex].key===key)byId('market').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
});
function saveRole(){
  try { localStorage.setItem('flower-navigation-side-v1', navigationSide); } catch {}
  handRoles.reset(); swipe.reset(); pinchSamples=[]; rawRatio=null; target=current;
  setText('roleStatus','已保存：左手切换，右手控制开合。');
}
byId('swapHands').onclick=()=>{ navigationSide=navigationSide==='Right'?'Left':'Right';saveRole();setMessage('左右手识别已交换。请用左手挥掌、右手双指体验。'); };
byId('roleCalibrate').onclick=()=>{byId('roleGuide').hidden=!byId('roleGuide').hidden;};
byId('recordLeft').onclick=()=>{
  if(!cameraOn || latestHands.length!==1 || performance.now()-lastCapture>500 || latestHands[0].score<.75){setText('roleStatus','请开启摄像头，只让左手完整入镜并稍停，再点击记录。');return;}
  navigationSide=latestHands[0].side;saveRole();
};
document.addEventListener('click',e=>{if(!byId('moreMenu').contains(e.target))byId('moreMenu').open=false;});
byId('moreMenu').addEventListener('click',event=>{if(event.target.closest('a'))byId('moreMenu').open=false;});
document.addEventListener('keydown',e=>{if(e.key==='Escape')byId('moreMenu').open=false;});
renderRecipes('daylily');
renderOrigins('daylily');
setText('swipeStatus',swipeHint(0));
document.addEventListener('keydown',e=>{
  if(e.target.closest('input,button,textarea,select,[contenteditable]')) return;
  if(e.key==='ArrowLeft'||e.key==='ArrowRight') { e.preventDefault(); const d=e.key==='ArrowLeft'?-1:1; switchTheme(themeIndex+d,d); }
});

function setText(id, value) {
  const node = byId(id);
  if (node.textContent !== value) node.textContent = value;
}

function setMessage(text, error = false) {
  setText('message', text);
  byId('message').classList.toggle('error', error);
}

function setCameraUI(state, label, icon) {
  setText('cameraState', state);
  setText('cameraBtnLabel', label);
  setText('cameraBtnIcon', icon);
}

try {
  const saved = JSON.parse(localStorage.getItem(rangeKey));
  if (Number.isFinite(saved?.closed) && Number.isFinite(saved?.open) && saved.open - saved.closed >= 0.25) {
    range = saved;
    calibrated = true;
    setText('calibrationStatus', '正在使用上次记录的手势范围。');
  }
} catch {}

function render() {
  const index = frameForTheme(themeIndex,current);
  const drawable=sequences.frame(themes[themeIndex].key,index);
  if(drawable){
    const stamp=themeIndex+':'+drawable.frame+':'+drawable.quality;
    if(stamp!==lastFrame){
      // Every sequence has a fixed 4:3 composition; no animated zoom or crop.
      const sourceWidth=drawable.bitmap.height*flower.width/flower.height;
      const sourceX=(drawable.bitmap.width-sourceWidth)/2;
      const crop=[sourceX,0,sourceWidth,drawable.bitmap.height];
      flowerContext.drawImage(drawable.bitmap,...crop,0,0,flower.width,flower.height);
      lastFrame=stamp;
    }
    flower.style.opacity='1';byId('poster').hidden=true;
    flower.dataset.renderedFrame=String(drawable.frame);
    flower.dataset.renderedTheme=themes[themeIndex].key;
    flower.dataset.renderedWidth=String(drawable.bitmap.width);
  }
  byId('loading').hidden=!!drawable;
  byId('loading').setAttribute('aria-busy',String(!drawable));
  const percent = Math.round(current * 100);
  if (document.activeElement !== slider || performance.now() >= manualUntil) {
    slider.value = percent;
  }
  setText('percent', percent + '%');
  setText('stateName', percent === 0 ? '含苞' : percent === 100 ? '盛开' : '舒展中');
  const difference = target - current;
  setText('motionStatus', difference > .003 ? '花朵绽放' : difference < -.003 ? '花朵收拢' : '保持当前状态');
}

async function loadFrames() {
  flower.width = mobile ? 600 : 960;
  flower.height = mobile ? 450 : 720;
  flowerContext.imageSmoothingEnabled=true;
  flowerContext.imageSmoothingQuality='high';
  // Load and decode the complete HD sequence before enabling gesture/manual control.
  try {
    const initialIndex=initialTheme(location.search,location.hash);
    await transition.select(initialIndex);
    if(!sequences.frame(themes[themeIndex].key,0))throw new Error('Sequence unavailable');
    ready=true;render();
    for(const id of ['progress','demoBtn','cameraBtn'])byId(id).disabled=false;
    if(!cameraSession)setMessage('可开启手势体验，也可以先拖动滑块。');
    scheduleTrackerWarmup();
    // Other themes load only on navigation intent, avoiding a four-pack burst.

    if(['#origins','#culture','#kitchen','#market','#about'].includes(location.hash))byId(location.hash.slice(1)).scrollIntoView();
  } catch {
    byId('loading').textContent='花朵画面载入失败，请刷新后重试。';
    setMessage('请检查网络后刷新页面。',true);
  }
}

function stopDemo() {
  demoStart = null;
  setText('demoBtn', '▷ 自动演示');
  if (!cameraSession) setText('mode', '手动体验');
}

slider.oninput = () => {
  stopDemo();
  target = Number(slider.value) / 100;
  current = target;
  render();
  manualUntil = performance.now() + 1600;
  setMessage(cameraOn ? '手动调整中，稍后恢复手势控制。' : '滑块可停在任意位置，观察花瓣的变化。');
};

byId('demoBtn').onclick = () => {
  if (demoStart !== null) {
    stopDemo();
    target = current;
    setMessage('演示已暂停，可拖动滑块继续。');
    return;
  }
  if (cameraSession) stopCamera();
  demoStart = performance.now() - Math.acos(1 - 2 * current) * 4500 / Math.PI;
  setText('demoBtn', 'Ⅱ 暂停演示');
  setText('mode', '自动演示');
  setMessage('自动演示中，拖动滑块可随时接管。');
};

function showCalibration(visible) {
  byId('calibration').hidden = !visible;
  byId('calibrateBtn').setAttribute('aria-expanded', String(visible));
}

function storeRange() {
  try {
    if (calibrated) localStorage.setItem(rangeKey, JSON.stringify(range));
    else localStorage.removeItem(rangeKey);
  } catch {}
}

function recordPose(kind) {
  clearTimeout(calibrationTimer);
  if (!cameraOn) return;
  if (kind === 'closed') byId('setOpen').disabled = true;
  setText('calibrationStatus', kind === 'closed' ? '两秒后记录，请捏紧并稍停。' : '两秒后记录，请张到最大并稍停。');
  calibrationTimer = setTimeout(() => {
    if (rawRatio === null || performance.now() - lastSeen > 250 || pinchSamples.length < 3) {
      setText('calibrationStatus', '未稳定识别到手，请让整只手入镜后重试。');
      return;
    }
    if (kind === 'closed') {
      pendingClosed = rawRatio;
      byId('setOpen').disabled = false;
      setText('calibrationStatus', '已记录 0% 的位置。请继续记录最宽位置。');
    } else if (pendingClosed!==null && calibratedRange(pendingClosed, rawRatio)) {
      range = {...calibratedRange(pendingClosed, rawRatio), closedMeasured:true};
      calibrated = true;
      pendingClosed = null;
      byId('setOpen').disabled = true;
      storeRange();
      setText('calibrationStatus', '已保存。张到刚才的位置即可达到 100%，往回收时花瓣会跟随。');
    } else {
      setText('calibrationStatus', '请再分开一点，然后重新记录最宽位置。');
    }
  }, 2000);
}

byId('calibrateBtn').onclick = () => showCalibration(byId('calibration').hidden);
byId('setClosed').onclick = () => recordPose('closed');
byId('setOpen').onclick = () => recordPose('open');
byId('quickClosed').onclick = () => {
  const recorded=rangeWithClosed(range,rawRatio,calibrated);
  if(!cameraOn||performance.now()-lastSeen>250||pinchSamples.length<3||!recorded)return;
  clearTimeout(calibrationTimer);pendingClosed=null;byId('setOpen').disabled=true;
  range=recorded;calibrated=true;storeRange();target=current=0;manualUntil=0;render();
  setText('calibrationStatus','已记录当前合拢位置为0%，满开位置保持不变。');
  setMessage('合拢位置已保存。双指合拢到这里即可回到花苞，张开时连续绽放。');
};
byId('quickOpen').onclick = () => {
  const recorded=calibratedRange(range.closed,rawRatio);
  if(!cameraOn||performance.now()-lastSeen>250||pinchSamples.length<3||!recorded){
    setMessage('请让右手完整入镜，自然张开拇指与食指后再记录。');
    return;
  }
  clearTimeout(calibrationTimer);
  pendingClosed=null;
  byId('setOpen').disabled=true;
  range={...recorded, closedMeasured:range.closedMeasured===true};
  calibrated=true;
  storeRange();
  target=current=1;
  manualUntil=0;
  render();
  setText('calibrationStatus','已将当前拇指与食指的距离记为100%，收拢时按新范围连续变化。');
  setMessage('满开位置已保存。以后张到这里就是100%，轻轻收拢即可合花。');
};
byId('resetCalibration').onclick = () => {
  clearTimeout(calibrationTimer);
  pendingClosed = null;
  calibrated = false;
  range = { ...defaultRange };
  byId('setOpen').disabled = true;
  storeRange();
  setText('calibrationStatus', '默认范围已恢复。');
};

function drawCameraPreview(bitmap, hands) {
  const { width, height } = bitmap;
  if (overlay.width !== width || overlay.height !== height) {
    overlay.width = width;
    overlay.height = height;
    byId('cameraCard').style.setProperty('--camera-ratio', width + ' / ' + height);
  }
  // Paint the same camera frame that produced these landmarks.
  handContext.drawImage(bitmap, 0, 0);
  overlay.hidden = false;
  for (const {landmarks} of hands) {

  handContext.beginPath();
  for (const [start, end] of handEdges) {
    handContext.moveTo(landmarks[start].x * width, landmarks[start].y * height);
    handContext.lineTo(landmarks[end].x * width, landmarks[end].y * height);
  }
  handContext.lineWidth = 3;
  handContext.strokeStyle = '#95e388';
  handContext.stroke();
  for (const [index, point] of landmarks.entries()) {
    const tip = index === 4 || index === 8;
    handContext.beginPath();
    handContext.arc(point.x * width, point.y * height, tip ? 6 : 3.5, 0, 2 * Math.PI);
    handContext.fillStyle = tip ? '#ffe595' : '#c8f8a6';
    handContext.fill();
  }
  }
}

function updateHandUI(found) {
  byId('quickClosed').disabled=!cameraOn||!found||pinchSamples.length<3||!rangeWithClosed(range,rawRatio,calibrated);
  byId('quickOpen').disabled=!cameraOn||!found||pinchSamples.length<3||!calibratedRange(range.closed,rawRatio);
  byId('statusDot').classList.toggle('active', found);
  setText('handStatus', found ? '已识别手部' : '等待识别');
  setText('trackingLabel', found ? '右手开合 · 左手切换' : '请将整只手放入画面');
  setText('mode', found ? '手势已连接' : cameraOn ? '等待手势' : '手动体验');
  setText('pinchValue', found ? rawRatio.toFixed(2) + '×' : '—');
}

function handleTracking({ data }) {
  if(data.type==='result'&&data.session!==cameraEpoch){data.bitmap?.close();return;}
  inFlight = false;
  if (data.type === 'error') {
    cameraFailure('手部识别暂时不可用，请重新开启或拖动滑块。');
    return;
  }
  if (data.type !== 'result') return;

  if (!cameraOn) { data.bitmap?.close(); return; }
  const now = performance.now();
  const hands = (data.hands || []).filter(h=>h.landmarks?.length===21);
  latestHands=hands;
  const assignedHands=handRoles.update(hands,now);
  // MediaPipe handedness assumes selfie mirroring; inference receives raw camera frames.
  const navigationHand = assignedHands.find(h=>h.side===navigationSide);
  const pinchHand = assignedHands.find(h=>h.side!==navigationSide);
  const direction = swipe.update(navigationHand?.landmarks, now, data.bitmap.width/data.bitmap.height);
  if(direction) switchTheme(themeIndex + direction, direction);
  if(now>swipeNoticeUntil) setText('swipeStatus',(navigationHand?'左手已识别 · ':'')+swipeHint(themeIndex));
  const landmarks=pinchHand?.landmarks;
  if(pinchHand?.side!==activePinchSide) { pinchSamples=[]; activePinchSide=pinchHand?.side; }

  const { bitmap } = data;
  try {
    drawCameraPreview(bitmap, hands);
  } finally {
    bitmap.close();
  }
  if (!landmarks) {
    if(now> manualUntil) target=current;
    if (now - lastSeen > 120) {
      if (rawRatio !== null && now > manualUntil) target = current;
      rawRatio = null;
      pinchSamples = [];
      updateHandUI(false);
      if (navigationHand) { setText('handStatus','已识别左手'); setText('trackingLabel','左手切换 · 等待右手'); }
      if (now > manualUntil) setMessage('请将右手放入镜头，用拇指与食指控制开合；左手张掌可切换花卉。');
    }
    return;
  }

  if (now - lastSeen > 250) pinchSamples = [];
  lastSeen = now;
  pinchSamples.push(pinchRatio(landmarks, overlay.width / overlay.height));
  if (pinchSamples.length > 3) pinchSamples.shift();
  rawRatio = median(pinchSamples);
  if (now > manualUntil) {
    target = stableProgress(target, gestureProgress(rawRatio, range, calibrated));
    setMessage('用右手拇指与食指控制。若张开后未满，可点“将当前张开设为100%”。');
  }
  updateHandUI(true);
  setText('trackingLabel', navigationHand ? '双手已识别 · 各 21 点' : '右手已识别 · 21 点');
}

function stopCamera() {
  cameraSession?.abort();
  cameraSession = null;
  cameraEpoch++;
  cameraOn = false;
  swipe.reset(); handRoles.reset(); latestHands=[];
  if (videoFrameRequest !== null) video.cancelVideoFrameCallback(videoFrameRequest);
  videoFrameRequest = null;
  overlay.hidden = true;
  stream?.getTracks().forEach(track => track.stop());
  stream = null;
  video.srcObject = null;
  // Keep the initialized model warm for a quick camera restart.
  inFlight = false;
  rawRatio = null;
  pinchSamples = [];
  target = current;
  byId('cameraCard').hidden = true;
  byId('calibrateBtn').disabled = true;
  showCalibration(false);
  clearTimeout(calibrationTimer);
  pendingClosed = null;
  byId('setOpen').disabled = true;
  updateHandUI(false);
  setCameraUI('已关闭', '开启手势体验', '↗');
  setMessage('摄像头已关闭，仍可拖动滑块体验。');
}

function cameraFailure(message, state = '暂不可用') {
  stopCamera();
  releaseTracker();
  setText('cameraState', state);
  setMessage(message, true);
}

function prepareTracker(tracker, signal, delegate='CPU') {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => finish(new Error('MODEL_TIMEOUT')), 45000);
    const cancel = () => finish(signal.reason);
    const finish = error => {
      clearTimeout(timeout);
      signal.removeEventListener('abort', cancel);
      tracker.onmessage = null;
      tracker.onerror = null;
      if (error) reject(error);
      else resolve();
    };
    signal.addEventListener('abort', cancel, { once: true });
    tracker.onerror = () => finish(new Error('MODEL_ERROR'));
    tracker.onmessage = ({ data }) => {
      if (data.type === 'ready') finish();
      if (data.type === 'error') finish(new Error(data.message || 'MODEL_ERROR'));
    };
    try {
      tracker.postMessage({ type: 'init', delegate });
    } catch (error) {
      finish(error);
    }
  });
}

function releaseTracker() {
  trackerLoad?.controller.abort();
  trackerLoad = null;
  worker?.terminate();
  worker = null;
}

function getTracker() {
  if (trackerLoad) return trackerLoad.promise;
  const gl=document.createElement('canvas').getContext('webgl2');
  if(!gl)throw new Error('WEBGL');
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  const controller=new AbortController();
  const load={controller,promise:null};
  trackerLoad=load;
  byId('cameraBtn').dataset.trackerState='loading';
  load.promise=(async()=>{
    for(const delegate of ['CPU']){
      if(controller.signal.aborted)throw controller.signal.reason;
      const candidate=new Worker(new URL('./hand-worker.js?v=46',import.meta.url));
      worker=candidate;
      try{
        await prepareTracker(candidate,controller.signal,delegate);
        if(controller.signal.aborted)throw controller.signal.reason;
        byId('cameraBtn').dataset.trackerState='ready';
        candidate.onmessage=handleTracking;
        return;
      }catch(error){
        candidate.terminate();
        if(controller.signal.aborted||delegate==='CPU')throw error;
      }
    }
  })();
  load.promise.catch(()=>{if(trackerLoad===load&&!cameraSession)releaseTracker();});
  return load.promise;
}

function scheduleTrackerWarmup() {
  const network = navigator.connection;
  if (network?.saveData) return;
  const warm = () => {
    if (document.hidden || cameraSession || trackerLoad || !navigator.mediaDevices?.getUserMedia) return;
    try { getTracker().catch(()=>{}); } catch {}
  };
  setTimeout(warm, 100);
}

async function connectVideo(session) {
  const media = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 640, max: 640 }, height: { ideal: 480, max: 480 }, frameRate: {ideal:30,max:60}, facingMode: 'user' }, audio: false,
  });
  if (session.signal.aborted) {
    media.getTracks().forEach(track => track.stop());
    return;
  }
  stream = media;
  video.srcObject = media;
  for (const track of media.getVideoTracks()) {
    track.addEventListener('ended', () => {
      if (!session.signal.aborted) cameraFailure('摄像头连接已中断。可重新开启，或拖动滑块。');
    }, { once: true });
  }
  await video.play();
  if (session.signal.aborted) return;

  overlay.width = video.videoWidth;
  overlay.height = video.videoHeight;
  byId('cameraCard').style.setProperty('--camera-ratio', video.videoWidth + ' / ' + video.videoHeight);
  byId('cameraCard').hidden = false;
  setCameraUI('正在启动识别', '关闭摄像头', '×');
  setText('trackingLabel', '正在准备手部识别');
  setMessage('摄像头已连接，正在准备手部识别。');
}

async function startCamera() {
  stopDemo();
  const session = new AbortController();
  cameraSession = session;
  cameraEpoch++;
  setCameraUI('等待授权', '取消开启', '×');
  setMessage('请在浏览器提示中允许访问摄像头。');

  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('SECURE');
    // Start both tasks together when the tracker hasn't been warmed up yet.
    const trackerReady = getTracker();
    await Promise.all([trackerReady, connectVideo(session)]);
    if (session.signal.aborted) return;
    cameraOn = true;
    lastSeen = performance.now();
    lastCapture = -Infinity;
    lastVideoTime = -1;
    manualUntil = 0;
    updateHandUI(false);
    setCameraUI('已开启', '关闭摄像头', '×');
    byId('calibrateBtn').disabled = false;
    setMessage('右手拇指与食指控制开合；左手张掌，向自己的左侧平移进入下一主题，向右返回上一主题。');
    worker.onerror = () => cameraFailure('手部识别遇到问题，请重新开启。滑块仍可使用。');
    worker.onmessage = handleTracking;
    startFrameCapture(session);
  } catch (error) {
    if (session.signal.aborted) return;
    const messages = {
      NotAllowedError: '摄像头权限未开启。可拖动滑块，或在浏览器地址栏允许权限后重试。',
      NotFoundError: '未找到摄像头。可连接摄像头后重试，或拖动滑块。',
      NotReadableError: '摄像头可能被其他程序占用。关闭其他摄像头应用后可重试。',
      SECURE: '请在独立的 HTTPS 页面打开手势体验。滑块仍可使用。',
      MODEL_TIMEOUT: '识别模型加载超时，请检查网络后重试。',
      WEBGL: '当前浏览器无法使用 WebGL 2。可拖动滑块，或在 Chrome / Edge 开启图形加速后重试。',
    };
    cameraFailure(messages[error.name] || messages[error.message] || '手势识别启动失败，可重新开启或拖动滑块。', error.name === 'NotAllowedError' ? '权限未开启' : '暂不可用');
  }
}

byId('cameraBtn').onclick = () => cameraSession ? stopCamera() : startCamera();

function startFrameCapture(session) {
  capture(performance.now());
  if (!hasVideoFrameCallback) return;
  const onVideoFrame = (time, metadata) => {
    if (session.signal.aborted) return;
    videoFrameRequest = video.requestVideoFrameCallback(onVideoFrame);
    capture(time, metadata.mediaTime);
  };
  videoFrameRequest = video.requestVideoFrameCallback(onVideoFrame);
}

async function capture(time, videoTime = video.currentTime) {
  // A single in-flight frame bounds latency when the inference takes longer.
  // The small timing margin allows each frame from a 30fps camera through.
  if (!cameraOn || inFlight || video.readyState < 2 || time - lastCapture < 16) return;
  if (videoTime === lastVideoTime) return;
  lastCapture = time;
  lastVideoTime = videoTime;
  inFlight = true;
  const tracker = worker;
  const session=cameraEpoch;
  try {
    const bitmap = await createImageBitmap(video);
    if (!cameraOn || worker !== tracker || session!==cameraEpoch) {
      bitmap.close();
      return;
    }
    tracker.postMessage({ type: 'frame', bitmap, time, session }, [bitmap]);
  } catch {
    if (worker === tracker) inFlight = false;
  }
}

function tick(time) {
  const seconds = (time - lastTick) / 1000;
  lastTick = time;
  if (ready) {
    if (demoStart !== null) target = (1 - Math.cos((time - demoStart) / 4500 * Math.PI)) / 2;
    current = smooth(current, target, seconds, cameraOn && time > manualUntil ? 2.8 : Infinity);
    if (Math.abs(current - target) < .0005) current = target;
    render();
    if (!hasVideoFrameCallback && !document.hidden) capture(time);
  }
  requestAnimationFrame(tick);
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    if (ready) scheduleTrackerWarmup();
    return;
  }
  if (cameraSession) {
    stopCamera();
    releaseTracker();
    setMessage('页面切到后台，摄像头已自动关闭。');
  } else {
    releaseTracker();
  }
});
window.addEventListener('pagehide', () => {
  if (cameraSession) stopCamera();
  releaseTracker();sequences.dispose();
});
// Prepare only the flower the visitor points at; never compete for bandwidth
// with four unrelated animations while the camera model is starting.
for(const button of document.querySelectorAll('.theme-tab,#prevFlower,#nextFlower')){
 const warm=()=>{if(navigator.connection?.saveData||!ready)return;const index=button.dataset.theme!==undefined?Number(button.dataset.theme):wrapTheme(transition.requested+(button.id==='nextFlower'?1:-1));sequences.prefetch(themes[index].key).catch(()=>{});};
 button.addEventListener('pointerenter',warm);button.addEventListener('focus',warm);
}
byId('cameraBtn').addEventListener('pointerenter',scheduleTrackerWarmup);
byId('cameraBtn').addEventListener('focus',scheduleTrackerWarmup);
applyTheme(initialTheme(location.search,location.hash));
loadFrames();
requestAnimationFrame(tick);

window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
