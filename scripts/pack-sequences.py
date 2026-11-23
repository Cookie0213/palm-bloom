"""One request per complete 96-frame sequence, with a small complete preview."""
from pathlib import Path
from PIL import Image
import io,json,struct
root=Path(__file__).resolve().parents[1]/'dist/assets'
for theme,folder in [('daylily','frames'),('xinyi','xinyi/stable-v3'),('lotus','lotus/stable-v2')]:
 out=root/'sequences-v22'/theme;out.mkdir(parents=True,exist_ok=True)
 for kind,size,quality in [('preview',(320,240),82),('hd',(960,720),94)]:
  frames=[]
  for n in range(1,97):
   im=Image.open(root/folder/f'{n:03d}.webp').convert('RGB')
   if im.size!=size:im=im.resize(size,Image.Resampling.LANCZOS)
   b=io.BytesIO();im.save(b,format='WEBP',quality=quality,method=5);frames.append(b.getvalue())
  header=json.dumps({'width':size[0],'height':size[1],'lengths':[len(b) for b in frames]},separators=(',',':')).encode()
  blob=struct.pack('<I',len(header))+header+b''.join(frames)
  (out/f'{kind}.bin').write_bytes(blob)
  print(theme,kind,len(blob),flush=True)
