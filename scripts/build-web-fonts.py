"""Make WOFF2 preview subsets; original fonts remain available for design assets.

默认行为：从本仓库 src/ 与 docs/design/ 的文案构建中文子集（VI 演示用）。
其他应用可传入自身文案构建子集：

    python scripts/build-web-fonts.py --crawl-dir /path/to/app/src --text-file copy.md

注意：子集只覆盖传入文本中出现的字符。动态内容（用户名、数据库文案等）
无法预先枚举，这类应用应改用系统 CJK 字体栈回退（见 DESIGN.md「字体」）。
"""
from pathlib import Path
import argparse
from fontTools import subset
from fontTools.ttLib import TTFont
root=Path(__file__).resolve().parents[1]
folder=root/'assets/brand/fonts'
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--crawl-dir',action='append',default=[],
    help='递归收集该目录下源码/文档文案的目录，可重复')
parser.add_argument('--text-file',action='append',default=[],
    help='额外纳入子集的纯文本/文案文件，可重复')
args=parser.parse_args()
crawl_dirs=[Path(d) for d in args.crawl_dir]
if not crawl_dirs and not args.text_file:
    crawl_dirs=[root/'src',root/'docs/design']
extensions={'.tsx','.ts','.jsx','.js','.md','.html','.css','.json'}
source_files=[]
for directory in crawl_dirs:
    if not directory.is_dir():
        parser.error(f'源码目录不存在或不是目录：{directory}')
    files=sorted(p for p in directory.rglob('*') if p.is_file() and p.suffix.lower() in extensions)
    if not files:
        parser.error(f'源码目录中没有支持的文件：{directory}')
    source_files.extend(files)
for tf in args.text_file:
    file=Path(tf)
    if not file.is_file():
        parser.error(f'文案文件不存在或不是文件：{file}')
    source_files.append(file)
try:
    text=''.join(p.read_text(encoding='utf-8-sig') for p in source_files)
except (OSError,UnicodeError) as error:
    parser.error(f'无法读取源码或文案：{error}')
if not text.strip():
    parser.error('源码和文案为空；不会覆盖现有字体子集')
text+=''.join(chr(c) for c in range(32,127))+'，。！？：；（）【】《》“”‘’、—…·智能设计与鲁棒学习'
for weight in ['Regular','Bold']:
 font=TTFont(folder/f'NotoSansCJKsc-{weight}.otf',recalcTimestamp=False)
 options=subset.Options(); options.flavor='woff2'; options.recommended_glyphs=True
 sub=subset.Subsetter(options=options); sub.populate(text=text); sub.subset(font)
 font.flavor='woff2';font.save(folder/f'NotoSansCJKsc-{weight}-web.woff2')
font=TTFont(folder/'InterVariable.ttf',recalcTimestamp=False);font.flavor='woff2';font.save(folder/'InterVariable.woff2')
print([(p.name,p.stat().st_size) for p in folder.glob('*.woff2')])
