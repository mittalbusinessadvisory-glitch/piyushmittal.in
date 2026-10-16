"""Build personal-brand images that match the website.

Usage: python tools/build_brand_assets.py
Outputs to brand/:
  linkedin-banner.png   1584x396  LinkedIn profile background
  linkedin-post-cover.png 1200x627  cover for LinkedIn posts that share an article/site link
  profile-square.png    800x800   profile picture with brand background (for WhatsApp, Google profile, etc.)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'src' / 'static' / 'assets'
OUT = ROOT / 'brand'
OUT.mkdir(exist_ok=True)
FONTS = Path('C:/Windows/Fonts')
PAPER, INK, GREEN, MUTED, WARM, MINT = (245, 242, 234), (21, 20, 15), (30, 77, 58), (97, 93, 82), (184, 83, 47), (214, 227, 217)

serif = lambda s: ImageFont.truetype(str(FONTS / 'georgia.ttf'), s)
serif_i = lambda s: ImageFont.truetype(str(FONTS / 'georgiai.ttf'), s)
sans = lambda s: ImageFont.truetype(str(FONTS / 'seguisb.ttf'), s)
sans_r = lambda s: ImageFont.truetype(str(FONTS / 'segoeui.ttf'), s)


def grid(d, box, step, color):
    x0, y0, x1, y1 = box
    for x in range(x0, x1, step):
        d.line([(x, y0), (x, y1)], fill=color, width=1)
    for y in range(y0, y1, step):
        d.line([(x0, y), (x1, y)], fill=color, width=1)


# 1. LinkedIn banner. The profile photo covers the bottom-left (desktop) and the
#    centre-left (mobile), so the message sits on the right half.
W, H = 1584, 396
img = Image.new('RGB', (W, H), INK)
d = ImageDraw.Draw(img)
grid(d, (0, 0, W, H), 44, (33, 32, 26))
d.rectangle([0, H - 8, W, H], fill=GREEN)
x = 640
d.text((x, 70), 'BUSINESS GROWTH + AI SOLUTIONS', font=sans(20), fill=(156, 197, 174))
d.text((x - 3, 98), 'I find what holds a business back', font=serif(46), fill=PAPER)
d.text((x - 3, 156), 'and build the fix.', font=serif_i(46), fill=(232, 196, 168))
d.text((x, 236), 'Strategy  ·  Websites  ·  SEO & marketing  ·  AI automation', font=sans_r(22), fill=(169, 164, 150))
d.rounded_rectangle([x, 292, x + 300, 336], radius=22, fill=PAPER)
d.text((x + 150, 314), 'www.piyushmittal.in', font=sans(20), fill=INK, anchor='mm')
d.text((x + 322, 314), 'Free 30-minute strategy call', font=sans_r(20), fill=(169, 164, 150), anchor='lm')
img.save(OUT / 'linkedin-banner.png', optimize=True)

# 2. LinkedIn post cover (link posts / featured section)
W, H = 1200, 627
img = Image.new('RGB', (W, H), PAPER)
d = ImageDraw.Draw(img)
d.rectangle([0, 0, 14, H], fill=GREEN)
d.rounded_rectangle([70, 64, 124, 118], radius=12, fill=INK)
d.text((97, 91), 'PM', font=serif(24), fill=PAPER, anchor='mm')
d.text((140, 91), 'Piyush Mittal', font=sans(22), fill=INK, anchor='lm')
d.text((70, 200), 'FREE 2-MINUTE TOOL', font=sans(20), fill=GREEN)
d.text((66, 236), 'How healthy is your', font=serif(70), fill=INK)
d.text((66, 318), 'business, really?', font=serif_i(70), fill=GREEN)
d.text((70, 430), 'Answer 8 questions. Get a growth score and the two', font=sans_r(26), fill=MUTED)
d.text((70, 466), 'areas worth fixing first.', font=sans_r(26), fill=MUTED)
d.rounded_rectangle([70, 530, 470, 580], radius=25, fill=INK)
d.text((270, 555), 'piyushmittal.in/#health-check', font=sans(20), fill=PAPER, anchor='mm')
# score ring on the right: the "?" invites people to find their own number
cx, cy, r = 930, 330, 170
d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(225, 219, 205), width=26)
d.arc([cx - r, cy - r, cx + r, cy + r], start=-90, end=150, fill=GREEN, width=26)
d.text((cx, cy - 18), '?', font=serif(130), fill=INK, anchor='mm')
d.text((cx, cy + 70), 'out of 100', font=sans_r(24), fill=MUTED, anchor='mm')
img.save(OUT / 'linkedin-post-cover.png', optimize=True)

# 3. Square profile picture on a brand background
S = 800
photo = Image.open(ASSETS / 'piyush-mittal.jpg').convert('RGB')
head = photo.crop((60, 0, 460, 400)).resize((S, S), Image.LANCZOS)
bg = Image.new('RGB', (S, S), GREEN)
mask = Image.new('L', (S, S), 0)
ImageDraw.Draw(mask).ellipse([0, 0, S, S], fill=255)
bg.paste(head, (0, 0), mask.filter(ImageFilter.GaussianBlur(1)))
bg.save(OUT / 'profile-square.png', optimize=True)

for f in sorted(OUT.glob('*.png')):
    print(f.name, Image.open(f).size, f.stat().st_size // 1024, 'KB')
