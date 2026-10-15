"""Build transparent, theme-aware favicon from the canonical symbol; retain the app tile."""
from copy import deepcopy
from pathlib import Path
import json
import argparse
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
LOGOS = ROOT / 'assets/brand/logo'
parser = argparse.ArgumentParser()
parser.add_argument('--tokens', type=Path, default=ROOT / 'assets/brand/tokens.json')
parser.add_argument('--logo-dir', type=Path, default=LOGOS)
parser.add_argument('--check', action='store_true')
args = parser.parse_args()
LOGOS = args.logo_dir
SVG = 'http://www.w3.org/2000/svg'
ET.register_namespace('', SVG)
tokens = json.loads(args.tokens.read_text(encoding='utf-8'))
source = ET.parse(LOGOS / 'symbol-color.svg').getroot()
_, _, width, height = map(float, source.get('viewBox').split())

def icon(tile=False):
    root = ET.Element(f'{{{SVG}}}svg', {'viewBox': '0 0 64 64'})
    ET.SubElement(root, f'{{{SVG}}}title').text = 'IDRL'
    if tile:
        ET.SubElement(root, f'{{{SVG}}}rect', {'width':'64','height':'64','fill':tokens['brand']['navy']})
    else:
        ET.SubElement(root, f'{{{SVG}}}style').text = (
            '@media (prefers-color-scheme: dark) {'
            f'.favicon-navy {{ fill: {tokens["brand"]["navyOnDark"]}; }}'
            '}'
        )
    scale = 56 / width
    group = ET.SubElement(root, f'{{{SVG}}}g', {'transform':f'translate(4 {(64-height*scale)/2}) scale({scale})'})
    for element in source:
        if element.tag.endswith('title'): continue
        child = deepcopy(element)
        for node in child.iter():
            if node.get('fill') == tokens['brand']['navy']:
                if tile: node.set('fill', tokens['brand']['navyOnDark'])
                else: node.set('class', 'favicon-navy')
        group.append(child)
    return ET.tostring(root, encoding='unicode')+'\n'

if __name__ == '__main__':
    for name,tile in [('favicon.svg',False),('favicon-tile.svg',True)]:
        path = LOGOS / name
        content = icon(tile)
        if '--check' in sys.argv:
            if not path.exists() or path.read_text(encoding='utf-8') != content:
                raise SystemExit(f'Stale {name}; run scripts/build-favicon.py')
        else:
            path.write_text(content,encoding='utf-8')
    print('Favicon source assets verified' if '--check' in sys.argv else 'Built transparent adaptive favicon and fixed-background application tile')
