"""Build the 1200x630 social share image (src/static/assets/og-image.jpg).

Usage: python tools/build_og.py   (uses Windows fonts Georgia and Segoe UI)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent / 'src' / 'static' / 'assets'
FONTS = Path('C:/Windows/Fonts')
PAPER, INK, GREEN, MUTED = (245, 242, 234), (21, 20, 15), (30, 77, 58), (97, 93, 82)

W, H = 1200, 630
img = Image.new('RGB', (W, H), PAPER)
d = ImageDraw.Draw(img)

# Photo panel on the right, cropped to the head and shoulders
photo = Image.open(ROOT / 'piyush-mittal.jpg').convert('RGB')
panel_w = 440
crop = photo.crop((40, 20, 480, 20 + round(440 * H / panel_w)))
crop = crop.resize((panel_w, H), Image.LANCZOS)
img.paste(crop, (W - panel_w, 0))
d.rectangle([W - panel_w - 6, 0, W - panel_w, H], fill=GREEN)

serif = lambda s: ImageFont.truetype(str(FONTS / 'georgia.ttf'), s)
serif_i = lambda s: ImageFont.truetype(str(FONTS / 'georgiai.ttf'), s)
sans = lambda s: ImageFont.truetype(str(FONTS / 'seguisb.ttf'), s)

# Monogram
d.rounded_rectangle([64, 64, 120, 120], radius=12, fill=INK)
d.text((92, 93), 'PM', font=serif(24), fill=PAPER, anchor='mm')
d.text((136, 92), 'piyushmittal.in', font=sans(22), fill=INK, anchor='lm')

d.text((64, 220), 'BUSINESS GROWTH + AI SOLUTIONS', font=sans(20), fill=GREEN)
d.text((60, 250), 'Piyush Mittal', font=serif(84), fill=INK)

lines = ['I understand business problems,', 'identify opportunities, and use AI', 'to turn ideas into practical solutions.']
for i, line in enumerate(lines):
    d.text((64, 380 + i * 40), line, font=serif_i(30), fill=MUTED)

d.rectangle([0, H - 14, W - panel_w - 6, H], fill=GREEN)
img.save(ROOT / 'og-image.jpg', quality=86, optimize=True, progressive=True)
print('og-image.jpg', (ROOT / 'og-image.jpg').stat().st_size // 1024, 'KB')
