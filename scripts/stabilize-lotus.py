# Extract the flower from each uploaded video frame and use one unchanging backdrop.
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import numpy as np
import cv2
from scipy.ndimage import binary_fill_holes
cv2.setNumThreads(1)
root=Path(__file__).resolve().parents[1]/'dist/assets/lotus'
out=root/'stable-v2'; small=root/'stable-small-v2';out.mkdir(exist_ok=True);small.mkdir(exist_ok=True)
y,x=np.mgrid[0:720,0:960];glow=np.maximum(0,1-((x-480)/720)**2-((y-260)/1000)**2)[...,None]
bg=np.clip(np.array([239,222,204])+glow*np.array([9,8,8]),0,255).astype(np.float32)
def process(p):
 im=np.array(Image.open(p).convert('RGB'));h,s,v=cv2.cvtColor(im,cv2.COLOR_RGB2HSV).transpose(2,0,1)
 seed=((h>155)&(s>32))|((h>24)&(h<92)&(s>75))|((h<35)&(s>60))
 seed=seed.astype('uint8');kernel=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(31,31));outline=cv2.morphologyEx(seed,cv2.MORPH_CLOSE,kernel)
 mask=np.zeros(seed.shape,'uint8');mask[cv2.dilate(outline,kernel)>0]=cv2.GC_PR_BGD;mask[outline>0]=cv2.GC_PR_FGD
 mask[cv2.erode(seed,np.ones((5,5),'uint8'))>0]=cv2.GC_FGD
 cv2.grabCut(im,mask,None,np.zeros((1,65),np.float64),np.zeros((1,65),np.float64),2,cv2.GC_INIT_WITH_MASK)
 silhouette=((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD)|(seed>0)).astype('uint8')
 silhouette=cv2.morphologyEx(silhouette,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(41,41)))
 count,labels,stats,_=cv2.connectedComponentsWithStats(silhouette,8)
 silhouette=(labels==(1+np.argmax(stats[1:,cv2.CC_STAT_AREA]))).astype('uint8')
 alpha=binary_fill_holes(silhouette).astype(np.float32)
 alpha=cv2.GaussianBlur(alpha,(3,3),.5)
 comp=Image.fromarray(np.clip(im*alpha[...,None]+bg*(1-alpha[...,None]),0,255).astype('uint8'))
 comp.save(out/p.name,lossless=True);comp.resize((600,450),Image.Resampling.LANCZOS).save(small/p.name,lossless=True)
with ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(process, sorted((root/'frames').glob('*.webp'))))
print('192 frames ready, with one fixed backdrop and lossless encoding.')
