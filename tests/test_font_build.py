"""Run with Python unittest; all font writes use an isolated temporary copy."""
from pathlib import Path
import hashlib
import shutil
import subprocess
import sys
import tempfile
import unittest
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]

class FontBuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        cls.root = Path(cls.temp.name)
        (cls.root / 'scripts').mkdir()
        shutil.copy2(ROOT / 'scripts/build-web-fonts.py', cls.root / 'scripts')
        cls.fonts = cls.root / 'assets/brand/fonts'
        cls.fonts.mkdir(parents=True)
        for name in ['InterVariable.ttf', 'NotoSansCJKsc-Regular.otf', 'NotoSansCJKsc-Bold.otf']:
            shutil.copy2(ROOT / 'assets/brand/fonts' / name, cls.fonts)

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def run_builder(self, *args):
        return subprocess.run([sys.executable, str(self.root / 'scripts/build-web-fonts.py'), *map(str,args)], capture_output=True, text=True, encoding='utf-8', errors='replace')

    def assert_rejected_without_writes(self, *args):
        before = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in self.fonts.iterdir()}
        result = self.run_builder(*args)
        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertEqual(before, {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in self.fonts.iterdir()})

    def test_missing_directory(self):
        self.assert_rejected_without_writes('--crawl-dir', self.root / 'missing')

    def test_directory_without_supported_files(self):
        directory = self.root / 'unsupported'
        directory.mkdir(exist_ok=True)
        (directory / 'picture.bin').write_bytes(b'not source text')
        self.assert_rejected_without_writes('--crawl-dir', directory)

    def test_empty_copy(self):
        file = self.root / 'empty.md'
        file.write_text(' \n\t', encoding='utf-8')
        self.assert_rejected_without_writes('--text-file', file)

    def test_missing_copy(self):
        self.assert_rejected_without_writes('--text-file', self.root / 'missing.md')

    def test_javascript_copy_is_included(self):
        directory = self.root / 'app'
        directory.mkdir(exist_ok=True)
        (directory / 'page.jsx').write_text('export default () => <p>龘</p>', encoding='utf-8')
        result = self.run_builder('--crawl-dir', directory)
        self.assertEqual(result.returncode, 0, result.stderr)
        for weight in ['Regular','Bold']:
            with TTFont(self.fonts / f'NotoSansCJKsc-{weight}-web.woff2') as font:
                self.assertIn(ord('龘'), font.getBestCmap())

if __name__ == '__main__':
    unittest.main()
