import subprocess,glob,os,re,json,sys,urllib.parse
C=glob.glob(os.path.expanduser('~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium'))[0]
SK=sys.argv[2:] or "hjem hjemUge kalender idebank idebankUden indbakke planlaegning performance vaerktoej profil aarshjul maal byggesten brief menu tomhovedet plus nyide opgave aftale planmoede ring".split()
W,H={'tlf':(390,844),'pc':(1440,900),'pcbred':(1900,1000),'t412':(412,900)}[sys.argv[1]]
for s in SK:
    fil=urllib.parse.quote(f'index-ux.html?uxs={s}&selekode=HINGES2026&nc=11',safe='')
    url=f'http://localhost:4810/sele.html?vis=kunde&fil={fil}&bred={W}&hoej={H}'
    png=f'ux/{sys.argv[1]}-{s}.png'
    out=subprocess.run([C,'--headless=new','--disable-gpu','--no-sandbox',f'--window-size={W},{H}','--virtual-time-budget=22000','--hide-scrollbars','--enable-logging=stderr','--v=0',f'--screenshot={png}',url],capture_output=True,text=True)
    m=re.search(r'"@@(\{.*?\})@@"',out.stderr,re.S)
    try: r=json.loads(m.group(1).encode().decode('unicode_escape').encode('latin1').decode('utf8')) if m else None
    except Exception: 
        try: r=json.loads(m.group(1))
        except Exception: r=None
    print(sys.argv[1],s,'|',json.dumps(r.get('lint') if r else 'INGEN MÅLING',ensure_ascii=False)[:600],'| fejl:',(r or {}).get('fejl'),flush=True)
