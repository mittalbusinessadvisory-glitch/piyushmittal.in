"""Build the self-hosted web fonts in src/static/assets/fonts.

Usage: python tools/build_fonts.py <folder with the Google Fonts variable TTFs>

Sources (SIL Open Font License), from https://github.com/google/fonts:
  ofl/fraunces/Fraunces[SOFT,WONK,opsz,wght].ttf          -> Fraunces.ttf
  ofl/fraunces/Fraunces-Italic[SOFT,WONK,opsz,wght].ttf   -> Fraunces-Italic.ttf
  ofl/inter/Inter[opsz,wght].ttf                           -> Inter.ttf

Each font is pinned to the axes the site uses, limited to the weights in the CSS,
subset to Latin plus the punctuation and symbols the copy needs, and saved as WOFF2.
"""
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / 'src' / 'static' / 'assets' / 'fonts'
OUT.mkdir(parents=True, exist_ok=True)

# Basic Latin, Latin-1, dashes/quotes/ellipsis, rupee, arrows, multiplication sign, check mark
UNICODES = '0020-007E,00A0-00FF,2010-2027,2030-203A,20B9,2190-2193,00D7,2713,2122'

FONTS = [
    ('Fraunces.ttf', 'fraunces.woff2', {'opsz': 72, 'SOFT': 0, 'WONK': 0, 'wght': (300, 500)}),
    ('Fraunces-Italic.ttf', 'fraunces-italic.woff2', {'opsz': 72, 'SOFT': 0, 'WONK': 0, 'wght': (300, 400)}),
    ('Inter.ttf', 'inter.woff2', {'opsz': 14, 'wght': (400, 600)}),
]

for src, dst, axes in FONTS:
    font = TTFont(SRC / src)
    options = subset.Options()
    options.layout_features = ['kern', 'liga', 'calt', 'tnum', 'lnum', 'pnum', 'case']
    options.name_IDs = ['*']
    options.notdef_outline = True
    sub = subset.Subsetter(options)
    sub.populate(unicodes=subset.parse_unicodes(UNICODES))
    sub.subset(font)  # subset first: instancing first breaks gvar on the italic
    font = instancer.instantiateVariableFont(font, axes)
    font.flavor = 'woff2'
    font.save(OUT / dst)
    print(f'{dst}: {(OUT / dst).stat().st_size / 1024:.1f} KB')
