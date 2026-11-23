let tracker;
let delegate;
async function initialize(candidate='CPU') {
  const { cachedAsset } = await import('./asset-cache.js?v=46');
  const { FilesetResolver, HandLandmarker } = await import('./vendor/vision_bundle.mjs');
  const files = await FilesetResolver.forVisionTasks(new URL('./vendor/wasm', self.location.href).href);
  const [model,wasm]=await Promise.all([
    cachedAsset(new URL('./vendor/hand_landmarker.task',self.location.href)).then(r=>r.arrayBuffer()),
    cachedAsset(files.wasmBinaryPath).then(r=>r.arrayBuffer()),
  ]);
  const wasmURL=URL.createObjectURL(new Blob([wasm],{type:'application/wasm'}));
  try{tracker=await HandLandmarker.createFromOptions({...files,wasmBinaryPath:wasmURL},{
    canvas:new OffscreenCanvas(640,480),
    baseOptions:{modelAssetBuffer:new Uint8Array(model),delegate:candidate},
    runningMode:'VIDEO',numHands:1,
    minHandDetectionConfidence:.5,minHandPresenceConfidence:.5,minTrackingConfidence:.5,
  });
  }finally{URL.revokeObjectURL(wasmURL);}
  delegate=candidate;
}
self.onmessage=async ({data})=>{
  try {
    if(data.type==='init'){
      await initialize(data.delegate);self.postMessage({type:'ready',delegate});
    }else if(data.type==='frame'){
      const {bitmap}=data;
      try {
        const started=performance.now();
        const result=tracker.detectForVideo(bitmap,data.time);
        self.postMessage({type:'result',session:data.session,inferenceMs:performance.now()-started,
          hands:result.landmarks.map((landmarks,i)=>({landmarks,side:result.handedness[i]?.[0]?.categoryName,score:result.handedness[i]?.[0]?.score})),bitmap},[bitmap]);
      }catch(error){bitmap.close();throw error;}
    }
  }catch(error){self.postMessage({type:'error',message:error.message});}
};
