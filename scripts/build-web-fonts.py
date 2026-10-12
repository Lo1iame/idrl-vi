"""Make WOFF2 preview subsets; original fonts remain available for design assets."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
root=Path(__file__).resolve().parents[1]
folder=root/'assets/brand/fonts'
text=''.join(p.read_text(encoding='utf-8') for d in ['src','docs/design'] for p in (root/d).rglob('*') if p.suffix in ['.tsx','.ts','.md','.html'])
text+=''.join(chr(c) for c in range(32,127))+'，。！？：；（）【】《》“”‘’、—…·智能设计与鲁棒学习'
for weight in ['Regular','Bold']:
 font=TTFont(folder/f'NotoSansCJKsc-{weight}.otf',recalcTimestamp=False)
 options=subset.Options(); options.flavor='woff2'; options.recommended_glyphs=True
 sub=subset.Subsetter(options=options); sub.populate(text=text); sub.subset(font)
 font.flavor='woff2';font.save(folder/f'NotoSansCJKsc-{weight}-web.woff2')
font=TTFont(folder/'InterVariable.ttf',recalcTimestamp=False);font.flavor='woff2';font.save(folder/'InterVariable.woff2')
print([(p.name,p.stat().st_size) for p in folder.glob('*.woff2')])
