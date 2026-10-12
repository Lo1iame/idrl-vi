"""Package reviewed page images as a reliably paginated review PDF."""
from pathlib import Path
from reportlab.pdfgen.canvas import Canvas
root=Path(__file__).resolve().parents[1]
out=root/'output/brand'
pdf=Canvas(str(out/'idrl-foundation-review.pdf'),pagesize=(1080,720))
pdf.setTitle('IDRL Brand Foundation - Review v0.1')
pdf.setAuthor('IDRL')
for i in range(1,6):
 pdf.drawImage(str(out/f'foundation-{i}.png'),0,0,1080,720)
 pdf.showPage()
pdf.save()
print('Review PDF exported from verified 2x page images.')
