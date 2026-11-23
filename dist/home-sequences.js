import { readSequence } from './sequence-store.js?v=46';
import { cachedAsset } from './asset-cache.js?v=46';
import { frameForTheme, themes } from './themes.js?v=41';
// Five panels share one render queue. Keep only six decoded frames per flower.
export class FlowerChoir {
  constructor({fetchPack,decode,commit=()=>{},onload=()=>{}}={}) {
    this.fetchPack=fetchPack|| (async key=>{const r=await cachedAsset(`assets/home-sequences-v42/${key}.bin`,{signal:this.abort.signal});return readSequence(r);});
    this.decode=decode|| (blob=>createImageBitmap(blob));this.commit=commit;this.onload=onload;
    this.abort=new AbortController();this.caches=themes.map(()=>new Map());this.packs=[];this.disposed=false;this.pending=null;this.task=null;this.stamp='';
  }
  async prepare(){
    if(this.preparation)return this.preparation;
    this.preparation=Promise.all(themes.map(async(t,i)=>{this.packs[i]=await this.fetchPack(t.key);if(this.disposed)throw Error('Disposed');this.onload();}));
    return this.preparation;
  }
  async frame(i,n){
    const cache=this.caches[i];if(cache.has(n)){const f=cache.get(n);cache.delete(n);cache.set(n,f);return f;}
    const f=await this.decode(this.packs[i][n]);if(this.disposed){f.close();throw Error('Disposed');}
    cache.set(n,f);while(cache.size>6){const oldest=cache.keys().next().value;cache.get(oldest).close();cache.delete(oldest);}return f;
  }
  request(progress){
    if(this.disposed)return Promise.resolve();
    const indices=themes.map((_,i)=>frameForTheme(i,progress)),stamp=indices.join(':');
    this.pending={progress,indices,stamp};
    if(!this.task)this.task=this.drain().finally(()=>{this.task=null;});
    return this.task;
  }
  async drain(){
    while(this.pending&&!this.disposed){
      const next=this.pending;this.pending=null;if(next.stamp===this.stamp)continue;
      // Never expose a partial update when one flower takes longer to decode.
      const result=await Promise.allSettled(next.indices.map((n,i)=>this.frame(i,n)));
      if(this.disposed)return;
      const failed=result.find(r=>r.status==='rejected');if(failed)throw failed.reason;
      this.commit(result.map(r=>r.value),next.progress,next.indices);this.stamp=next.stamp;
    }
  }
  dispose(){this.disposed=true;this.pending=null;this.abort.abort();this.caches.forEach(c=>{c.forEach(f=>f.close());c.clear();});this.packs=[];}
}
