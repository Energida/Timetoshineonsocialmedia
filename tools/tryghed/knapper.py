import subprocess,glob,os,re,json,sys,urllib.parse
C=glob.glob(os.path.expanduser('~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium'))[0]
W,H={'tlf':(390,844),'pc':(1440,900)}[sys.argv[1]]
SK=sys.argv[2:] or "hjem kalender idebank indbakke planlaegning performance vaerktoej profil aarshjul maal byggesten brief menu tomhovedet plus nyide".split()
for s in SK:
    fil=urllib.parse.quote(f'index-knap.html?uxf={s}&selekode=HINGES2026&nc=21',safe='')
    url=f'http://localhost:4810/sele.html?vis=kunde&fil={fil}&bred={W}&hoej={H}'
    out=subprocess.run([C,'--headless=new','--disable-gpu','--no-sandbox',f'--window-size={W},{H}','--virtual-time-budget=240000','--enable-logging=stderr','--v=0','--dump-dom',url],capture_output=True,text=True)
    m=re.search(r'"@@(\{.*\})@@"',out.stderr,re.S)
    if not m: print(sys.argv[1],s,'INGEN MÅLING'); continue
    try: r=json.loads(m.group(1).encode().decode('unicode_escape').encode('latin1').decode('utf8'))
    except Exception:
        try: r=json.loads(m.group(1))
        except Exception as e: print(s,'parse',e); continue
    print('=====',sys.argv[1],s,'knapper:',r['antal'],'| døde:',len(r['dod']),'| fejl:',len(r['fejl']),'| ingen effekt:',len(r['ingenEffekt']),'| sprunget:',r['sprunget'],flush=True)
    for k in ('dod','fejl','ingenEffekt'):
        for x in r[k]: print('  ',k,json.dumps(x,ensure_ascii=False)[:230],flush=True)
