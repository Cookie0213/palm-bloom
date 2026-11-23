// Only immutable local animation/model assets use this cache. Bump the name if
// bytes at an existing asset URL change. Cache denial/quota never blocks playback.
const cacheName='palmbloom-media-v46';
export async function cachedAsset(input,{signal}={}){
 const url=new URL(input,import.meta.url).href;
 let cache;
 try{cache=await globalThis.caches?.open(cacheName);const hit=await cache?.match(url);if(hit)return hit;}catch{}
 const response=await fetch(url,{signal});
 if(!response.ok)throw new Error(`Asset load failed (${response.status})`);
 if(cache)cache.put(url,response.clone()).catch(()=>{});
 return response;
}
