// Keep previously shared section links working after introducing the homepage.
const params=new URLSearchParams(location.search);
const keys=['daylily','xinyi','lotus','jasmine','panzhihua'];
if(keys.includes(params.get('flower'))&&['#origins','#culture','#kitchen','#market','#about','#home'].includes(location.hash)){
 location.replace('flower.html?flower='+params.get('flower')+location.hash);
}
const entries={
 daylily:{story:'一筛黄花，<br>留下土地的味道。',text:'从采摘、蒸制到摊晾，认识渠县黄花的传统手艺，以及花田与农户日常的联系。',taste:'黄花入馔 · 家常有味',dish:'黄花木耳炒蛋',image:'daylily-eggs',tasteText:'在一碗汤、一盘家常菜里，遇见熟悉的金色滋味。',market:'从渠县干黄花出发，了解本地产品、生产企业与已核对的渠道资料。'},
 xinyi:{story:'一山辛夷，<br>一代代人的春信。',text:'走进江油吴家后山，认识传统栽培、林下生计与人与花木相伴的山乡生活。',taste:'辛夷花食 · 山野春味',dish:'辛夷花馍',image:'xinyi-buns-v21',tasteText:'认识当地花食与家常做法，并分清食用花瓣、药用花蕾的不同用途。',market:'认识江油辛夷的产地产业与相关经营主体，区分药用资源与食用产品。'},
 lotus:{story:'一池荷韵，<br>生长乡村的日常。',text:'走进中江南山村，了解荷塘景观、莲藕与莲子，以及农业与乡村旅游的联系。',taste:'荷塘风味 · 一席清鲜',dish:'清炒藕片',image:'lotus-root',tasteText:'从鲜藕、莲子到食用荷叶，寻找一池荷的日常风味。',market:'从中江莲产业出发，认识鲜藕、莲子及加工产品，查看真实产地与合作社资料。'},
 jasmine:{story:'一朵花的香，<br>一杯茶的来处。',text:'从犍为清溪的花田走向茶坊，了解花茶制作技艺与花农、制茶人的日常。',taste:'茉香茶食 · 清芬入味',dish:'茉莉鲜花酥',image:'jasmine-pastry',tasteText:'以茉莉花茶和食用花馅为媒，探索茶点、蒸菜与清饮。',market:'认识犍为茉莉花茶与本地制茶企业，从产地与加工的故事了解花香的价值。'},
 panzhihua:{story:'一树红棉，<br>一座花城的记忆。',text:'沿金沙江畔认识木棉，读懂花城记忆、古树保护与花下乡村的生活。',taste:'红棉入馔 · 花城春味',dish:'木棉花蕊炒腊肉',image:'panzhihua-bacon',tasteText:'从花蕊入菜到家常慢炖，认识攀枝花的春日食俗。',market:'了解木棉花蕊的地方食材用途与产地体验，走近花城的日常经营与乡村风景。'}
};
const tabs=[...document.querySelectorAll('[role="tab"]')];
function select(key){
 const d=entries[key];if(!d)return;
 tabs.forEach(t=>{const active=t.dataset.flower===key;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
 document.getElementById('discoveryPanel').setAttribute('aria-labelledby','tab-'+key);
 document.getElementById('storyTitle').innerHTML=d.story;
 document.getElementById('storyText').textContent=d.text;
 document.getElementById('tasteTitle').textContent=d.taste;
 document.getElementById('tasteText').textContent=d.tasteText;
 document.getElementById('marketText').textContent=d.market;
 const img=document.getElementById('tasteImage');img.src='assets/recipes/'+d.image+'.webp';img.alt=d.dish;
 for(const [id,hash] of [['storyLink','origins'],['tasteLink','kitchen'],['marketLink','market']])document.getElementById(id).href='flower.html?flower='+key+'#'+hash;
}
tabs.forEach((t,index)=>{
 t.addEventListener('click',()=>select(t.dataset.flower));
 t.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;else if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();select(tabs[next].dataset.flower);tabs[next].focus();});
});
const menu=document.querySelector('.home-more');
document.addEventListener('click',e=>{if(!menu.contains(e.target))menu.open=false;});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.open=false));

import './home-gesture.js?v=50';

// A hovered/focused flower card hints the next destination; cache its original
// HD sequence so entering the exhibition can reuse the download.
import { cachedAsset } from './asset-cache.js?v=46';
import { sequenceURL } from './sequence-store.js?v=46';
const hinted=new Set();
for(const link of document.querySelectorAll('.flower-gate')){
 const warm=()=>{if(navigator.connection?.saveData)return;const key=new URL(link.href).searchParams.get('flower');if(!keys.includes(key)||hinted.has(key))return;hinted.add(key);cachedAsset(sequenceURL(key)).then(r=>r.arrayBuffer()).catch(()=>hinted.delete(key));};
 link.addEventListener('pointerenter',warm);link.addEventListener('focus',warm);
}
