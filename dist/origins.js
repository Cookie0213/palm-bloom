import { panzhihuaOrigin } from './panzhihua-content.js?v=47';
import { jasmineOrigin } from './jasmine-content.js?v=47';
// Source-backed editorial content; no requests or animation work in the render loop.
export const originStories = {
  daylily: {
    name: '渠县黄花', place: '四川 · 达州 · 渠县',
    heading: '渠县一味 · 黄花传薪',
    description: '从花田到竹筛，渠县黄花的采制手艺，留住家乡的金色滋味。',
    highlights: ['国家地理标志保护产品', '四川省级非遗 · 传统技艺'],
    title: '一筛黄花，留下土地的味道',
    image:'assets/ai-scenes-v47/daylily-origin.webp',width:1536,height:1024,alt:'AI 生成示意：黄花田采收与竹篮中的鲜蕾',caption:'黄花采收场景示意',
    credit:'AI 生成场景示意 · 非产地实拍',
    badges: ['国家地理标志保护产品', '四川省级非遗 · 传统技艺'],
    paragraphs: [
      '花期里，渠县的花农走进田间，采收尚未开放的花蕾。1864 年成书的《渠县志》已记下“金针”；一代代人把黄花种在土地上，也把采摘、选料、蒸制、摊晾和晾晒的手艺留在生活里。',
      '竹筛承接鲜蕾，火候与日光留下风味。今天，干黄花走向家庭餐桌，黄花酱等加工产品打开新的市场，采摘体验与乡村游也让更多人走近花田。一朵家乡花，连接着农户的劳作、地方的手艺与远方的消费者。'
    ],
    facts: [
      ['2009', '实施地理标志产品保护', '原国家质检总局 2009 年第 108 号公告；保护范围为四川省渠县现辖行政区域。'],
      ['2023', '列入四川省第六批省级非遗', '正式项目名：渠县黄花生产传统技艺。项目编号：SC-Ⅷ-180（6）。']
    ],
    more: {label:'了解黄花与花农的故事',url:'https://sichuan.scol.com.cn/tfrm/202409/82615852.html'},
    sources: [
      ['地理标志保护公告 · 中国质量新闻网', 'https://m.cqn.com.cn/zj/content/2009-12/04/content_1008674.htm'],
      ['省级非遗公布通知 · 中国非物质文化遗产网', 'https://www.ihchina.cn/project_details/27054/'],
      ['传统加工技艺介绍 · 四川在线', 'https://sichuan.scol.com.cn/ggxw/202105/58144539.html']
    ],
    intro: '从一份干黄花开始，认识产地农户与本地加工企业，让家乡风味走近更多餐桌。',
    note: '购买渠道来自第三方平台，产地与店铺信息以其页面为据；在售状态、配送范围及商品资质请在下单前向商家确认。',
    products: [
      {title:'渠县干黄花',kind:'产地农产品',image:'assets/ai-scenes-v47/daylily-dry.webp',width:1536,height:1024,alt:'AI 生成示意：陶碗中的干黄花与素色包装袋',caption:'AI 品类示意 · 非商家实物，商品以渠道页面为准',place:'中国四川 · 达州渠县',producer:'渠道店铺：争鸣农场（惠农网）',text:'店铺页面标示渠县发货、定远镇本地黄花。干制花蕾适合家庭日常选购，泡发洗净、充分烹熟后入菜。',label:'查看购买渠道',url:'https://www.cnhnb.com/gongying/4354642/',channel:'电商供应页 · 可向商家询货'},
      {title:'黄花加工好物',kind:'本地企业 · 产品资讯',image:'assets/ai-scenes-v47/daylily-packing.webp',width:1536,height:1024,alt:'AI 生成示意：干黄花分拣与装袋的加工场景',caption:'AI 加工场景示意 · 非所列企业实拍',place:'中国四川 · 达州渠县',producer:'相关企业：四川省宕府王食品有限责任公司',text:'从干黄花到黄花酱等加工产品，本地企业让一季的收获有了更多日常吃法。先认识企业与产业，再了解实际供应。',label:'了解企业与产品',url:'https://sichuan.scol.com.cn/tfrm/202409/82615852.html',channel:'权威报道 · 非直接下单页'}
    ]
  },
  xinyi: {
    name:'江油辛夷',place:'四川 · 绵阳 · 江油',
    heading:'江油春信 · 辛夷有承',
    description:'吴家后山的春花年年如约，传统栽培与林下生计，共续一山春色。',
    highlights:['中国重要农业文化遗产'],
    title:'一山辛夷，数百年的农林共生',
    image:'assets/ai-scenes-v47/xinyi-origin.webp',width:1536,height:1024,alt:'AI 生成示意：山坡上开着粉白花朵的成熟辛夷树',caption:'辛夷山林与传统栽培意境',
    credit:'AI 生成场景示意 · 非产地实拍',
    badges:['中国重要农业文化遗产 · 第二批', '传统栽培 · 农林共生'],
    paragraphs:[
      '每到三四月，江油大康镇吴家后山的辛夷沿山势次第开放。这里有数百年的栽培历史：山顶保有森林，山腰种植辛夷等药材林，林下发展种养。树木、土地与日常生产，组成延续至今的立体农林生活。',
      '2014 年，这套传统栽培体系入选第二批中国重要农业文化遗产。今天，古树养护、春日赏花和林下农业共同延续着山村生计。理解辛夷的价值，也要分清用途：药用花蕾与地方花食，不能被当成同一种消费产品。'
    ],
    facts:[
      ['2014','第二批中国重要农业文化遗产','正式名称：四川江油辛夷花传统栽培体系。'],
      ['农林共生','从传统栽培到林下生计','中国农业博物馆记载了当地森林、药材林与林下种养相结合的生产方式。']
    ],
    more:{label:'走近吴家后山的传承与保护',url:'https://www.ctnews.com.cn/paper/content/202403/13/content_88768.html'},
    sources:[
      ['第二批名录 · 农业农村部网站', 'https://cnafun.moa.gov.cn/kx/gn/201406/t20140627_3952547.html'],
      ['传统栽培系统 · 中国农业博物馆', 'https://www.ciae.com.cn/detail/zh/16220.html']
    ],
    intro:'从辛夷药材林到林下生产，认识吴家后山的多元生计，再循着供销渠道发现江油好物。',
    note:'尚未核实到可直接下单的江油辛夷相关产地产品，本页先提供产业与官方供销信息。药用辛夷花蕾不作为普通食品推介，地方花食介绍不等于商品销售许可。',
    products:[
      {title:'辛夷花蕾 · 药用产业',kind:'药用产业资料 · 非食品推介',image:'assets/ai-scenes-v47/xinyi-buds.webp',width:1536,height:1024,alt:'AI 生成示意：竹筛中带绒毛的干燥辛夷花蕾',caption:'AI 原料示意 · 药用产业资料，非食品或商品实拍',place:'中国四川 · 江油大康镇吴家后山',producer:'产地资源：吴家后山辛夷药材林',text:'采蕾、晾制是当地辛夷产业的一部分。这张卡片介绍药用原料与山村生产，不提供食用建议或药材零售入口。',label:'了解产地产业',url:'https://www.ctnews.com.cn/paper/content/202403/13/content_88768.html',channel:'产业报道 · 不作为普通食品销售'},
      {title:'林下生计 · 江油好物',kind:'产地资源 · 官方渠道信息',image:'assets/ai-scenes-v47/xinyi-bees.webp',width:1536,height:1024,alt:'AI 生成示意：春日花林下的木制蜂箱',caption:'AI 林下养蜂场景示意 · 非经营主体实拍',place:'中国四川 · 江油',producer:'渠道主体：江油市供销社、江油市供联农业科技有限公司',text:'辛夷林下发展种养，江油供销体系通过展销、产销对接等服务连接农户与市场。了解当地好物的流通渠道与经营主体。',label:'了解官方供销渠道',url:'https://www.sccoop.com.cn/go-a1316855.htm',channel:'四川省供销社介绍 · 非直接下单页'}
    ]
  },
  lotus: {
    name:'中江荷花',place:'四川 · 德阳 · 中江',
    heading:'中江荷韵 · 一池生机',
    description:'在南山村，荷塘既是夏日风景，也是莲藕、莲子与乡村生活的来处。',
    highlights:['中江南山 · 荷莲产地', '农文旅融合'],
    title:'一池荷，把风景种成日常的收获',
    image:'assets/ai-scenes-v47/lotus-origin.webp',width:1536,height:1024,alt:'AI 生成示意：夏日连片荷塘与远处农舍',caption:'荷塘、田埂与村落相依的乡村意境',
    credit:'AI 生成场景示意 · 非产地实拍',
    badges:['中江南山产地', '荷莲产业 · 农文旅融合'],
    paragraphs:[
      '盛夏的中江南山，荷花把人们引向田野，也把田野的收获带向餐桌。南山村从土地整理、莲藕种植起步，逐渐把赏荷、鲜藕、莲子与加工产品连成一条产业链。荷塘边是种植与采收，闲置农房里则有了乡村餐饮和休闲空间。',
      '金三塘莲藕专业合作社联结村集体与农户，让土地流转、务工和分红成为增收渠道。从鲜藕到藕粉、荷叶茶，一池荷的价值延续到花期之外。这份产地故事，写在乡亲们日常的劳作与生活中。'
    ],
    facts:[
      ['一池多用','观赏莲、食用藕与籽莲','依据不同品种与用途发展观赏、食用及加工产业，连接荷塘和消费市场。'],
      ['联农带农','村集体 + 合作社 + 农户','四川在线报道当地以土地流转租金、集体分红与务工酬劳联结农户。']
    ],
    more:{label:'读一读南山村的荷产业故事',url:'https://deyang.scol.com.cn/sdtp/202608/83301842.html'},
    sources:[
      ['南山村产地走访 · 四川在线（2026-08-07）','https://deyang.scol.com.cn/sdtp/202608/83301842.html'],
      ['莲产业与加工产品 · 四川在线（2026-08-13）','https://sichuan.scol.com.cn/ggxw/202608/83304994.html']
    ],
    intro:'从中江南山的荷塘出发，认识鲜藕、莲子与莲制品，循着真实产地了解乡村经营。',
    note:'目前提供经核实的产地与产品报道，尚未核实可直接下单的合作社零售店。页面不代售商品，也不将报道入口标作购买按钮。',
    products:[
      {title:'南山鲜藕与莲子',kind:'产地农产品',image:'assets/ai-scenes-v47/lotus-industry.webp',width:1536,height:1024,alt:'AI 生成示意：鲜藕、莲蓬与莲子的农产品组合',caption:'AI 品类示意 · 非合作社商品实拍',place:'中国四川 · 德阳中江南华镇南山村',producer:'产地合作组织：金三塘莲藕专业合作社',text:'从荷塘里的种植、采收，到清洗与销售，鲜藕和莲子连接着当地农户的日常生产。通过产地走访报道认识合作社与农产品。',label:'了解产地与合作社',url:'https://deyang.scol.com.cn/sdtp/202608/83301842.html',channel:'权威产地报道 · 非直接下单页'},
      {title:'南山藕粉与荷叶茶',kind:'莲产业加工 · 产品资讯',image:'assets/ai-scenes-v47/lotus-products.webp',width:1536,height:1024,alt:'AI 生成示意：藕粉、藕片、荷叶茶与茶汤',caption:'AI 品类示意 · 非所列品牌商品实拍',place:'中国四川 · 德阳中江南华镇南山村',producer:'产地产品：南华镇“品味”系列',text:'当地将鲜藕加工为藕粉，并开发荷叶茶等产品。加工延长了荷塘收获的利用时间，也为村民带来更多生产环节的就业机会。',label:'了解莲产业产品',url:'https://sichuan.scol.com.cn/ggxw/202608/83304994.html',channel:'权威产品报道 · 非直接下单页'}
    ]
  }
};

originStories.jasmine=jasmineOrigin;
originStories.panzhihua=panzhihuaOrigin;

const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const link=(label,url,css='')=>`<a class="${css}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>`;

export function renderOrigins(key) {
  const story=originStories[key];
  if(!story)throw new Error('Unknown origin: '+key);
  document.getElementById('originTitle').textContent=story.heading;
  document.getElementById('originIntro').textContent=story.description;
  document.getElementById('profileBadges').innerHTML=story.highlights.map((badge,index)=>`<a ${index===0?'id="profileBadge" ':''}class="profile-badge" href="#origins" aria-label="${esc(badge)}，查看产地故事与依据">${esc(badge)}</a>`).join('');
  const origin=document.getElementById('originContent');
  origin.dataset.theme=key;
  origin.innerHTML=`
    <figure class="origin-photo"><img src="${story.image}" width="${story.width}" height="${story.height}" alt="${esc(story.alt)}" loading="lazy" decoding="async" fetchpriority="low"><figcaption>${esc(story.caption)}<small>${esc(story.credit)}</small></figcaption></figure>
    <div class="origin-story"><p class="origin-place">${esc(story.place)} <span>／</span> ${esc(story.name)}</p>
      <h3>${esc(story.title)}</h3><div class="origin-badges">${story.badges.map(b=>`<span>${esc(b)}</span>`).join('')}</div>
      ${story.paragraphs.map(p=>`<p class="story-paragraph">${esc(p)}</p>`).join('')}
      <dl class="origin-facts">${story.facts.map(([year,title,description])=>`<div><dt><span>${esc(year)}</span>${esc(title)}</dt><dd>${esc(description)}</dd></div>`).join('')}</dl>
      ${link(story.more.label,story.more.url,'origin-more')}
      <details class="origin-sources"><summary>资料与认定依据 <span aria-hidden="true">＋</span></summary><ul>${story.sources.map(([label,url])=>`<li>${link(label,url)}</li>`).join('')}</ul></details>
    </div>`;
  document.getElementById('marketIntro').textContent=story.intro;
  const grid=document.getElementById('productGrid');
  grid.dataset.theme=key;
  grid.innerHTML=story.products.map(p=>`<article class="product-card">
    <figure><img src="${p.image}" width="${p.width}" height="${p.height}" alt="${esc(p.alt)}" loading="lazy" decoding="async" fetchpriority="low"><figcaption>${esc(p.caption)}</figcaption></figure>
    <div class="product-copy"><p class="product-kind">${esc(p.kind)}</p><h3>${esc(p.title)}</h3><p class="product-place">${esc(p.place)}</p><p class="product-description">${esc(p.text)}</p><p class="product-producer">${esc(p.producer)}</p><div class="product-action">${link(p.label,p.url,'product-link')}<small>${esc(p.channel)}</small></div></div>
  </article>`).join('');
  document.getElementById('marketNote').textContent=story.note;
  document.getElementById('originExplore').innerHTML=Object.entries(originStories).filter(([name])=>name!==key).map(([name,data])=>`<button type="button" data-origin="${name}">${esc(data.name)} <span aria-hidden="true">↗</span></button>`).join('');
}
