"""Verify the current exported deck retains its editable objects and small-size logo."""
from pathlib import Path
from zipfile import ZipFile
import re
import hashlib
import json
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NS = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main', 'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}


class AssetExportTests(unittest.TestCase):
    def test_current_deck_keeps_native_evidence_and_legible_header_identity(self):
        index = (ROOT / 'output/research-template/index.html').read_text(encoding='utf-8')
        name = re.search(r'href="(idrl-research-template-[\w.-]+\.pptx)"', index).group(1)
        deck_path = ROOT / 'output/research-template' / name
        receipt = json.loads((deck_path.parent / 'validation-current.json').read_text(encoding='utf-8'))
        self.assertEqual(receipt['file'], name)
        self.assertEqual(receipt['sha256'], hashlib.sha256(deck_path.read_bytes()).hexdigest())
        with ZipFile(deck_path) as deck:
            self.assertIsNone(deck.testzip())
            slides = [n for n in deck.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)]
            self.assertEqual(len(slides), 16)
            self.assertEqual(len([n for n in deck.namelist() if re.search(r'/charts/chart\d+\.xml$', n)]), 3)
            self.assertEqual(len([n for n in deck.namelist() if n.endswith('.xlsx')]), 3)
            table_count = 0
            for name in slides:
                slide = ET.fromstring(deck.read(name))
                table_count += len(slide.findall('.//a:tbl', NS))
                pictures = slide.findall('.//p:pic', NS)
                headers = []
                for picture in pictures:
                    extent = picture.find('./p:spPr/a:xfrm/a:ext', NS)
                    if extent is not None and abs(int(extent.get('cx')) / int(extent.get('cy')) - 600 / 180) < .001:
                        headers.append(extent)
                # Decorative brand geometry is permitted; the small header must remain readable.
                self.assertEqual(len(headers), 1)
                extent = headers[0]
                width, height = int(extent.get('cx')), int(extent.get('cy'))
                # The small header uses the 600:180 acronym lockup, not the 850:180 bilingual lockup.
                self.assertAlmostEqual(width / height, 600 / 180, places=3)
                # The actual symbol is 228/600 of the lockup width; at least 10 mm in print.
                self.assertGreaterEqual(width / 36000 * 228 / 600, 10)
            self.assertEqual(table_count, 4)

    def test_derived_callouts_match_the_synthetic_source(self):
        index = (ROOT / 'output/research-template/index.html').read_text(encoding='utf-8')
        name = re.search(r'href="(idrl-research-template-[\w.-]+\.pptx)"', index).group(1)
        data = json.loads((ROOT / 'output/research-template/illustrative-data.json').read_text())
        with ZipFile(ROOT / 'output/research-template' / name) as deck:
            scores = ET.fromstring(deck.read('ppt/slides/slide9.xml'))
            labels = [node.text for node in scores.findall('.//a:t', NS)]
            for baseline, proposed in zip(data['baseline'], data['proposed']):
                self.assertIn(f'+{proposed - baseline}', labels)
            robustness = ET.fromstring(deck.read('ppt/slides/slide12.xml'))
            self.assertIn(str(data['robustNew'][-1] - data['robustBase'][-1]), [node.text for node in robustness.findall('.//a:t', NS)])

    def test_current_pdf_preview_has_all_slides(self):
        from pypdf import PdfReader
        receipt = json.loads((ROOT / 'output/research-template/validation-current.json').read_text())
        pdf = PdfReader(ROOT / 'output/research-template' / receipt['pdf'])
        self.assertEqual(len(pdf.pages), 16)
        self.assertFalse(pdf.is_encrypted)


if __name__ == '__main__':
    unittest.main()
