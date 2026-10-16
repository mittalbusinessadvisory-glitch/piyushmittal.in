"""Generate responsive image variants for the site.

Usage: python tools/build_images.py

For every source JPEG in src/static/assets/img (and the portrait), writes
<name>-<width>.avif / .webp / .jpg at 480, 800 and 1200 px (never upscaling).
The 1200 px JPEG without a suffix stays as the source and the share-image URL.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / 'src' / 'static' / 'assets'
WIDTHS = (480, 800, 1200)
SOURCES = [p for p in (ROOT / 'img').glob('*.jpg') if not p.stem.split('-')[-1].isdigit()]
SOURCES.append(ROOT / 'piyush-mittal.jpg')

for src in SOURCES:
    im = Image.open(src).convert('RGB')
    for w in WIDTHS:
        if w > im.width:
            continue
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS) if w != im.width else im
        base = src.with_name(f'{src.stem}-{w}')
        r.save(base.with_suffix('.avif'), quality=55, speed=6)
        r.save(base.with_suffix('.webp'), quality=74, method=6)
        r.save(base.with_suffix('.jpg'), quality=78, optimize=True, progressive=True)
    print(src.name, im.size)
