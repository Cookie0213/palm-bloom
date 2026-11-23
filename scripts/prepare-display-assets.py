"""Prepare video display assets from source footage; keep original videos untouched."""
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import binary_fill_holes
from concurrent.futures import ThreadPoolExecutor

ROOT=Path(__file__).resolve().parents[1]/'dist/assets'
cv2.setNumThreads(1)
W,H=960,720
y,x=np.mgrid[0:H,0:W]
# This backdrop is identical at every point in the whole sequence.
glow=np.clip(1-((x-480)/850)**2-((y-260)/1100)**2,0,1)[...,None]
background=np.array([240,226,211])+glow*np.array([5,5,5])

def stabilize(item):
 n,im=item
 # A foreground seed includes pink petals, neutral pale petals and dark twigs.
 lab=cv2.cvtColor(im,cv2.COLOR_RGB2LAB).astype(float)
 # Estimate the source background from its clear left/right margins, by scanline.
 left=np.median(lab[:,:140],axis=1);right=np.median(lab[:,800:],axis=1)
 left=cv2.GaussianBlur(left,(1,101),25);right=cv2.GaussianBlur(right,(1,101),25)
 mix=np.clip((x-70)/800,0,1)[...,None]
 expected=left[:,None,:]*(1-mix)+right[:,None,:]*mix
 delta=lab-expected
 seed=((delta[:,:,1]>5)|(delta[:,:,2]<-6)|(delta[:,:,0]<-25)).astype('uint8')
 # Remove isolated codec noise, keep even the fine branches.
 count,labels,stats,_=cv2.connectedComponentsWithStats(seed,8)
 keep=np.where(stats[:,cv2.CC_STAT_AREA]>18)[0];keep=keep[keep!=0]
 seed=np.isin(labels,keep).astype('uint8')
 kernel=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(19,19))
 outline=cv2.morphologyEx(seed,cv2.MORPH_CLOSE,kernel)
 mask=np.zeros((H,W),np.uint8)
 mask[cv2.dilate(outline,kernel)>0]=cv2.GC_PR_BGD
 mask[outline>0]=cv2.GC_PR_FGD
 mask[cv2.erode(seed,np.ones((3,3),np.uint8))>0]=cv2.GC_FGD
 cv2.grabCut(im,mask,None,np.zeros((1,65),np.float64),np.zeros((1,65),np.float64),3,cv2.GC_INIT_WITH_MASK)
 alpha=((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD)|(seed>0)).astype('uint8')
 alpha=cv2.morphologyEx(alpha,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(7,7)))
 # Preserve pale/translucent petal edges with a conservative soft envelope.
 # Normalize the source backdrop inside this envelope too, avoiding moving halos.
 alpha=binary_fill_holes(alpha).astype(np.float32)
 envelope=cv2.dilate(alpha,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(31,31)))
 alpha=cv2.GaussianBlur(envelope,(0,0),9)
 safe=1-cv2.dilate(envelope,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(31,31)))
 weight=cv2.GaussianBlur(safe,(0,0),65)
 source_bg=cv2.GaussianBlur(im.astype(np.float32)*safe[...,None],(0,0),65)/np.maximum(weight[...,None],.0001)
 sharp=np.array(Image.fromarray(im).filter(ImageFilter.UnsharpMask(radius=1.25,percent=85,threshold=3)))
 # The original subject residual is retained rather than cutting white petals out.
 result=np.clip(background+(sharp-source_bg)*alpha[...,None],0,255).astype('uint8')
 out=ROOT/'xinyi/stable-v3';out.mkdir(exist_ok=True)
 Image.fromarray(result).save(out/f'{n:03d}.webp',lossless=True)
 return n

def prepare_xinyi():
 cap=cv2.VideoCapture(str(ROOT/'xinyi/original.mp4'))
 items=[]
 for n in range(96):
  cap.set(cv2.CAP_PROP_POS_MSEC,(n+.5)/9.6*1000)
  ok,bgr=cap.read()
  if not ok: raise RuntimeError(f'Unable to decode frame {n}')
  im=cv2.cvtColor(bgr,cv2.COLOR_BGR2RGB)[:,160:1120]
  items.append((n+1,im))
 cap.release()
 with ThreadPoolExecutor(max_workers=4) as pool:
  for n in pool.map(stabilize,items):
   if n%24==0:print('stabilized',n,flush=True)

# Twelve native-resolution frames per sheet: eight requests instead of 96.
# Runtime keeps at most three sheets decoded across ALL themes.
def atlases():
 for key,src in [('daylily',ROOT/'frames'),('xinyi',ROOT/'xinyi/stable-v3'),('lotus',ROOT/'lotus/stable-v2')]:
  for width,height,size in [(960,720,'hd'),(600,450,'small')]:
   out=ROOT/'display-v21'/key/size;out.mkdir(parents=True,exist_ok=True)
   for sheet in range(8):
    atlas=Image.new('RGB',(width*4,height*3))
    for tile in range(12):
     im=Image.open(src/f'{sheet*12+tile+1:03d}.webp').convert('RGB')
     if im.size!=(width,height):im=im.resize((width,height),Image.Resampling.LANCZOS)
     atlas.paste(im,((tile%4)*width,(tile//4)*height))
    atlas.save(out/f'{sheet}.webp',quality=95,method=5)
   im=Image.open(src/'096.webp').convert('RGB').resize((width,height),Image.Resampling.LANCZOS)
   im.save(out/'poster.webp',quality=95,method=5)
  print('atlases ready',key,flush=True)

if __name__=='__main__':
 prepare_xinyi();atlases()
