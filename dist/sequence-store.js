import { cachedAsset } from './asset-cache.js?v=46';
// A complete native-resolution sequence is prepared before interaction.
// Rendering is synchronous, with no network requests or on-demand decode while fingers move.
export function unpackSequence(buffer){
  const length=new DataView(buffer).getUint32(0,true);
  const header=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,4,length)));
  let offset=4+length;
  const frames=header.lengths.map(length=>{const bytes=new Uint8Array(buffer,offset,length);offset+=length;return new Blob([bytes],{type:'image/webp'});});
  if(frames.length!==96||offset!==buffer.byteLength)throw new Error('Invalid flower sequence');
  return frames;
}
// Decode incoming frames while later bytes are still downloading. Keep the
// exact 96 WebP frames; no lower-resolution preview or missing-frame substitute.
export async function readSequence(response,{onFrame}={}){
 if(!response.body?.getReader){const frames=unpackSequence(await response.arrayBuffer());if(onFrame)for(let n=0;n<frames.length;n++)await onFrame(frames[n],n);return frames;}
 const reader=response.body.getReader(),frames=[],jobs=new Set();
 let bytes=new Uint8Array(0),headerSize=null,header=null,index=0,failure;
 const consume=n=>{const part=bytes.slice(0,n);bytes=bytes.subarray(n);return part;};
 try{
  while(true){
   const {done,value}=await reader.read();
   if(done)break;
   const joined=new Uint8Array(bytes.length+value.length);joined.set(bytes);joined.set(value,bytes.length);bytes=joined;
   if(headerSize===null&&bytes.length>=4){headerSize=new DataView(consume(4).buffer).getUint32(0,true);if(headerSize>65536)throw Error('Invalid sequence header');}
   if(!header&&headerSize!==null&&bytes.length>=headerSize){
    header=JSON.parse(new TextDecoder().decode(consume(headerSize)));
    if(header.lengths?.length!==96||header.lengths.some(n=>!Number.isInteger(n)||n<=0||n>4000000))throw Error('Invalid sequence frames');
   }
   while(header&&index<96&&bytes.length>=header.lengths[index]){
    if(failure)throw failure;
    const n=index++,blob=new Blob([consume(header.lengths[n])],{type:'image/webp'});frames[n]=blob;
    if(onFrame){const task=Promise.resolve().then(()=>onFrame(blob,n)).catch(e=>{failure=e;}).finally(()=>jobs.delete(task));jobs.add(task);if(jobs.size>=4)await Promise.race(jobs);}
   }
  }
  if(index!==96||bytes.length)throw Error('Incomplete flower sequence');
  await Promise.all(jobs);if(failure)throw failure;return frames;
 }catch(error){await reader.cancel().catch(()=>{});await Promise.all(jobs);throw error;}
 finally{reader.releaseLock();}
}
export const sequenceURL=theme=>`assets/sequences-v22/${theme}/hd.bin${theme==='jasmine'?'?v=39':theme==='panzhihua'?'?v=34':''}`;
export class SequenceStore {
  constructor({fetchPack,decode}={}){
    this.packs=new Map();this.packTasks=new Map();this.sequences=new Map();this.tasks=new Map();
    this.active=null;this.queue=Promise.resolve();this.disposed=false;
    this.abort=new AbortController();
    this.fetchPack=fetchPack|| (async (theme,kind,options)=>readSequence(await cachedAsset(sequenceURL(theme),{signal:this.abort.signal}),options));
    this.decode=decode|| (blob=>createImageBitmap(blob));
  }
  prefetch(theme,onFrame){
    if(this.packs.has(theme))return Promise.resolve(this.packs.get(theme));
    if(this.packTasks.has(theme))return this.packTasks.get(theme);
    const task=this.fetchPack(theme,'hd',{onFrame}).then(frames=>{if(!this.disposed)this.packs.set(theme,frames);return frames;});
    this.packTasks.set(theme,task);
    task.catch(()=>this.packTasks.delete(theme));
    return task;
  }
  discardExcept(...keep){
    for(const [theme,frames] of this.sequences)if(!keep.includes(theme)){
      frames.forEach(frame=>frame.close());this.sequences.delete(theme);
    }
  }
  prepare(theme){
    if(this.sequences.has(theme))return Promise.resolve(this.sequences.get(theme));
    if(this.tasks.has(theme))return this.tasks.get(theme);
    const task=this.queue.catch(()=>{}).then(async()=>{
      if(this.sequences.has(theme))return this.sequences.get(theme);
      const frames=[];
      if(this.disposed)throw new Error('Disposed');
      this.discardExcept(this.active);
      let blobs;
      try{blobs=await this.prefetch(theme,async(blob,n)=>{if(this.disposed)throw Error('Disposed');frames[n]=await this.decode(blob);});}
      catch(error){frames.forEach(f=>f?.close());throw error;}
      // Serial theme preparation bounds memory to the active theme plus one incoming theme.
      // Every frame is native 960 × 720: movement never substitutes a low-resolution frame.
      let next=0,error;
      await Promise.all(Array.from({length:4},async()=>{
        while(next<blobs.length&&!error){
          const n=next++;
          try{if(!frames[n])frames[n]=await this.decode(blobs[n]);}
          catch(e){error=e;}
        }
      }));
      if(error||this.disposed){frames.forEach(f=>f?.close());throw error||new Error('Disposed');}
      this.sequences.set(theme,frames);return frames;
    });
    this.queue=task;this.tasks.set(theme,task);
    task.then(()=>this.tasks.delete(theme),()=>this.tasks.delete(theme));
    return task;
  }
  activate(theme){
    if(!this.sequences.has(theme))throw new Error('Theme is not prepared');
    this.active=theme;this.discardExcept(theme);
  }
  frame(theme,index){
    const bitmap=this.sequences.get(theme)?.[index];
    return bitmap?{bitmap,frame:index,quality:'hd'}:null;
  }
  dispose(){this.disposed=true;this.abort.abort();this.discardExcept();this.packs.clear();}
}

// Text and flower commit together. A slower, older request cannot replace a newer one.
export class ThemeTransition {
  constructor({initial=0,prepare,commit,onerror=()=>{}}){this.active=initial;this.requested=initial;this.prepare=prepare;this.commit=commit;this.onerror=onerror;this.ticket=0;}
  async select(index,direction=1){
    this.requested=index;const ticket=++this.ticket;
    try{await this.prepare(index);if(ticket!==this.ticket)return false;this.commit(index,direction);this.active=index;return true;}
    catch(error){if(ticket===this.ticket){this.requested=this.active;this.onerror(error);}return false;}
  }
}
