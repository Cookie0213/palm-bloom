import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {jasmineRecipes} from '../dist/jasmine-recipes.js';

const details={
 'jasmine-pastry':{
  ingredients:['成品酥皮约 240 克（8 小份）','已加工、标明食品用途的茉莉花馅料约 80—100 克','蛋液少许（刷表面，可不加）'],
  steps:['按包装说明处理酥皮。检查馅料的品名、用途、保存条件与保质期，使用可直接用于烘焙的食用茉莉花馅。','将酥皮分成 8 份，每份放约 10—12 克馅料，收口捏紧，轻轻整理成圆形；不塞得过满，以免烤制时爆口。','收口朝下放在铺好烘焙纸的烤盘上，间隔摆放。喜欢金黄色表皮可薄刷一层蛋液。','按酥皮包装建议预热和烘烤；普通小份酥皮点心可参考约 190℃、20—25 分钟，并按实际大小和烤箱调整，烤至外皮金黄、层次熟透。稍放凉后食用。'],
  note:'犍为已有鲜花饼产品报道。本页以现成酥皮与食用馅料整理家常简化做法，不代表当地企业配方；没有可靠食用馅料时，不用观赏茉莉或自采鲜花代替。',
  reference:{label:'产地产品依据：人民网 · 小茉莉撬动大产业',url:'https://cpc.people.com.cn/n1/2023/0912/c166757-40075991.html'}
 },
 'jasmine-fish':{
  ingredients:['处理干净的鲈鱼 1 条，约 500—600 克','正规成品茉莉花茶约 2—3 克，冲泡后取过滤茶汤约 100 毫升','姜丝、葱丝适量','食用油、盐及少量蒸鱼豉油（按口味）'],
  steps:['鱼去鳞、鳃及内脏，清洗后沥干，在两面厚肉处划浅刀。生鱼与熟食分别使用清洁刀具、砧板。','按花茶包装说明冲泡并过滤，取约 100 毫升清淡茶汤。盘底垫姜葱，放鱼，撒少量盐，淋入茶汤。','蒸锅水开后放入鱼盘，加盖蒸制；500—600 克的鱼可从约 12—15 分钟开始检查，按鱼身厚度延长，至最厚处鱼肉完全熟透、不透明且容易分离。','倒去部分蒸汁，放上新鲜姜葱丝，按口味加入少量蒸鱼豉油与热油，趁热食用。不在成菜上添加来源不明的鲜花。'],
  note:'参考茉莉花茶“香片蒸鱼”的入菜方式整理为家庭做法，并非犍为独有传统菜。使用正规成品花茶，不以观赏花代替；鱼类过敏者不食用。',
  reference:{label:'做法灵感：茶业改良场 · 香片蒸鱼',url:'https://tcmb.culture.tw/zh-tw/detail?id=560360&indexCode=Culture_Object'}
 },
 'jasmine-tea':{
  ingredients:['正规渠道购买的犍为茉莉花茶适量','饮用水约 300 毫升（以包装建议的茶水比例为准）'],
  steps:['准备干净的茶杯或茶壶。取适量成品茉莉花茶，先阅读包装上的茶水比例、水温与浸泡时间。','将饮用水烧开，按产品指引调整水温后注入茶具。','按包装建议的时间浸泡；喜欢清淡口感可适当缩短浸泡时间。','滤出茶汤，放至适口温度后品饮；后续冲泡仍按产品说明操作。']
 },
 'jasmine-milk':{
  ingredients:['按包装说明泡好并过滤的茉莉花茶茶汤 150 毫升','巴氏杀菌乳或灭菌乳 150 毫升','少量糖（可选）'],
  steps:['用正规渠道的成品茉莉花茶，按包装说明冲泡并滤去茶叶，量取 150 毫升茶汤。','鲜奶按包装储存及饮用要求处理。做热饮时可轻轻加热至温热，不必长时间煮沸。','将茶汤和鲜奶混合搅匀。喜欢茶味更明显可增加茶汤比例，喜欢柔和口感可增加奶量。','按个人口味加入少量糖，搅匀后饮用。冷饮版本应及时冷藏并尽快饮用。']
 },
 'jasmine-jelly':{
  ingredients:['按包装说明泡好并过滤的茉莉花茶茶汤 300 毫升','食品级琼脂粉：按其包装注明的液体配比取量','少量糖（可选）'],
  steps:['冲泡成品茉莉花茶，过滤茶叶并量取 300 毫升茶汤；提前准备干净耐热的浅容器。','根据所用琼脂粉包装的液体配比称量。按说明要求与茶汤混合、加热并搅拌至完全溶解。','按口味加入少量糖，搅匀后倒入浅容器，尽快冷却。','待凝固后冷藏，食用前切成小块。成品密封冷藏并尽快食用；配比与凝固时间以所用产品说明为准。']
 },
 'jasmine-lemon':{
  ingredients:['按包装说明泡好并过滤的茉莉花茶茶汤 300 毫升','新鲜柠檬 2—3 片','少量糖、食用冰块（均可选）'],
  steps:['使用成品茉莉花茶按包装说明冲泡，滤出茶汤，放凉后及时冷藏备用。','柠檬充分洗净，用干净刀具切成薄片，去除可见的籽。','将柠檬片放入杯中，倒入放凉的茶汤。可加入少量糖或食用冰块，轻轻搅拌。','现做现饮，不长时间浸泡柠檬片；未立即饮用的部分密封冷藏并尽快饮用。']
 }
};
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
// Reuse the established local recipe-page layout without changing existing pages.
const existing=await readFile(new URL('../dist/recipes/daylily-eggs.html',import.meta.url),'utf8');
const styles=existing.match(/<style>([\s\S]*?)<\/style>/)[1];
await mkdir(new URL('../dist/recipes/',import.meta.url),{recursive:true});
for(const recipe of jasmineRecipes){
 const {ingredients,steps,note:recipeNote,reference}=details[recipe.image];
 const note=recipeNote||'选用标签清楚、来源可靠的成品茉莉花茶，按包装说明冲泡；不使用景区、绿化带或未经确认的观赏鲜花。茶冻为本站整理的日常创意做法，并非犍为独有的传统菜式。';
 const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${recipe.title}｜掌间花开</title><meta name="description" content="${recipe.text}"><link rel="stylesheet" href="../style.css?v=30"><style>${styles}</style></head><body data-flower="jasmine"><main class="recipe-shell"><nav class="recipe-nav" aria-label="食谱导航"><a class="brand" href="../">掌间花开</a><a href="../flower.html?flower=jasmine#kitchen">返回犍为茉莉 · 把花开端上餐桌</a></nav><header class="recipe-hero"><img src="../assets/recipes/${recipe.image}.webp" width="1000" height="750" alt="${recipe.title}做法示意图"><div><p class="eyebrow">BLOOM TO TABLE</p><h1>${recipe.title}</h1><p>${recipe.text}</p><p class="recipe-part">${recipe.part} · 日常做法参考</p></div></header><div class="recipe-body"><section aria-labelledby="ingredients"><h2 id="ingredients">准备食材</h2><ul>${ingredients.map(i=>`<li>${escape(i)}</li>`).join('')}</ul></section><section aria-labelledby="steps"><h2 id="steps">制作步骤</h2><ol>${steps.map(i=>`<li>${escape(i)}</li>`).join('')}</ol></section></div><p class="recipe-note">${note} 用量可按人数与口味调整。</p>${reference?`<p class="recipe-reference"><a href="${escape(reference.url)}" target="_blank" rel="noopener noreferrer">${escape(reference.label)}</a></p>`:''}</main></body></html>`;
 await writeFile(new URL('../dist/'+recipe.source,import.meta.url),html);
}
console.log('Built four matching jasmine pastry, fish, jelly and tea recipe pages.');
