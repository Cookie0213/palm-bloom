"""640x480 frames for the five small homepage panels, from the current corrected HD packs."""
from pathlib import Path
from PIL import Image
import struct,json,io
root=Path(__file__).resolve().parents[1]/'dist/assets'
out=root/'home-sequences-v42';out.mkdir(exist_ok=True)
for key in ['daylily','xinyi','lotus','jasmine','panzhihua']:
 raw=(root/'sequences-v22'/key/'hd.bin').read_bytes();size=struct.unpack('<I',raw[:4])[0];meta=json.loads(raw[4:4+size]);offset=4+size;frames=[]
 for length in meta['lengths']:
  im=Image.open(io.BytesIO(raw[offset:offset+length]));offset+=length
  im=im.resize((640,480),Image.Resampling.LANCZOS);b=io.BytesIO();im.save(b,format='WEBP',quality=94,method=5);frames.append(b.getvalue())
 header=json.dumps({'width':640,'height':480,'lengths':[len(f) for f in frames]},separators=(',',':')).encode()
 (out/(key+'.bin')).write_bytes(struct.pack('<I',len(header))+header+b''.join(frames))
 print(key, sum(map(len,frames)),flush=True)
