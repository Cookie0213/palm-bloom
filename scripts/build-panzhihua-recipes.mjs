import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {panzhihuaRecipes} from '../dist/panzhihua-recipes.js';

const foodSource={label:'食俗依据：四川在线 · 把市花做成菜',url:'https://sichuan.scol.com.cn/ggxw/202603/83221458.html'};
const oilSource={label:'食俗依据：川观新闻 · 攀枝花炒油底肉',url:'https://cbgc.scol.com.cn/news/3992861?app_id=cbgc&from=androidapp'};
const preparation='选用来源可追溯、明确供食用的木棉花蕊。若仍带花萼、花瓣或硬芯，应去除后清洗；干制花蕊按包装说明泡发。鲜花蕊与泡发后的干花蕊都先焯水、漂洗并沥干，再入菜。';
const sharedNote='本页依据地方食俗整理为家常做法参考，非官方标准配方。按食材包装说明处理并充分做熟；不采食道路绿化花、来源不明或霉变落花。';
const details={
 'panzhihua-salad':{
  ingredients:['处理并充分煮熟的木棉花蕊约 180 克','正规包装即食水豆豉 25—30 克','蒜 1 瓣，小米椒、香菜少量','生抽、醋、香油各少量'],
  steps:[preparation+'凉拌用的花蕊须充分煮熟，沥干后放入洁净容器冷却。','蒜、小米椒、香菜洗净切碎。取水豆豉与少量生抽、醋调匀；非即食豆豉须先按包装要求加热。','将调味汁拌入熟花蕊，最后加香菜与少量香油。','水豆豉已有咸味，尝后再决定是否补盐。现拌现吃，不长时间常温放置。'],
  portion:'2 人份', reference:foodSource
 },
 'panzhihua-bacon':{
  ingredients:['处理好的木棉花蕊约 200 克','腊肉约 120 克','蒜 2 瓣，姜 2 片，青椒半个','食用油、生抽少量'],
  steps:[preparation+'腊肉清洗后按产品要求先蒸或煮熟，再切薄片。','锅内放少量油，下腊肉小火煸香，再加姜、蒜和青椒翻炒。','加入花蕊炒匀；若偏干可补少量热水，炒至所有食材熟透。','根据腊肉的咸度少量调味，盛盘趁热食用。'],
  portion:'2—3 人份', reference:foodSource
 },
 'panzhihua-chicken':{
  ingredients:['鸡块约 500 克','处理好的木棉花蕊 100—150 克','姜 3 片，清水约 1.2 升','盐适量'],
  steps:[preparation+'鸡块清洗后冷水入锅，煮出浮沫，捞起冲净。','鸡块、姜与清水入炖锅，煮沸后转小火，炖至鸡肉软熟。普通锅可参考约 40—60 分钟，按鸡肉大小、老嫩及锅具调整。','加入已焯过的花蕊，继续煮至花蕊软熟、鸡肉最厚处完全熟透。','按口味少量加盐，盛入汤碗，放至适口温度后食用。'],
  portion:'3—4 人份', reference:oilSource
 },
 'panzhihua-youdirou':{
  ingredients:['处理好的木棉花蕊约 200 克','正规渠道购买的油底肉约 120 克','蒜 2 瓣，青椒半个，姜葱少量','食用油、盐少量（按实际需要）'],
  steps:[preparation+'油底肉按商品说明处理后切小片；可取少量随附油脂用于炒菜。','锅内取少量油脂，下肉片煸香，再加入姜蒜与青椒翻炒。','放入花蕊翻炒；必要时补少量热水，炒至所有食材充分熟透。','依据油底肉的咸味酌情调盐，撒葱后出锅。油底肉按商品标示保存，不自行长期常温油封储存。'],
  portion:'2—3 人份', reference:oilSource
 }
};
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
// Use the same recipe-page styles and 4:3 image dimensions as the other flowers.
const existing=await readFile(new URL('../dist/recipes/daylily-eggs.html',import.meta.url),'utf8');
const styles=existing.match(/<style>([\s\S]*?)<\/style>/)[1];
await mkdir(new URL('../dist/recipes/',import.meta.url),{recursive:true});
for(const recipe of panzhihuaRecipes){
 const {ingredients,steps,portion,reference}=details[recipe.image];
 const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${recipe.title}｜掌间花开</title><meta name="description" content="${recipe.text}"><link rel="stylesheet" href="../style.css?v=33"><style>${styles}</style></head><body data-flower="panzhihua"><main class="recipe-shell"><nav class="recipe-nav" aria-label="食谱导航"><a class="brand" href="../">掌间花开</a><a href="../flower.html?flower=panzhihua#kitchen">返回攀枝花木棉 · 把花开端上餐桌</a></nav><header class="recipe-hero"><img src="../assets/recipes/${recipe.image}.webp" width="1000" height="750" alt="${recipe.title}做法示意图"><div><p class="eyebrow">BLOOM TO TABLE</p><h1>${recipe.title}</h1><p>${recipe.text}</p><p class="recipe-part">${recipe.part} · ${portion} · 家常做法参考</p></div></header><div class="recipe-body"><section aria-labelledby="ingredients"><h2 id="ingredients">准备食材</h2><ul>${ingredients.map(i=>`<li>${escape(i)}</li>`).join('')}</ul></section><section aria-labelledby="steps"><h2 id="steps">制作步骤</h2><ol>${steps.map(i=>`<li>${escape(i)}</li>`).join('')}</ol></section></div><p class="recipe-note">${sharedNote} 用量可按人数与口味调整。</p><p class="recipe-reference"><a href="${escape(reference.url)}" target="_blank" rel="noopener noreferrer">${escape(reference.label)}</a></p></main></body></html>`;
 await writeFile(new URL('../dist/'+recipe.source,import.meta.url),html);
}
console.log('Built four matching Panzhihua recipe pages.');
