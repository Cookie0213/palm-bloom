"""Prepare the fifth exhibit from the uploaded 720p clip, without upscaling.

A fixed 90% framing adds headroom and lowers the branch in the same 4:3 stage.
All 96 frames and posters share the transform; the top background extension is
static. No petal segmentation, frame blending, or animated zoom is introduced.
"""
from pathlib import Path
import sys, shutil, subprocess, tempfile, json, struct, io
from PIL import Image, ImageFilter

root = Path(__file__).resolve().parents[1] / 'dist/assets'
out = root / 'panzhihua'
out.mkdir(parents=True, exist_ok=True)
interaction_only = '--interaction-only' in sys.argv
if not interaction_only:
    shutil.copyfile(sys.argv[1], out / 'source-original.mp4')
    # H.264 makes optional standalone playback portable across Chrome and Edge.
    subprocess.run(['ffmpeg','-v','error','-y','-i',sys.argv[1],'-an','-c:v','libx264',
                    '-crf','16','-preset','slow','-pix_fmt','yuv420p','-movflags','+faststart',
                    str(out/'original.mp4')],check=True)
with tempfile.TemporaryDirectory() as temp:
    subprocess.run(['ffmpeg','-v','error','-ss','1.8','-i',sys.argv[1],'-vf',
                    'fps=96/5','-frames:v','96',temp+'/%03d.png'],check=True)
    paths=sorted(Path(temp).glob('*.png'))
    assert len(paths)==96
    # Original view was a 960px-wide center crop. Scale the source to 90%,
    # retain more of both sides, then lower it by 81px (+45px at its center).
    def reframe(image):
        return image.convert('RGB').resize((1152,648),Image.Resampling.LANCZOS).crop((96,0,1056,648))
    first=reframe(Image.open(paths[0]))
    background=first.crop((0,0,960,40)).resize((960,1),Image.Resampling.BOX).resize((960,81)).filter(ImageFilter.GaussianBlur(80))
    frames=[]
    for path in paths:
        frame=Image.new('RGB',(960,720))
        frame.paste(background,(0,0))
        frame.paste(reframe(Image.open(path)),(0,81))
        encoded=io.BytesIO()
        frame.save(encoded,format='WEBP',quality=96,method=5)
        frames.append(encoded.getvalue())
    header=json.dumps({'width':960,'height':720,'lengths':list(map(len,frames))},separators=(',',':')).encode()
    pack=root/'sequences-v22/panzhihua'
    pack.mkdir(parents=True,exist_ok=True)
    (pack/'hd.bin').write_bytes(struct.pack('<I',len(header))+header+b''.join(frames))
    for kind,size in [('hd',(960,720)),('small',(480,360))]:
        poster=root/'display-v21/panzhihua'/kind
        poster.mkdir(parents=True,exist_ok=True)
        Image.open(io.BytesIO(frames[-1])).resize(size,Image.Resampling.LANCZOS).save(poster/'poster.webp',quality=96)
    if not interaction_only:
        # A fixed close-up of the same right blossom, with ample margin for its petals.
        # Each frame keeps its original proportions; the full blossom is never clipped.
        triptych=Image.new('RGB',(1584,990),(247,215,194))
        for column,index in enumerate([0,47,95]):
            blossom=Image.open(paths[index]).crop((620,200,950,700))
            blossom=blossom.resize((528,800),Image.Resampling.LANCZOS)
            triptych.paste(blossom,(column*528,95))
        triptych.save(root/'culture-stages/panzhihua-v33.webp',quality=96)
    print('Panzhihua:',len(frames),'fixed 960x720 frames;',sum(map(len,frames)),'bytes')
