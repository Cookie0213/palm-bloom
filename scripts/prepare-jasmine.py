"""Prepare fourth theme from the supplied 1080p video; originals stay untouched.
96 full-quality 1280x720 frames, no crop, segmentation or background replacement.
Usage: python scripts/prepare-jasmine.py /absolute/source.mp4
"""
from pathlib import Path
import sys, shutil, subprocess, tempfile, json, struct, io
from PIL import Image

root=Path(__file__).resolve().parents[1]/'dist/assets'
out=root/'jasmine'; out.mkdir(parents=True,exist_ok=True)
shutil.copyfile(sys.argv[1],out/'original.mp4')
with tempfile.TemporaryDirectory() as temp:
    # Skip the initial still hold and final open hold; map control across the opening interval.
    subprocess.run(['ffmpeg','-v','error','-ss','1.25','-i',str(out/'original.mp4'),'-vf',
        'fps=96/5.75,scale=1280:720:flags=lanczos','-frames:v','96','-c:v','libwebp',
        '-quality','96','-compression_level','5',temp+'/%03d.webp'],check=True)
    paths=sorted(Path(temp).glob('*.webp')); assert len(paths)==96
    frames=[p.read_bytes() for p in paths]
    header=json.dumps({'width':1280,'height':720,'lengths':list(map(len,frames))},separators=(',',':')).encode()
    pack=root/'sequences-v22/jasmine'; pack.mkdir(parents=True,exist_ok=True)
    (pack/'hd.bin').write_bytes(struct.pack('<I',len(header))+header+b''.join(frames))
    for kind,size in [('hd',(1280,720)),('small',(640,360))]:
        poster=root/'display-v21/jasmine'/kind;poster.mkdir(parents=True,exist_ok=True)
        Image.open(paths[-1]).resize(size,Image.Resampling.LANCZOS).save(poster/'poster.webp',quality=96)
    # Side-by-side exact video frames; each plant is fully visible, never stretched.
    triptych=Image.new('RGB',(1584,990),(245,216,194))
    for n,idx in enumerate([0,47,95]):
        # Trim only empty side background in the editorial preview, retaining
        # every leaf and flower. Interactive frames above remain uncropped.
        im=Image.open(paths[idx]).crop((200,0,960,720)).resize((528,500),Image.Resampling.LANCZOS)
        triptych.paste(im,(n*528,245))
    triptych.save(root/'culture-stages/jasmine-v29.webp',quality=94)
    print('Jasmine ready:',len(frames),'frames;',sum(map(len,frames)),'bytes')
