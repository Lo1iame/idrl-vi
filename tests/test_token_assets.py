import unittest
import tempfile
import subprocess
import sys
import json
import runpy
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class TokenAssetsTest(unittest.TestCase):
    def test_logo_variant_keeps_geometry_and_uses_selected_colors(self):
        tokens = json.loads((ROOT/'assets/brand/tokens.json').read_text())
        tokens['brand'].update(navy='#112233', blue='#234567', cyan='#456789', navyOnDark='#aabbcc')
        with tempfile.TemporaryDirectory(prefix='idrl-token-assets-') as folder:
            directory = Path(folder)
            token_file = directory/'tokens.json'
            token_file.write_text(json.dumps(tokens))
            subprocess.run([sys.executable, str(ROOT/'scripts/build-brand.py'), '--tokens', str(token_file), '--output', str(directory/'logo')], check=True)
            for generated in (directory/'logo').glob('*.svg'):
                original = ROOT/'assets/brand/logo'/generated.name
                a, b = ET.parse(original).getroot(), ET.parse(generated).getroot()
                geometry = lambda tree: [(node.tag, tuple((k,v) for k,v in node.attrib.items() if k in ('d','transform','viewBox','points','width','height'))) for node in tree.iter()]
                self.assertEqual(geometry(a), geometry(b), generated.name)
            symbols = '\n'.join(p.read_text(encoding='utf-8') for p in (directory/'logo').glob('*.svg'))
            for color in tokens['brand'].values():
                if isinstance(color,str) and color.startswith('#'):
                    self.assertIn(color, symbols)

    def test_chart_style_tracks_semantic_colors(self):
        tokens = json.loads((ROOT/'assets/brand/tokens.json').read_text())
        tokens['light'].update(foreground='#112233', mutedForeground='#445566', border='#778899', surface='#aabbcc')
        module = runpy.run_path(str(ROOT/'scripts/brand-styles.py'))
        params = module['chart_params'](tokens)
        self.assertEqual(params['text.color'], '#112233')
        self.assertEqual(params['xtick.color'], '#445566')
        self.assertEqual(params['grid.color'], '#778899')
        self.assertEqual(params['savefig.facecolor'], '#aabbcc')
        self.assertIn('grid.color: 778899', module['chart_style'](tokens))

if __name__ == '__main__': unittest.main()
