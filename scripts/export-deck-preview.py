"""Create a font-independent raster review PDF from finalized slide previews."""
import argparse
from pathlib import Path
from reportlab.pdfgen.canvas import Canvas

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--slides-dir', required=True, type=Path)
parser.add_argument('--output', required=True, type=Path)
args = parser.parse_args()
images = [args.slides_dir / f'slide-{number:02}.png' for number in range(1, 17)]
missing = [str(image) for image in images if not image.is_file()]
if missing:
    parser.error('Missing finalized slide previews: ' + ', '.join(missing))
args.output.parent.mkdir(parents=True, exist_ok=True)
canvas = Canvas(str(args.output), pagesize=(960, 540))
canvas.setTitle('IDRL Research Template — Visual Review')
canvas.setAuthor('IDRL')
canvas.setSubject('Raster review of finalized slide previews; editable source is the accompanying PPTX.')
for image in images:
    canvas.drawImage(str(image), 0, 0, 960, 540)
    canvas.showPage()
canvas.save()
print(f'Exported {len(images)} review pages: {args.output.name}')
