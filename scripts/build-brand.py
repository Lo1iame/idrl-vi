"""Build review SVG assets from the original AI PDF paths and licensed fonts."""
from pathlib import Path
from urllib.request import urlretrieve
from html import escape
import json
from pypdf import PdfReader
from pypdf.generic import ContentStream
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from fontTools.svgLib.path import parse_path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/brand'
FONTS = OUT / 'fonts'
LOGOS = OUT / 'logo'
for d in [FONTS, LOGOS]: d.mkdir(parents=True, exist_ok=True)
downloads = {
 'InterVariable.ttf': 'https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/InterVariable.ttf',
 'Inter-LICENSE.txt': 'https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt',
 'NotoSansCJKsc-Regular.otf': 'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf',
 'NotoSansCJKsc-Bold.otf': 'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Bold.otf',
 'Noto-LICENSE.txt': 'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/LICENSE',
}
for name, url in downloads.items():
 if not (FONTS / name).exists(): urlretrieve(url, FONTS / name)
(FONTS / 'sources.json').write_text(json.dumps(downloads, indent=2), encoding='utf-8')

reader = PdfReader(ROOT / 'logo/IDRL logo 源文件.ai')
ops = ContentStream(reader.pages[0].get_contents(), reader).operations
entries, path, matrix = [], [], (1,0,0,1,0,0)
for args, op in ops:
 if op == b'cm': matrix = tuple(float(x) for x in args)
 elif op in [b'm', b'l', b'c', b'h']:
  command = {b'm':'M',b'l':'L',b'c':'C',b'h':'Z'}[op]
  path.append(command + ' '.join(str(x) for x in args))
 elif op in [b'f',b'f*']:
  entries.append((' '.join(path), matrix)); path = []
  if len(entries) == 11: break
 elif op == b'n': path = []
assert len(entries) == 11
colors = ['#56c0e5','#203663','#56c0e5','#236db9','#236db9','#203663']
def source_group(items, fills):
 bounds = []
 parts = []
 for (d,m), fill in zip(items, fills):
  pen = BoundsPen(None); parse_path(d, TransformPen(pen,m)); bounds.append(pen.bounds)
  parts.append(f'<path fill="{fill}" d="{d}" transform="matrix({" ".join(map(str,m))})"/>')
 x0=min(b[0] for b in bounds); y0=min(b[1] for b in bounds)
 x1=max(b[2] for b in bounds); y1=max(b[3] for b in bounds)
 return f'<g transform="translate({-x0} {y1}) scale(1 -1)">{"".join(parts)}</g>', x1-x0, y1-y0
symbol, sw, sh = source_group(entries[:6], colors)
word, ww, wh = source_group(entries[6:], ['#203663']*5)
def fit(group, w,h,x,y,width):
 return f'<g transform="translate({x} {y}) scale({width/w})">{group}</g>'
def outline(text, fontname, size, x, y, fill='#203663'):
 font=TTFont(FONTS/fontname); glyphs=font.getGlyphSet(); cmap=font.getBestCmap(); units=font['head'].unitsPerEm
 parts=[]; cursor=0
 for ch in text:
  name=cmap[ord(ch)]; pen=SVGPathPen(glyphs); glyphs[name].draw(pen)
  parts.append(f'<path d="{pen.getCommands()}" transform="translate({cursor} 0)"/>')
  cursor += font['hmtx'][name][0]
 return f'<g fill="{fill}" transform="translate({x} {y}) scale({size/units} {-size/units})">{"".join(parts)}</g>'
def save(name,width,height,body,label):
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img"><title>{escape(label)}</title>{body}</svg>'
 (LOGOS / f'{name}.svg').write_text(svg,encoding='utf-8')
save('symbol-color',sw,sh,symbol,'IDRL 图形标志')
save('symbol-navy',sw,sh,symbol.replace('#56c0e5','#203663').replace('#236db9','#203663'),'IDRL 单色图形')
save('symbol-white',sw,sh,symbol.replace('#56c0e5','#ffffff').replace('#236db9','#ffffff').replace('#203663','#ffffff'),'IDRL 白色图形')
reverse_symbol = symbol.replace('#203663','#8fb8dc')
save('symbol-color-reverse',sw,sh,reverse_symbol,'IDRL 深色底彩色图形')
save('lockup-idrl',600,180,fit(symbol,sw,sh,24,26,228)+fit(word,ww,wh,290,51,284),'IDRL')
save('lockup-idrl-reverse',600,180,fit(reverse_symbol,sw,sh,24,26,228)+fit(word.replace('#203663','#ffffff'),ww,wh,290,51,284),'IDRL 深色底字标')
zh='智能设计与鲁棒学习'; en='Intelligent Design and Robust Learning'
save('lockup-zh',800,180,fit(symbol,sw,sh,24,34,200)+outline(zh,'NotoSansCJKsc-Bold.otf',49,264,113),zh)
save('lockup-en',900,180,fit(symbol,sw,sh,24,26,228)+outline('Intelligent Design','InterVariable.ttf',39,290,77)+outline('and Robust Learning','InterVariable.ttf',39,290,130),en)
bi=fit(symbol,sw,sh,24,26,228)+outline(zh,'NotoSansCJKsc-Bold.otf',42,290,91)+outline(en,'InterVariable.ttf',22,290,132)
save('lockup-bilingual',850,180,bi,zh+' / '+en)
reverse_bi=fit(reverse_symbol,sw,sh,24,26,228)+outline(zh,'NotoSansCJKsc-Bold.otf',42,290,91,'#ffffff')+outline(en,'InterVariable.ttf',22,290,132,'#ffffff')
save('lockup-bilingual-reverse',850,180,reverse_bi,zh+' / '+en)
save('lockup-stacked',560,380,fit(symbol,sw,sh,160,20,240)+fit(word,ww,wh,198,193,164)+outline(zh,'NotoSansCJKsc-Bold.otf',29,149,298)+outline(en,'InterVariable.ttf',20,98,340),zh+' / '+en)
print(json.dumps({'logos':len(list(LOGOS.glob('*.svg'))),'source':'AI page 1, first 11 filled paths','symbol':[sw,sh],'wordmark':[ww,wh]},ensure_ascii=False))
