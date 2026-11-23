"""Build a matching closer poster and single-blossom triptych from existing media.
Does not re-encode the interactive sequence or alter the uploaded original.
"""
from pathlib import Path
import io, json, struct, subprocess, tempfile
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'dist/assets'
raw = (root / 'sequences-v22/jasmine/hd.bin').read_bytes()
header_size = struct.unpack('<I', raw[:4])[0]
meta = json.loads(raw[4:4 + header_size])
offset = 4 + header_size + sum(meta['lengths'][:-1])
last = Image.open(io.BytesIO(raw[offset:])).convert('RGB')
# Match app.js's constant 4:3 crop on all interactive frames.
poster = last.crop((150, 50, 990, 680))
for name, size in [('hd', (960, 720)), ('small', (480, 360))]:
    folder = root / 'display-v31/jasmine' / name
    folder.mkdir(parents=True, exist_ok=True)
    poster.resize(size, Image.Resampling.LANCZOS).save(folder / 'poster.webp', quality=96)

# Use the full-resolution original for editorial close-ups. A fixed crop tracks
# the SAME upper blossom without changing its shape, angle, or background.
triptych = Image.new('RGB', (1584, 990))
with tempfile.TemporaryDirectory() as temp:
    for column, index in enumerate([0, 47, 95]):
        output = Path(temp) / f'{index}.png'
        subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(1.25 + index * 5.75 / 96),
                        '-i', str(root / 'jasmine/original.mp4'), '-frames:v', '1',
                        '-update', '1', str(output)], check=True)
        # 1080p coordinates, equivalent to x596..772 / y0..330 in the HD pack.
        # The lower edge excludes neighboring blossoms in all three states.
        blossom = Image.open(output).convert('RGB').crop((894, 0, 1158, 495))
        triptych.paste(blossom.resize((528, 990), Image.Resampling.LANCZOS), (528 * column, 0))
triptych.save(root / 'culture-stages/jasmine-single-v31.webp', quality=96)
print('Built jasmine closer posters and three stages of one blossom.')
