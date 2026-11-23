// Source-backed local content. Images load lazily, outside the gesture loop.
const story='https://www.peopleapp.com/column/30051736086-500007412824';
const ancient='https://sichuan.scol.com.cn/ggxw/202403/82493496.html';
const food='https://cbgc.scol.com.cn/news/7372293?app_id=cbgc&from=iosapp';
const city='https://cbgc.scol.com.cn/news/7384391';
const botanical='https://www.iplant.cn/info/Bombax%20ceiba';

export const panzhihuaCulture=`
<article><img src="assets/ai-scenes-v47/panzhihua-city.webp" width="1536" height="1024" alt="AI 生成示意：木棉花枝映衬河谷城镇" loading="lazy" decoding="async" fetchpriority="low"><h3>阳光花城</h3><p>金沙江干热河谷的暖阳，催开早春的木棉。红花与江水、山城相映，成为攀枝花鲜明的城市记忆。</p><a href="${city}" target="_blank" rel="noopener noreferrer">走近阳光花城 ↗</a></article>
<article><img src="assets/ai-scenes-v47/panzhihua-detail.webp" width="1536" height="1024" alt="AI 生成示意：木棉枝头厚实的红色花瓣与簇生花蕊" loading="lazy" decoding="async" fetchpriority="low"><h3>英雄花语</h3><p>1987年，攀枝花被确定为市花。挺立枝头的红花，与这座城市的三线建设记忆相互映照。</p><a href="${story}" target="_blank" rel="noopener noreferrer">读懂一城花语 ↗</a></article>
<article><img src="assets/ai-scenes-v47/panzhihua-village.webp" width="1536" height="1024" alt="AI 生成示意：木棉花树旁的乡村院落" loading="lazy" decoding="async" fetchpriority="low"><h3>花下乡居</h3><p>仁和的村落里，木棉把春色带进屋前屋后。花下摄影与乡村游赏，让更多人走近这片土地的生活。</p><a href="${story}" target="_blank" rel="noopener noreferrer">看见花下生活 ↗</a></article>
<article><div class="sequence sequence-triptych" aria-label="同一朵攀枝花木棉从含苞到盛放的三个阶段"><img src="assets/culture-stages/panzhihua-v33.webp" width="1584" height="990" alt="同一朵木棉的近景对照：含苞、舒展、盛放，花瓣变化清晰可见" loading="lazy" decoding="async" fetchpriority="low"><div class="stage-labels" aria-hidden="true"><span>含苞</span><span>舒展</span><span>盛放</span></div></div><h3>指尖映红</h3><p>以双指开合唤醒一朵木棉，近看花瓣与花蕊渐次显露，让花城的一抹红在指尖停留。</p><a href="#home">回到互动展品 ↑</a></article>`;

export const panzhihuaOrigin={
  name:'攀枝花木棉',place:'四川 · 攀枝花',
  heading:'攀枝花开 · 一城春色',
  description:'金沙江畔，红花点亮古渡；一树春色，映照花城的生活与希望。',
  highlights:['攀枝花市市花','农文旅融合'],
  title:'一株古树，一座花城的记忆',
  image:'assets/ai-scenes-v47/panzhihua-origin.webp',width:1536,height:1024,alt:'AI 生成示意：开着红花的木棉树与河谷田园',caption:'木棉与河谷田园的乡土意境',
  credit:'AI 生成场景示意 · 非产地实拍',
  badges:['攀枝花市市花','金沙江干热河谷','农文旅融合'],
  paragraphs:[
    '金沙江畔的拉鲊古渡，一株三百余年的木棉仍年年开花。如今，古树周围建起兼具游憩、观赏与科普功能的公园，昔日渡口多了停步赏花的人。保护一棵树，也是在延续一方水土的记忆。',
    '攀枝花既是城市的名字，也是当地的市花。它连接三线建设的奋斗记忆，也走进春日的地方餐桌。古树保护、乡村游赏与日常食俗相连，让看花成为认识产地生活的起点。'
  ],
  facts:[
    ['1987','攀枝花被确定为市花','攀枝花市三届人大常委会第二十九次会议确定。植物为木棉，又称英雄花。'],
    ['古树公园','让保护与乡村体验相伴','拉鲊古渡旁以木棉古树为依托，建设集游憩、观赏与科普于一体的古树公园。']
  ],
  more:{label:'阅读古渡与木棉的故事',url:ancient},
  sources:[
    ['木棉物种信息 · 中国科学院植物研究所',botanical],
    ['市花与城市记忆 · 人民日报',story],
    ['古树保护与乡村体验 · 四川在线',ancient],
    ['攀枝花的地方食俗 · 川观新闻',food]
  ],
  intro:'从一份时令花蕊，到一次花下游赏，认识攀枝花的地方食材与乡村风景，让产地的日常被更多人看见。',
  note:'以下入口为已核实的地方食材与产地体验资料；暂未核实四川攀枝花本地产木棉食材的官方直接下单页面，不代售商品。',
  products:[
    {title:'木棉花蕊 · 春日食材',kind:'地方食材 · 时令风味',image:'assets/ai-scenes-v47/panzhihua-detail.webp',width:1536,height:1024,alt:'AI 生成示意：木棉枝头厚实的红色花瓣与簇生花蕊',caption:'AI 植物形态示意 · 非商品实拍',place:'中国四川 · 攀枝花',producer:'产地食俗：川观新闻实地报道',text:'当地常取木棉花蕊制作炒腊肉、水豆豉拌花蕊等春日菜肴。先了解真实食材与地方做法，选用来源明确的食用产品，充分处理后熟制。',label:'了解地方食材',url:food,channel:'川观新闻报道 · 非直接下单页'},
    {title:'拉鲊古渡 · 花下游赏',kind:'古树保护 · 乡村体验',image:'assets/ai-scenes-v47/panzhihua-walk.webp',width:1536,height:1024,alt:'AI 生成示意：河畔木棉树与乡村游步道',caption:'AI 游赏场景示意 · 非拉鲊古渡实拍',place:'中国四川 · 攀枝花仁和',producer:'产地：仁和区大龙潭彝族乡拉鲊村',text:'在古树公园看木棉、读古渡，走近金沙江畔的村落生活。以赏花认识古树保护，也让一程乡村游赏连接地方的日常经营。',label:'了解产地体验',url:ancient,channel:'四川在线产地报道 · 非预约下单页'}
  ]
};
