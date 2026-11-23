import { bloomFrame } from './math.js?v=23';
export const themes = [
  { key:'daylily', name:'渠县黄花', en:'QUXIAN YELLOW DAYLILY', location:'四川 · 达州 · 渠县', caption:'HEMEROCALLIS · QUXIAN', folder:'assets/', subtitle:'一场指尖与黄花的相遇', intro:'一朵黄花，一方水土，<br>一场关于生命的绽放。', profile:['中国四川 · 达州渠县','多年生草本，花蕾粗长饱满，盛开时花色金黄。','可分株繁殖，多在春秋栽植，花蕾开放前采收。','也叫忘忧草、母亲花，寄托思念与祝愿。'] },
  { key:'xinyi', name:'江油辛夷', en:'JIANGYOU MAGNOLIA', location:'四川 · 绵阳 · 江油', caption:'MAGNOLIA · JIANGYOU', folder:'assets/xinyi/', subtitle:'一场指尖与辛夷的相遇', intro:'一枝辛夷，一山春色，<br>一场关于故土的绽放。', profile:['中国四川 · 绵阳江油','木兰科落叶花木，花蕾被柔毛，春日枝头绽出粉白花朵。','可播种或嫁接繁殖，宜疏松肥沃、排水良好的土壤。','吴家后山的春日花事，连接传统栽培与山乡生活。'] },
  { key:'lotus', name:'中江荷花', en:'ZHONGJIANG LOTUS', location:'四川 · 德阳 · 中江', caption:'NELUMBO · ZHONGJIANG', folder:'assets/lotus/', subtitle:'一场指尖与荷花的相遇', intro:'一朵荷花，一池清韵，<br>一场关于夏日的绽放。', profile:['中国四川 · 德阳中江','多年生水生草本，叶片圆阔，花瓣层叠舒展，花心显露莲蓬。','春季以种藕栽植，喜阳光与温暖，生长季保持适宜水位。','荷韵清雅，寄托清廉与和美；花、莲子和藕连接池塘与餐桌。'] },
  { key:'jasmine', name:'犍为茉莉', en:'QIANWEI JASMINE', location:'四川 · 乐山 · 犍为', caption:'JASMINUM SAMBAC · QIANWEI', folder:'assets/jasmine/', video:'assets/jasmine/original-v39.mp4', subtitle:'一场指尖与茉莉的相遇', intro:'一簇茉莉，一缕清香，<br>一场关于花与茶的相遇。', profile:['中国四川 · 乐山犍为','木犀科灌木，叶片对生，花色洁白，花瓣圆润，花香清雅。','喜温暖湿润、光照充足的环境，宜疏松排水良好的土壤。','清溪的花田与茶坊相连，花香留在杯中，也融入乡亲的日常。'] },
  { key:'panzhihua', name:'攀枝花木棉', en:'PANZHIHUA KAPOK', location:'四川 · 攀枝花', caption:'BOMBAX CEIBA · PANZHIHUA', folder:'assets/panzhihua/', subtitle:'一场指尖与木棉的相遇', intro:'一树木棉，一城春色，<br>一场关于阳光的绽放。', profile:['中国四川 · 攀枝花','落叶乔木，先花后叶，花瓣厚实，橙红花色与簇生花蕊相映。','喜温暖、充足阳光与良好排水，可播种繁殖，不耐严寒。','因花得名的城市，木棉把河谷春色与市民的生活相连。'] }
];
export const wrapTheme = index => (index % themes.length + themes.length) % themes.length;
// flower.html is an explicit exhibition entrance. The homepage loads separately.
export function initialTheme(search, hash) {
 const key=new URLSearchParams(search).get('flower');
 return Math.max(0,themes.findIndex(theme=>theme.key===key));
}
export function frameForTheme(index, progress) {
 const p=Math.max(0,Math.min(1,progress));
 if(themes[index].key==='daylily') return bloomFrame(p);
 if(themes[index].key==='lotus') return Math.round(p<=.03?p/.03*21:21+(p-.03)/.97*74);
 return Math.round(p*95);
}
export function swipeHint(index){return '左手向左 → '+themes[wrapTheme(index+1)].name+' · 向右 → '+themes[wrapTheme(index-1)].name;}
