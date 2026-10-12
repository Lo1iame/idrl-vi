"""Reproducible IDRL chart examples. All values are synthetic, not team results."""
from pathlib import Path
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/scientific-charts'
OUT.mkdir(parents=True, exist_ok=True)
for name in ['InterVariable.ttf', 'NotoSansCJKsc-Regular.otf']:
    font_manager.fontManager.addfont(str(ROOT / 'assets/brand/fonts' / name))
plt.style.use(ROOT / 'assets/brand/charts/idrl.mplstyle')
d = json.loads((ROOT / 'output/research-template/illustrative-data.json').read_text())
NAVY, BLUE = '#203663', '#236db9'

def save(fig, ax, name):
    ax.legend(loc='upper center', bbox_to_anchor=(.5, 1.18), ncol=2)
    fig.text(.12, .02, 'SYNTHETIC EXAMPLE — NOT RESEARCH RESULTS', fontsize=8, color='#52637a')
    fig.subplots_adjust(left=.13, right=.97, top=.8, bottom=.20)
    for ext in ['svg', 'pdf', 'png']:
        fig.savefig(OUT / f'{name}.{ext}')
    plt.close(fig)

fig, ax = plt.subplots(figsize=(6.4, 4.2))
x = np.arange(3)
ax.bar(x-.18, d['baseline'], .36, label='Baseline', color=NAVY, hatch='//', edgecolor='white')
ax.bar(x+.18, d['proposed'], .36, label='Proposed', color=BLUE)
ax.set(xticks=x, xticklabels=d['categories'], ylabel='Accuracy (%) ↑', ylim=(0,100))
save(fig, ax, 'task-comparison')

for stem, xs, a, b, xlabel, ylabel, ylim in [
    ('learning-curve', d['steps'], d['lossBase'], d['lossNew'], 'Training epoch', 'Loss ↓', (0,2)),
    ('robustness', d['noise'], d['robustBase'], d['robustNew'], 'Normalized perturbation strength', 'Accuracy (%) ↑', (0,100))]:
    fig, ax = plt.subplots(figsize=(6.4,4.2))
    xs = np.array(xs, dtype=float)
    ax.plot(xs, a, '--s', color=NAVY, label='Baseline')
    ax.plot(xs, b, '-o', color=BLUE, label='Proposed')
    ax.set(xlabel=xlabel, ylabel=ylabel, ylim=ylim)
    save(fig, ax, stem)

runs = {'Baseline':[69,71,73,70,72], 'Proposed':[75,79,78,80,78]}
(OUT/'repeat-runs.json').write_text(json.dumps({'notice':'Synthetic independent examples', 'n':5, 'error':'sample SD (ddof=1)', 'runs':runs}, indent=2))
fig, ax = plt.subplots(figsize=(6.4,4.2))
for i, (name, values) in enumerate(runs.items()):
    color = [NAVY, BLUE][i]
    ax.scatter(i+np.linspace(-.09,.09,5), values, color=color, alpha=.45, marker=['s','o'][i])
    ax.errorbar(i, np.mean(values), yerr=np.std(values, ddof=1), fmt=['s','o'][i], color=color, capsize=7, label=name, linewidth=2)
ax.set(xticks=[0,1], xticklabels=list(runs), xlim=(-.55,1.55), ylim=(60,90), ylabel='Accuracy (%) ↑')
ax.text(.03,.96,'Mean ± sample SD; n=5 synthetic runs',transform=ax.transAxes,fontsize=9,va='top')
save(fig, ax, 'repeat-uncertainty')
print(f'Exported 4 charts × 3 formats to {OUT}')
