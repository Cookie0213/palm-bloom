import {mkdir,writeFile} from 'node:fs/promises';
import {recipes} from '../dist/content.js';
const details=[
 ['daylily-eggs',['干黄花 30 克','干木耳 5 克','鸡蛋 2 个','蒜 2 瓣，食用油、生抽、盐适量'],['干黄花和木耳分别按包装说明泡发，换水洗净；去除黄花硬梗与木耳根部，沥水备用。','鸡蛋打散。锅中放少量油，炒至凝固后盛出。','蒜末炒香，加入黄花与木耳翻炒，加少量清水，盖锅焖煮至食材完全熟透。','倒回炒好的鸡蛋，加少量生抽和盐，翻炒均匀后盛出。']],
 ['daylily-soup',['干黄花 30 克','排骨 400 克','姜 3 片','清水、盐适量'],['干黄花按包装说明泡发，换水洗净，去掉硬梗。','排骨洗净，冷水下锅煮出浮沫，捞出后用温水洗净。','排骨与姜片放入炖锅，加足量热水，大火煮开后转小火炖约 50—60 分钟。','加入黄花，继续炖煮约 15—20 分钟，确认排骨与黄花熟透后加盐调味。']],
 ['daylily-chicken',['干黄花 25 克','干香菇 4 朵','鸡腿肉 350 克','姜丝、生抽、淀粉、食用油适量'],['黄花和香菇分别按包装说明泡发、洗净，黄花去硬梗，香菇切片。','鸡腿肉切成约 2 厘米的小块，加入姜丝、生抽、少量淀粉和油拌匀，放冰箱腌约 15 分钟。','黄花、香菇铺在浅盘底部，鸡块摊放在上面，避免堆得过厚。','蒸锅水开后放入盘子，加盖蒸约 25 分钟。根据鸡块大小延长时间，确保鸡肉中心及配菜完全熟透。']],
 ['daylily-pork',['干黄花 30 克','猪里脊肉 200 克','青椒半个（可选）','姜蒜、生抽、淀粉、食用油、盐适量'],['干黄花按包装说明泡发、换水洗净，去除硬梗；青椒切丝。','里脊肉切丝，加少量生抽、淀粉和油拌匀，放冰箱短时腌制。','锅中放油，炒香姜蒜，放入肉丝划散，炒至变色。','加入黄花和少量清水，翻炒并焖煮至黄花与肉丝熟透。加入青椒丝炒熟，少量盐调味。']],
 ['lotus-crisps-v21',['确认可食用的荷花瓣约 10—12 片','面粉 40 克','玉米淀粉 20 克','鸡蛋 1 个','清水、食用油及少量盐或糖'],['从可靠食用渠道选购荷花瓣，逐片清洗后充分沥干，轻轻吸去表面水分。','面粉、淀粉、鸡蛋与适量清水搅匀，调成能薄薄挂住花瓣的面糊。按口味加入少量盐或糖。','锅中倒入适量油，中火加热。花瓣逐片裹一层薄糊，分批下锅，避免粘连。','炸至面糊定型、两面浅金黄且熟透后捞出沥油，稍放凉后食用。']],
 ['lotus-root',['莲藕 300 克','蒜 2 瓣','葱花、食用油、盐适量','清水、少量白醋（可选）'],['莲藕洗净去皮，切成厚薄均匀的薄片；切好后放清水中，烹饪前沥干。','锅中热油，下蒜末炒香，再倒入藕片翻炒。','少量多次加入清水，边炒边焖至藕片熟透；喜欢微酸口味可加少量白醋。','加入盐和葱花，翻匀后盛出。']],
 ['lotus-seed',['干银耳 10 克','莲子 30 克','红枣 4—6 颗','清水约 1 升，冰糖少量'],['银耳按包装说明泡发，去除硬蒂、洗净后撕成小朵；莲子按产品说明处理并去芯。','银耳和莲子放入锅中，加水煮开后转小火，锅盖留缝，避免溢锅。','炖约 40—60 分钟，期间适当搅动；加入洗净的红枣继续炖至莲子软糯、银耳汤汁稍稠。','按口味加入少量冰糖，煮化后关火。']],
 ['lotus-leaf',['糯米 200 克','鸡腿肉 250 克','干香菇 4 朵','食用干荷叶 2 张','姜、生抽、少量盐及食用油'],['糯米按包装说明浸泡，沥水后先蒸熟；食用干荷叶泡软、洗净备用。','香菇泡发洗净切丁。鸡肉切小块，加姜丝、生抽拌匀，放冰箱短时腌制。','鸡肉与香菇先下锅炒至完全熟透，与熟糯米混合调味。','取荷叶铺平，包入馅料并折好，接口向下放进蒸笼。','水开后蒸约 20 分钟，让荷香融入糯米；确认馅料充分热透后展开荷叶食用，荷叶作为包裹材料。']],
 ['xinyi-eggs',['经可靠食用渠道确认的可食用辛夷花瓣','鸡蛋','葱、盐、食用油适量'],['按食用原料说明清洗处理花瓣，沥干后切成小片。','鸡蛋打散，葱洗净切碎。','热锅放油，倒入蛋液翻炒，再加入处理好的花瓣。','继续炒至蛋液完全凝固、花瓣熟透，加入少量盐和葱花，翻匀出锅。']],
 ['xinyi-buns-v21',['经可靠食用渠道确认的可食用辛夷花瓣','面粉、酵母、清水'],['花瓣按食用原料说明清洗处理，沥干后切碎。','按照酵母包装指引，将面粉、酵母和清水揉成面团，完成第一次发酵。','将花瓣碎揉入面团，排气后分成小剂，整形成花馍并醒发。','放入蒸锅，按面点大小调整蒸制时间，蒸至面团内部完全熟透后关火，稍焖再揭盖。']],
 ['xinyi-vegetables',['经可靠食用渠道确认的可食用辛夷花瓣','当季绿叶蔬菜','蒜、盐、食用油适量'],['花瓣按食用原料说明处理；时蔬洗净切段，菜梗与菜叶分开，蒜切末。','锅中放少量油，炒香蒜末，先下较难熟的菜梗。','加入菜叶与处理好的花瓣，适量补入清水，翻炒至所有食材完全熟透。','用少量盐调味，翻匀后盛出。']],
 ['xinyi-crisps',['经可靠食用渠道确认的可食用辛夷花瓣','面粉、鸡蛋、清水','食用油，少量盐或糖'],['花瓣逐片洗净并按食用原料说明处理，充分沥干表面水分。','面粉、蛋液与清水拌匀，调成能薄薄附着花瓣的面糊，按口味加入少量盐或糖。','花瓣逐片裹薄糊，分批下油锅，避免粘连与油花飞溅。','炸至外层定型、两面浅金黄且内部熟透，捞出沥油，稍放凉后品尝。']]

];
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
await mkdir(new URL('../dist/recipes/',import.meta.url),{recursive:true});
for(const [id,ingredients,steps] of details){
 const recipe=recipes.flat().find(r=>r.image===id);
 const theme=id.startsWith('daylily')?'daylily':id.startsWith('xinyi')?'xinyi':'lotus',name={daylily:'渠县黄花',xinyi:'江油辛夷',lotus:'中江荷花'}[theme];
 const note=theme==='xinyi'?'仅使用可靠食用渠道确认可食用的花瓣，并按原料说明处理。药用干燥辛夷花蕾、观赏及绿化花材不能替代。以下为地方食俗启发的家常做法参考。':theme==='daylily'?'使用正规食用渠道的干黄花，按包装说明泡发、洗净并充分煮熟；不以鲜黄花或观赏萱草代替。':'选择可靠渠道的食用原料，不采摘景区或绿化带花叶入菜。本文为家常烹饪参考，并非中江独有菜式。';
 const sourceUrl=id==='xinyi-crisps'?'https://www.scpo.cn/kandian/detail/bcb5bcd0-857f-4cce-8802-fd145808b74d':'https://www.wccdaily.com.cn/shtml/hxdsb/20260409/245133.shtml';
 const sourceName=id==='xinyi-crisps'?'四川画报《春日限定 四川滋味》':'华西都市报《李白未逢辛夷开》';
 const reference=theme==='xinyi'?`<p class="recipe-reference">地方食俗依据：<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${sourceName}</a>。资料记载当地花食，具体步骤由本站整理，非标准工艺配方。</p>`:'';
 const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${recipe.title}｜掌间花开</title><link rel="stylesheet" href="../style.css?v=26"><style>body{line-height:1.8;font-size:16px}.recipe-reference{font-size:14px;color:var(--muted);margin-top:16px}.recipe-shell{max-width:1080px;margin:0 auto;padding:32px 28px 70px}.recipe-nav{display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:24px;gap:24px}.recipe-hero{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;margin:48px 0}.recipe-hero img{width:100%;aspect-ratio:4/3;object-fit:cover}.recipe-hero h1{font:44px/1.3 var(--song);margin:12px 0 24px}.recipe-body{display:grid;grid-template-columns:1fr 2fr;gap:64px;border-top:1px solid var(--line);padding-top:32px}.recipe-body h2{font:26px var(--song);margin-bottom:20px}.recipe-body li{padding:0 0 14px 8px}.recipe-note{margin-top:32px;padding-top:24px;border-top:1px solid var(--line);color:var(--muted);font-size:14px}@media(max-width:650px){.recipe-hero,.recipe-body{grid-template-columns:1fr;gap:24px}.recipe-hero h1{font-size:34px}.recipe-hero{margin:28px 0}}</style></head><body data-flower="${theme}"><main class="recipe-shell"><nav class="recipe-nav" aria-label="食谱导航"><a class="brand" href="../">掌间花开</a><a href="../flower.html?flower=${theme}#kitchen">返回${name} · 把花开端上餐桌</a></nav><header class="recipe-hero"><img src="../assets/recipes/${id}.webp" alt="${recipe.title}"><div><p class="eyebrow">BLOOM TO TABLE</p><h1>${recipe.title}</h1><p>${recipe.text}</p><p class="recipe-part">${recipe.part} · ${theme==='xinyi'?'家常做法参考':'约 2 人份'}</p></div></header><div class="recipe-body"><section aria-labelledby="ingredients"><h2 id="ingredients">准备食材</h2><ul>${ingredients.map(i=>`<li>${escape(i)}</li>`).join('')}</ul></section><section aria-labelledby="steps"><h2 id="steps">制作步骤</h2><ol>${steps.map(i=>`<li>${escape(i)}</li>`).join('')}</ol></section></div><p class="recipe-note">${note} 用量可按人数与口味调整。</p>${reference}</main></body></html>`;
 await writeFile(new URL(`../dist/recipes/${id}.html`,import.meta.url),html);
}
console.log('Built 12 matching on-site recipe pages.');
