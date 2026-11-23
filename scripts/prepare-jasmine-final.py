"""Prepare the final 720p jasmine clip in a fixed 4:3 composition."""
from pathlib import Path
import io,json,struct,subprocess,tempfile,shutil,sys
from PIL import Image,ImageFilter
root=Path(__file__).resolve().parents[1]/'dist/assets'
source=Path(sys.argv[1]);out=root/'jasmine'
if source.resolve() != (out/'source-final.mp4').resolve():
 shutil.copyfile(source,out/'source-final.mp4')
# Offline luma-only sharpening preserves colour and avoids runtime GPU/CPU filters.
# Two restrained radii clarify petal edges without invented detail or per-frame AI.
clarity='unsharp=7:7:0.8:3:3:0,unsharp=3:3:0.35:3:3:0'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(source),'-an','-vf',clarity,'-c:v','libx264','-crf','16','-preset','slow','-pix_fmt','yuv420p','-movflags','+faststart',str(out/'original-v39.mp4')],check=True)
with tempfile.TemporaryDirectory() as temp:
 subprocess.run(['ffmpeg','-v','error','-ss','2.2','-i',str(source),'-vf','fps=96/7.1,'+clarity,'-frames:v','96',temp+'/%03d.png'],check=True)
 paths=sorted(Path(temp).glob('*.png'));assert len(paths)==96
 def composition(im):
  return im.convert('RGB').crop((160,0,1120,720))
 frames=[]
 for path in paths:
  frame=composition(Image.open(path))
  data=io.BytesIO();frame.save(data,format='WEBP',quality=98,method=5);frames.append(data.getvalue())
 header=json.dumps({'width':960,'height':720,'lengths':list(map(len,frames))},separators=(',',':')).encode()
 (root/'sequences-v22/jasmine/hd.bin').write_bytes(struct.pack('<I',len(header))+header+b''.join(frames))
 for kind,size in [('hd',(960,720)),('small',(480,360))]:
  folder=root/'display-v39/jasmine'/kind;folder.mkdir(parents=True,exist_ok=True)
  Image.open(io.BytesIO(frames[-1])).resize(size,Image.Resampling.LANCZOS).save(folder/'poster.webp',quality=98)
 triptych=Image.new('RGB',(1584,990),(235,221,201))
 for col,idx in enumerate([0,47,95]):
  closeup=Image.open(paths[idx]).convert('RGB').crop((705,100,1005,370)).resize((528,475),Image.Resampling.LANCZOS)
  triptych.paste(closeup,(528*col,225))
 triptych.save(root/'culture-stages/jasmine-single-v39.webp',quality=98)
 print('Prepared 96 fixed 960x720 frames, matching posters and a three-stage close-up.',sum(map(len,frames)))
