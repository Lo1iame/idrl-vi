"""Emit shared CSS and verify foreground/background contrast for review tokens."""
from pathlib import Path
import json, re
root=Path(__file__).resolve().parents[1]
tokens=json.loads((root/'assets/brand/tokens.json').read_text())
def kebab(s): return re.sub(r'([A-Z])',r'-\1',s).lower()
css=['/* Generated from tokens.json. Edit the JSON, then run scripts/build-tokens.py. */']
css += ['@font-face{font-family:Inter;src:url("./fonts/InterVariable.ttf");font-weight:100 900;font-display:swap}',
 '@font-face{font-family:"Noto Sans CJK SC";src:url("./fonts/NotoSansCJKsc-Regular.otf");font-weight:400;font-display:swap}',
 '@font-face{font-family:"Noto Sans CJK SC";src:url("./fonts/NotoSansCJKsc-Bold.otf");font-weight:700;font-display:swap}']
for theme in ['light','dark']:
 selector=':root, [data-theme="light"]' if theme=='light' else '[data-theme="dark"]'
 css.append(selector+' {')
 css.extend(f'  --{kebab(k)}: {v};' for k,v in tokens[theme].items())
 css.append('}')
css.append(':root {')
css.extend(f'  --brand-{k}: {v};' for k,v in tokens['brand'].items())
css.extend(f'  --font-{k}: {v};' for k,v in tokens['font'].items())
for section in ['radius','type','motion']:
 css.extend(f'  --{section}-{kebab(k)}: {v}{"ms" if section=="motion" else "px"};' for k,v in tokens[section].items())
css.extend(f'  --space-{v}: {v}px;' for v in tokens['spacing'])
css.append('}')
css.append('@media(prefers-reduced-motion:reduce){:root{--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms}}')
(root/'assets/brand/tokens.css').write_text('\n'.join(css),encoding='utf-8')
(root/'assets/brand/tokens-values.css').write_text('\n'.join(line for line in css if not line.startswith('@font-face')),encoding='utf-8')
def lum(h):
 vals=[int(h[i:i+2],16)/255 for i in [1,3,5]]
 vals=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in vals]
 return sum(v*c for v,c in zip(vals,[.2126,.7152,.0722]))
def mix(fg,bg,alpha):
 f=[int(fg[i:i+2],16) for i in [1,3,5]]; b=[int(bg[i:i+2],16) for i in [1,3,5]]
 return '#%02x%02x%02x'%tuple(round(alpha*f[i]+(1-alpha)*b[i]) for i in range(3))
def ratio(fg,bg):
 a,b=sorted([lum(fg),lum(bg)]); return (b+.05)/(a+.05)
checks=[]
BADGE_TINT=0.15
for theme in ['light','dark']:
 t=tokens[theme]
 for bg in ['background','surface','surfaceSubtle']:
  for fg in ['foreground','mutedForeground','success','warning','destructive']:
   r=ratio(t[fg],t[bg])
   checks.append({'kind':'solid','theme':theme,'foreground':fg,'background':bg,'ratio':round(r,2),'required':4.5,'pass':r>=4.5})
 for fg,bg,required in [('primaryForeground','primary',4.5),('focus','surface',3),('controlBorder','surface',3)]:
  r=ratio(t[fg],t[bg])
  checks.append({'kind':'solid','theme':theme,'foreground':fg,'background':bg,'ratio':round(r,2),'required':required,'pass':r>=required})
 # 两种主题都有 *Text；深色文字变体与对应基色一致。
 status={'primary':('primaryText','primary'),'success':('successText','success'),'warning':('warningText','warning'),'destructive':('destructiveText','destructive')}
 for name,(fg_key,base_key) in status.items():
  for surf in ['surface','background','surfaceSubtle']:
   bg=mix(t[base_key],t[surf],BADGE_TINT)
   r=ratio(t[fg_key],bg)
   checks.append({'kind':'badge','theme':theme,'foreground':fg_key,'background':f'{base_key} {int(BADGE_TINT*100)}% over {surf}','ratio':round(r,2),'required':4.5,'pass':r>=4.5})
   banner_bg=mix(t[base_key],t[surf],0.05)
   banner_ratio=ratio(t[fg_key],banner_bg)
   checks.append({'kind':'banner','theme':theme,'foreground':fg_key,'background':f'{base_key} 5% over {surf}','ratio':round(banner_ratio,2),'required':4.5,'pass':banner_ratio>=4.5})
navy=tokens['brand']['navy']
for fg,alpha,required,label in [('#ffffff',1,4.5,'white on navy'),('#ffffff',0.7,4.5,'white70 on navy'),(tokens['brand']['cyan'],1,3,'cyan accent on navy')]:
 fg_eff=mix(fg,navy,alpha) if alpha<1 else fg
 r=ratio(fg_eff,navy)
 checks.append({'kind':'brandPanel','theme':'light','foreground':label,'background':'brand navy','ratio':round(r,2),'required':required,'pass':r>=required})
(root/'docs/design/contrast-report.json').write_text(json.dumps(checks,indent=2),encoding='utf-8')
assert all(c['pass'] for c in checks), [c for c in checks if not c['pass']]
print(f'{len(checks)} contrast pairs passed; CSS emitted')
