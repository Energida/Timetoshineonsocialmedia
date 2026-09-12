# Backstage 2027: status 12. september 2026 (sky-tråden)

**Skrevet af:** en Claude Code-tråd i skyen (ikke på Idas maskine), mens Ida var i Grækenland og computeren derhjemme var lukket. **Grundlag:** `dashboard-og-database` på v1856 (f747505, 12/9 kl. 16:20). **Ikke deployet:** denne tråd har kun pushet til sin egen branch. Deploy sker fra Idas maskine eller på hendes udtrykkelige ord.

## 1. Planen er bygget

Alle fem etaper i `2026-09-08-backstage-2027.md` findes i koden. Afkrydsningen i planen er nu sat efter koden (26 af 33 felter). De syv åbne felter er: Task 1 (selen, ligger uden for repoet), Task 9's punkt om at omdirigere `visDashSide('maskinrum')` til Energida, og etape 5's fem punkter (arkivmarkering, tvillingetjek, manual, skill, hukommelse). De fire sidste ligger uden for repoet.

## 2. Afvigelser fra spec'en (alle Idas egne valg, dateret i koden)

| Spec'en sagde | Koden gør | Hvorfor |
|---|---|---|
| Forsiden: Venter på dig som røde kort | Forsiden er døre + To-do nederst; Venter på dig bor i Indbakken | Ida 8/9 kl. 16.01: »Hvis jeg skal noget skal det komme i min indbakke og placeres på min to-do« |
| Indbakken omdirigeres til forsiden | `indbakke` omdirigeres til `crm` (Kunderne) | Ida 8/9 kl. 16.13: kundeopgaverne ligger øverst på Kunderne |
| Fire døre: Kunderne · Mine rum · Manus & klip · Produkter | Kunder · Mine rum · Energida Studio · Salg · Content Studio · Workout Studio · Food Studio · Mindful Studio · Teknik (bred) | Ida 8/9 og 9/9 |
| Døre med tegnet ikon og grå linje | En dør er kun navnet, ingen streg | Ida 12/9 (v1855) |
| Content-idé lander på kode ENERGIDA | Lander på kode `IDAENERGIDA` | Ida oprettede sit eget kundelogin på den kode 8/9 kl. 16.22 |
| Maskinrummets forside pensioneres | Lever stadig bag Teknik-døren (`bsTeknikAabn`) og `mrGaaTil` | Ikke besluttet; sidebarens Maskinrum-punkt er arkiveret |

Tøm hovedet-skærmen, der dækker Backstage på telefonen ved hver åbning, er **bevidst** (Ida 23/7, `studieVaelgerHjem`, kun når `DEPLOY === "crm"`). Den er ikke en fejl.

## 3. Sundhedstjek af v1856 (kørt i headless Chromium, 390 og 1440)

| Tjek | Resultat |
|---|---|
| Syntaks (`node --check` på de 8 scriptblokke, 43.885 linjer) | OK |
| Dobbelte funktionsdefinitioner (2.191 funktioner) | Ingen |
| Backstage, 13 sider (`overblik vaner crm budget klip maskinrum opgbib traening gsd typeeks energida soeg kundeside`) i 390 og 1440 | Ingen JS-fejl, intet vandret overløb |
| Versionsfoden | Viser korrekt »12. september · 1856« (den statiske tekst i markup overskrives af JS) |
| `sw.js`, `_headers`, `manifest.webmanifest` | I orden; cachenavn `energida-v4` |
| Kundeappen (`#somkunde=ENERGIDA` og kundelogin) | **Kunne ikke testes herfra.** Boot kræver en Supabase-session, og skyens netværkspolitik blokerer både Supabase-CDN'et og databasen. Fejlfladen »Appen kunne ikke starte« er appens ærlige svar på det. Kundeappen skal testes fra Idas telefon eller maskine. |

Bemærk: uden database viser Energida-siden »Du har ikke lavet nogen rum endnu« og Kundesiden kun »Tilbage«. Det er forventet, ikke fejl.

## 4. Hvad skyen kan og ikke kan

- **Kan:** læse og ændre koden, køre `node --check`, tage skærmbilleder af Backstage i alle bredder (selen nedenfor), committe og pushe til GitHub.
- **Kan ikke:** nå `b2b.energida.dk` / `admin.energida.dk` (403 fra proxyen), så et deploy kan ikke live-verificeres herfra. Ida kan selv åbne `https://b2b.energida.dk/version.txt` i Safari.
- **Kan ikke:** læse `../CLAUDE.md`, MASTERPLAN, hændelsesloggen, manualen, skill'en eller hukommelsen. De ligger kun på Idas maskine. Regler, der kun står dér, kender en sky-tråd ikke.
- **Deploylåsen i `CLAUDE.md` (7/8)** er aldrig formelt ophævet i filen, selv om der er deployet 840 versioner siden. En sky-tråd bør ikke pushe til `dashboard-og-database` uden Idas udtrykkelige ord.

## 5. Bridge-trådene 12/9

Trådene på Idas maskine (»Skærm, der ikke må vises« m.fl.) døde kl. 16:25 dansk tid, fem minutter efter v1856 blev pushet, fordi computeren blev lukket. Intet i repoet er halvt; højst få minutters ucommitteret arbejde kan være tabt. De vågner først, når Claude Code startes på den maskine igen.

## Bilag: selen til skyen (må ALDRIG committes som fil, jf. `.gitignore`)

Læg de tre filer i en mappe med symlinks til repoets filer, kør `python3 -m http.server 4600` derfra, og kald `koer.sh "side=overblik&bred=390" navn`. Kundeappen: `koer.sh "vis=kunde&hash=%23somkunde%3DENERGIDA&bred=390&tab=8" navn` (virker kun med database).

### sele.html
```html
<!doctype html><meta charset="utf-8"><title>sele</title><body style="margin:0">
<script>
const P = k => new URLSearchParams(location.search).get(k);
const side = P('side') || 'overblik', bred = parseInt(P('bred') || '390', 10), hoej = parseInt(P('hoej') || '1200', 10);
const f = document.createElement('iframe'); f.style.cssText = 'border:0;width:' + bred + 'px;height:' + hoej + 'px;display:block'; f.src = 'index.html' + (P('hash') ? decodeURIComponent(P('hash')) : (P('vis') === 'kunde' ? '' : '#admin')); document.body.appendChild(f);
let n = 0;
function tick() {
  n++; const w = f.contentWindow; let ok = false; try { ok = (P('vis') === 'kunde' ? typeof w.showTab === 'function' : typeof w.visDashSide === 'function') && w.document.readyState === 'complete'; } catch (e) {}
  if (!ok) { if (n < 250) return setTimeout(tick, 80); console.log('SELE: visDashSide aldrig klar'); return; }
  if (P('vis') === 'kunde') { setTimeout(() => { try { if (P('tab') !== null && typeof w.showTab === 'function') w.showTab(parseInt(P('tab'), 10)); } catch (e) { console.log('SELE tab: ' + e.message); } if (P('kode')) { try { w.eval(P('kode')); } catch (e) { console.log('SELE kode: ' + e.message); } } }, 1200); setTimeout(maal, 3500); return; }
  try {
    const d = w.document; try { if (typeof w.authSkip === 'function') w.authSkip(); } catch (e) { console.log('SELE authSkip: ' + e.message); }
    const g = d.getElementById('authGate'); if (g) g.remove();
    d.body.classList.add('dash-mode');
    ['dashMain', 'dashboard'].forEach(id => { const e = d.getElementById(id); if (e) e.style.display = 'block'; });
    ['dashLogin', 'app'].forEach(id => { const e = d.getElementById(id); if (e) e.style.display = 'none'; });
    w.visDashSide(side);
    setTimeout(() => { try { if (typeof w.studieVaelgerLuk === 'function') w.studieVaelgerLuk(); } catch (e) {} }, 300);
    const l = d.getElementById('appLoader'); if (l) l.remove();
    if (P('kode')) setTimeout(() => { try { w.eval(P('kode')); } catch (e) { console.log('SELE kode: ' + e.message); } }, 600);
  } catch (e) { console.log('SELE fejl: ' + e.message); }
  setTimeout(maal, 2500);
}
function maal() {
  try {
    const d = f.contentDocument, w = f.contentWindow; const sw = d.documentElement.scrollWidth, iw = w.innerWidth;
    const rod = d.getElementById(P('vis') === 'kunde' ? 'app' : 'dashMain') || d.body;
    console.log('SELE MAAL side=' + side + ' bred=' + iw + ' scrollWidth=' + sw + ' overloeb=' + (sw > iw ? 'JA' : 'nej') + ' tekst=' + (rod.innerText || '').replace(/\s+/g, ' ').slice(0, 260));
  } catch (e) { console.log('SELE maal fejl: ' + e.message); }
}
tick();
</script>
```

### koer.sh
```bash
#!/bin/bash
# brug: koer.sh "<url-params>" <navn> [probe-fil]   -> skriver navn.png og printer SELE-linjer + fejl
S=/tmp/claude-0/-home-user-Timetoshineonsocialmedia/02fc9a3d-c5f5-5a15-bd78-ec56d5a41d56/scratchpad
C=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
PARAMS="$1"; NAVN="$2"; PROBE="$3"
BRED=$(echo "$PARAMS" | grep -o -E 'bred=[0-9]+' | cut -d= -f2); BRED=${BRED:-390}
if [ -n "$PROBE" ]; then K=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(open(sys.argv[1]).read()))" "$PROBE"); PARAMS="$PARAMS&kode=$K"; fi
timeout 60 "$C" --headless=new --no-sandbox --disable-gpu --window-size=$BRED,1200 --virtual-time-budget=15000 --enable-logging=stderr --v=0 --screenshot=$S/$NAVN.png "http://127.0.0.1:4600/sele.html?$PARAMS" 2>&1 \
 | grep -E 'CONSOLE' | grep -v -E 'net::ERR|403|Failed to load|Supabase-biblioteket' | sed -E 's/^.*CONSOLE:[0-9]+\] //; s/", source:.*$//; s/^"//' | cut -c1-700 | sed "s/^/[$NAVN] /"
```

### probe-kunde.js
```js
(function(){
  var sk=[].map.call(document.querySelectorAll('[id^=screen]'),function(e){return e.id+(getComputedStyle(e).display!=='none'?'*':'')});
  var ud=[];document.querySelectorAll('body *').forEach(function(e){var cs=getComputedStyle(e);if(cs.position==='fixed'&&cs.display!=='none'&&cs.visibility!=='hidden'){var r=e.getBoundingClientRect();if(r.width>=innerWidth*0.8&&r.height>=innerHeight*0.6)ud.push('#'+e.id+'.'+String(e.className).slice(0,30)+' z='+cs.zIndex);}});
  console.log('SELE KUNDE skaerme='+sk.join(',')+' daekker='+(ud.join('|')||'ingen')+' SOM_KUNDE='+(window.SOM_KUNDE||'')+' body='+document.body.className.slice(0,80));
})()
```
