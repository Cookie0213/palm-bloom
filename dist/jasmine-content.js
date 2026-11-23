// Local, source-backed content. Loaded once; no requests in the gesture loop.
const pictorial='https://vs-vsec.scpo.cn/areanews/detail/158bbe26-0ef6-4adf-8eed-238545b0b59a';
const standard='https://std.samr.gov.cn/db/search/stdDBDetailedCNF?id=D7B64E13564C93BCE05397BE0A0A2EB8';
const heritage='https://www.ihchina.cn/art/detail/id/31473.html';
const enterprise='https://www.scspc.gov.cn/dbfc/202206/154830.html';

export const jasmineCulture=`
<article><img src="assets/ai-scenes-v47/jasmine-field.webp" width="1536" height="1024" alt="AI 生成示意：低矮茉莉花田中的白色花苞与绿叶" loading="lazy" decoding="async" fetchpriority="low"><h3>清溪花田</h3><p>温暖湿润的清溪，让茉莉扎根生长。当地将花田与茶园相连，让洁白花香成为家乡的一张名片。</p><a href="${pictorial}" target="_blank" rel="noopener noreferrer">走近犍为花田 ↗</a></article>
<article><img src="assets/ai-scenes-v47/jasmine-harvest.webp" width="1536" height="1024" alt="AI 生成示意：花农双手采下茉莉花苞放入竹篮" loading="lazy" decoding="async" fetchpriority="low"><h3>一捧花的生计</h3><p>花农穿行田垄，采下一捧捧鲜花。种植、采收与收购相互衔接，把一季花香变成乡亲们的日常生计。</p><a href="${enterprise}" target="_blank" rel="noopener noreferrer">了解花农与合作社 ↗</a></article>
<article><img src="assets/ai-scenes-v47/jasmine-craft.webp" width="1536" height="1024" alt="AI 生成示意：竹筛中茉莉鲜花与茶坯的细节" loading="lazy" decoding="async" fetchpriority="low"><h3>花茶相依</h3><p>鲜花与茶坯相遇，窨制让茶吸纳花香。经验传承与工艺研究相伴，让产地风味进入更多人的茶杯。</p><a href="${pictorial}" target="_blank" rel="noopener noreferrer">认识花茶工艺 ↗</a></article>
<article><div class="sequence sequence-triptych" aria-label="茉莉花从含苞到盛放的三个阶段"><img src="assets/culture-stages/jasmine-single-v39.webp" width="1584" height="990" alt="同一朵茉莉的近景对照：含苞、舒展、盛放，花瓣变化清晰可见" loading="lazy" decoding="async" fetchpriority="low"><div class="stage-labels" aria-hidden="true"><span>含苞</span><span>舒展</span><span>盛放</span></div></div><h3>指尖花信</h3><p>从一枚花苞到一朵盛放的茉莉，近看花瓣如何层层舒展。以指尖走近花开，也认识花香背后的犍为。</p><a href="#home">回到互动展品 ↑</a></article>`;

export const jasmineOrigin={
  name:'犍为茉莉',place:'四川 · 乐山 · 犍为',
  heading:'犍为茉莉 · 一窨传香',
  description:'花开清溪，香入茶盏；一簇白花，连着花农的日常与制茶人的手艺。',
  highlights:['地理标志产品 · 犍为茉莉花茶','四川省级非遗 · 花茶制作技艺'],
  title:'一朵花的香，一杯茶的来处',
  image:'assets/ai-scenes-v47/jasmine-origin.webp',width:1536,height:1024,alt:'AI 生成示意：制茶人双手将茉莉鲜花与茶叶拌合',caption:'鲜花与茶相遇的窨制场景示意',
  credit:'AI 生成场景示意 · 非产地实拍',
  badges:['地理标志产品 · 犍为茉莉花茶','四川省级非遗 · 传统技艺'],
  paragraphs:[
    '清溪的茉莉已有三百多年的栽培历史。花开时节，花农走进田间采收鲜蕾，制茶人以窨制留香。花田、茶园与茶坊彼此相连，让一朵白花的芬芳进入日常的一杯茶。',
    '这份手艺也有可查的来处：犍为茉莉花茶是地理标志保护产品，其制作技艺于 2025 年列入四川省第七批省级非物质文化遗产代表性项目名录。今天，种植、加工与乡村体验共同延续着花乡的生活。'
  ],
  facts:[
    ['2010','犍为茉莉花茶获地理标志保护','对应原国家质检总局 2010 年第 145 号公告；保护对象为茉莉花茶产品。'],
    ['2025','花茶制作技艺入选四川省级非遗','正式名称：犍为茉莉花茶制作技艺。第七批，项目编号 SC-Ⅷ-228。']
  ],
  more:{label:'阅读犍为花与茶的故事',url:pictorial},
  sources:[
    ['地理标志产品标准 · 全国标准信息公共服务平台',standard],
    ['四川省第七批非遗名录 · 中国非物质文化遗产网',heritage],
    ['花茶产业与联农带农 · 四川人大网',enterprise],
    ['清溪茶厂窨制现场 · 新华网','https://app.xinhuanet.com/news/article.html?articleId=2026072562ef97604f46421b9a0f6ada1e45d3ff']
  ],
  intro:'从清溪花田到一杯花茶，认识犍为的制茶企业与联农带农故事，让产地风味被更多人了解。',
  note:'以下为已核实的产地企业与产品资料，暂未核实官方直接下单页面；按钮如实指向资料入口，不代售商品。',
  products:[
    {title:'犍为茉莉花茶',kind:'地理标志产品 · 花茶',image:'assets/ai-scenes-v47/jasmine-tea.webp',width:1536,height:1024,alt:'AI 生成示意：盖碗花茶、干茶与茉莉花枝',caption:'AI 花茶品类示意 · 非所列企业商品实拍',place:'中国四川 · 乐山犍为',producer:'相关企业：四川省清溪茶业有限公司',text:'以鲜花窨茶，把花香与茶味相融。清溪茶业参与当地花茶标准制定，从产地加工与产品标准认识一杯犍为茉莉花茶。',label:'了解花茶与产地',url:pictorial,channel:'权威产地资料 · 非直接下单页'},
    {title:'炒花甘露 · 产地花茶',kind:'本地企业 · 联农带农',image:'assets/ai-scenes-v47/jasmine-cooperative.webp',width:1536,height:1024,alt:'AI 生成示意：协作分拣茶叶与装袋的工作场景',caption:'AI 茶业协作场景示意 · 非所列企业实拍',place:'中国四川 · 犍为清溪',producer:'企业：四川省炒花甘露茗茶有限公司',text:'企业与犍为县汇农茉莉花专业合作社连接花农，通过种植培训与产销协作发展花茶产业。循着官方报道，了解真实企业和原料产地。',label:'了解企业与合作社',url:enterprise,channel:'四川人大网报道 · 非直接下单页'}
  ]
};
