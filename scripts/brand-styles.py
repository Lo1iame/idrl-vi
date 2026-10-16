"""Generate the distributable scientific chart style from the current tokens."""
from pathlib import Path
import argparse
import json

ROOT = Path(__file__).resolve().parents[1]

def chart_params(tokens):
    light = tokens['light']
    # Fonts/layout are medium-specific. All shared text, rule and surface colors come from tokens.
    values = {
        'font.family': 'sans-serif', 'font.sans-serif': 'Inter, Noto Sans CJK SC, DejaVu Sans', 'font.size': 10,
        'text.color': light['foreground'], 'axes.labelcolor': light['foreground'], 'axes.edgecolor': light['mutedForeground'],
        'axes.spines.top': False, 'axes.spines.right': False, 'axes.grid': True, 'axes.grid.axis': 'y', 'axes.axisbelow': True,
        'grid.color': light['border'], 'grid.linewidth': 0.6, 'xtick.color': light['mutedForeground'], 'ytick.color': light['mutedForeground'],
        'lines.linewidth': 1.6, 'lines.markersize': 5, 'legend.frameon': False,
        'figure.facecolor': light['surface'], 'axes.facecolor': light['surface'], 'savefig.facecolor': light['surface'],
        'savefig.dpi': 300, 'pdf.fonttype': 42, 'ps.fonttype': 42, 'svg.fonttype': 'none',
    }
    return values

def chart_style(tokens):
    return '\n'.join(f'{key}: {str(value).lstrip("#")}' for key,value in chart_params(tokens).items()) + '\n'

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--tokens', type=Path, default=ROOT/'assets/brand/tokens.json')
    parser.add_argument('--output', type=Path, default=ROOT/'assets/brand/charts/idrl.mplstyle')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    content = chart_style(json.loads(args.tokens.read_text(encoding='utf-8')))
    if args.check:
        if not args.output.exists() or args.output.read_text(encoding='utf-8') != content:
            raise SystemExit('Stale chart style; run scripts/brand-styles.py')
    else:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(content, encoding='utf-8')
    print('Scientific chart style verified' if args.check else 'Scientific chart style generated')
