from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import argparse,base64,mimetypes,re,hashlib,json

parser=argparse.ArgumentParser(description='Package the canonical web UI, including supplied brand fonts.')
parser.add_argument('--out',required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parent.parent
web=root/'web'
out=Path(args.out).resolve();out.mkdir(parents=True,exist_ok=True)
html=(web/'index.html').read_text(encoding='utf-8')
html=re.sub(r'\s*<link rel="preload"[^>]*>','',html)
def data_uri(relative):
 p=(web/relative).resolve();p.relative_to(web.resolve())
 mime='font/otf' if p.suffix=='.otf' else mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
 return 'data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode('ascii')
for name in ['fonts.css','app.css','components.css']:
 css=(web/name).read_text(encoding='utf-8')
 css=re.sub(r'url\("(assets/[^\"]+)"\)',lambda m:'url("'+data_uri(m.group(1))+'")',css)
 html=html.replace(f'<link rel="stylesheet" href="{name}">','<style>\n'+css+'\n</style>')
html=re.sub(r'((?:src|href)=")(assets/[^\"]+)(")',lambda m:m.group(1)+data_uri(m.group(2))+m.group(3),html)
for name in ['styles-data.js','prompt-core.js','app.js']:
 html=html.replace(f'<script defer src="{name}"></script>','<script type="text/plain" data-offline-script>\n'+(web/name).read_text(encoding='utf-8')+'\n</script>')
html=html.replace('</body>','<script>document.querySelectorAll("script[data-offline-script]").forEach(function(s){var n=document.createElement("script");n.textContent=s.textContent;document.body.appendChild(n);});</script>\n</body>')
single=out/'영업교육팀_슬라이드프롬프터.html';single.write_text(html,encoding='utf-8')
manifest={str(p.relative_to(web)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(web.rglob('*')) if p.is_file()}
(out/'web-source-sha256.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
archive=out/'영업교육팀_프롬프터_UI소스.zip'
with ZipFile(archive,'w',ZIP_DEFLATED) as z:
 for p in sorted(web.rglob('*')):
  if p.is_file():z.write(p,'web/'+str(p.relative_to(web)).replace('\\','/'))
 for name in ['LICENSE','NOTICE','README.md']:z.write(root/name,name)
 z.write(single,single.name);z.write(out/'web-source-sha256.json','web-source-sha256.json')
print(f'Offline HTML: {single.name} ({single.stat().st_size} bytes)')
print(f'UI source archive: {archive.name} ({archive.stat().st_size} bytes)')
print(f'Manifest: {len(manifest)} canonical web files')
