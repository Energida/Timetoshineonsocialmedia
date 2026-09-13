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

## 5. v1857: briefen efter gennemgangen (Idas klik 12/9, bygget i skyen)

Gennemgangen ligger som Artifact (»Briefen under lup«, 13 fund). Idas valg og det, der er bygget:

| Fund | Valg | Bygget |
|---|---|---|
| 7, 8, 9 (tvillinger) | Telefonen følger computeren | Klip 1 hører til Fang dem med »Hvad ser man i klippet«; Fasthold dem begynder ved klip 2 (kort reel: ingen »mangler klip 2«). Én etiket. Ét chipsæt: søjle · format · hvem · dato, samme datoform (`dkDatoKort`) på godkendelsen. Hvem-chippen holdes ude af godkendelsen (26/8-beslutningen). Viben er ude af alle chips. |
| 1, 2 (spørgsmålsskærmen) | Titel og fremdrift øverst | `#briefSpmHoved` først i wrap: titlen i Didot + »Fang dem · 1 af 2« (stadig vejen ud til fliserne). Rammen bærer kun spørgsmålet og står stadig nederst/midt. |
| 3 (den røde knap) | Behold Gem ændringer | Ingen ændring. |
| 4 | Ja | »Dine forslag« vises først, når der er et forslag (CSS `:not(:has(.fs-rk))`). |
| 5 | Ja | Parrede spørgsmål: de to datoer på ét kort, Platform · Format · Lyd på ét kort (`briefSpmParGrupper`, `data-spm-par` sat efter etiketten, markup urørt). Fakta: 12 skærme bliver 9 på en ny brief (ansvarlig-feltet tæller med), 11 bliver 8 på en udfyldt. Flisens tal følger grupperne. |
| 6 | Ja | Godkend-flisen siger »Ikke sendt endnu« / »Sendt til godkendelse« / »Godkendt« (grøn). |
| 10 | Ja | Fakta-kortet er ude af telefonens overblik; chiprækken er Fakta. |
| 11, 12, 13 | Ja | Computerens hoved: Tilbage · status · Se brief · ⋯; mappe, del og print ligger i ⋯ (øje og printikon var dubletter af Se brief og Print). Én Gem, nederst ved Næste. Rygraden og fliserne siger »Få dem til at handle«; banneret beholder det fulde navn. |

Ikke testet med rigtige data: forslag-swipe på parrede kort, Content makker, deling. Kør selen på 390 og 1440, hvis noget rettes her igen.

**Også i v1857: Tøm hovedet på b2b for Idas egne koder.** Ida 12/9: »Tøm hovedet skal komme hver gang man klikker på appen«. Da hendes Content Studio flyttede til b2b (8/9), arvede hun kundernes regel fra v1830 (dagens kort én gang om dagen). Nu: `dagensKortKunde` springer dagsspærren over, når `erEgenKode(currentKode)`, og `studieVaelgerHjem` kalder den igen ved `visibilitychange`/`pageshow` på b2b for egne koder. Kunderne er uændrede (én gang om dagen). Målt i selen: ENERGIDA får kortet ved boot, efter visibilitychange og efter pageshow; HINGES2026 kun ved boot. Den store Tøm hovedet-skærm (`studieVaelgerVis`) er stadig kun Backstage.

**Også i v1857: To-do på Backstage Hjem viser kun Energida-sfæren.** Ida 12/9 kl. 23 med skærmbillede: listen var fuld af opskrifter, citater og private noter. To-do på Hjem (8/9) tegner hele `haengepartier`-rækken (`skema_svar`, ENERGIDA/Ida), som rummer to sfærer fra Get shit done (Privat og Energida) uden at vise hvilken. Nu filtreres `sfaere === "privat"` fra på Hjem (`hjemTodos`); de private står stadig i Get shit done. Skriveveje til rækken, alle med sfære Energida: Tøm hovedet-skærmens »To-do« (haengModal, spørger om sfære), Ny idé-arkets To-do-chip, Energida-sidens sendefelt › To-do, forsidens »Ny to-do …«, og »Venter på dig«-kort. Ikke verificeret: hvilken vej de konkrete tekster kom ind ad (kræver basen). Er de skrevet som Energida-to-dos, skal de swipes væk på Hjem eller ryddes i Get shit done.

**Også i v1857: fluebens-cirklen på Hjems to-dos er rund igen.** Knappen `.bs-tjek` bærer `mq-tap`, og telefonreglen (`min-height:44px; padding:11px 0`) strakte den 28 px brede cirkel til 44 px høj. Nu `.bs-tjek.mq-tap { 28 × 28, padding 0 }`; trykfeltet på 44 × 44 ligger i `::before` som før.

**Også i v1857: layouttjek af hele appen (13/9, Idas ønske efter cirklerne).** Probe i selen på 390 og 1440: runde elementer (`border-radius:50%`) der ikke er kvadratiske, klippet tekst, elementer ud over kanten, trykfelter under 30 px. Kørt på 13 Backstage-sider, 17 faner i kundeappen, briefens fem tilstande, plus-menuen, Mere-menuen, dagens kort og Tøm hovedet-skærmen. Fund og rettelser: (1) Energida Studios ⋯-knap (`.kv-menuknap.mq-tap`) var 36 × 44, nu 36 × 36. (2) »Slet vanen« (`.ic-del`) 19 × 20 px, trykfelt 44 via `::before`. (3) »Åbn drejebogen« (`.obp-seklink`) 12 px høj, trykfelt 44 via `::before`. (4) Krydset i Mere-menuen (`.burger-luk`) 19 × 30, trykfelt via `::before`. Ikke fejl: `.hjerte-pynt` stikker ud til højre med vilje (pynt, siden ruller ikke vandret), og `#csDeck`s slides er en vandret karrusel. Ingen klippet tekst nogen steder.

## 5b. v1858: Drejebogen efter 360-gennemgangen (Idas klik 13/9)

Gennemgangen ligger som Artifact (»Drejebogen 360«, 10 fund, alle 16 sider bygget af motoren for Hinges Hus og holdt op mod de låste lister). Idas valg og det, der er bygget:

| Fund | Valg | Bygget |
|---|---|---|
| 1 Navnet over søjlerne | De fire indholdssøjler | Side 3 og 4: »DE FIRE INDHOLDSSØJLER«; side 15: »Indholdssøjlerne: brug dem sådan her«. Samme ord som appen siden 1/9. |
| 2 Briefens tre trin | Appens navne er facit, og ind i bogen | Side 16, trin 3, får linjen »Briefen har tre trin: Fang dem, Fasthold dem, Få dem til at handle på indholdet«. Ordbogen får opslaget. **Dokumentet »Succesfuld Detaildrift, endelig version« (3/9, Del 2) skal rettes til de samme navne; det ligger på Idas maskine.** |
| 5 CTA-listerne | Hele den låste liste | `bsCtaFor` klipper ikke længere ved tre. Fysisk 2A viser fire, ydelsesforretning 1A viser syv. Eksempler og åbninger holder stadig tre (deres egen 30/8-grænse). |
| 3 + 4 Ordbogen og 1B-viben | Ja | 1B: »Primært uddannende eller inspirerende«. Ordbogen: Vibe og CTA rettet til de låste ord; nye opslag Byggesten, Briefens tre trin, EFU-modellen, Succesraketten. Ordlyden er godkendt af Ida ved klik før deploy. |
| 6 EFU-siden | Ja | Ydelsesforretning (`forretningsNoegle === "raadgiver"`) får »ydelsen«, »prislisten«, »når ydelsen er leveret«. De tre andre typer er uændrede. |
| 7 USP og Drivkraft to gange | Ja | Fald-tilbage-rækkerne »Det særlige« og »Det meningsfulde« er ude af råstoffet; indledningen bærer teksten alene, når der ikke er detaljer. |
| 10 Acorns' gamle bøger | Pensioneres | `drejebog-acorns-x29j.html` og `drejebog-acorns-kort-og-godt.html` er nu en lille side »Drejebogen er flyttet ind i appen« med knap til b2b. Adresserne består; de gamle filer ligger i git. Ingen kundedef pegede på dem (Acorns blev koblet fra 25/8). |
| 8 Følelsessætningerne | Åbent | Dokumentet kalder dem arbejdsudkast; bogen viser dem som facit. Ingen ændring; Ida låser eller markerer. |
| 9 Per på side 8 | Idas tjek | Motoren tegner alle personaer; kræver at basen har Per. |

## 5c. v1859: lektionssiden efter 360-gennemgangen (Idas klik 13/9)

Gennemgangen ligger som Artifact (»Lektionssiden 360«, 16 fund, Mette som kernekunde på telefon og computer, kursuskoden RINGKOBING2026 i selen). Idas valg og det, der er bygget:

| Fund | Valg | Bygget |
|---|---|---|
| F1 To rejser på Hjem | Én rejse, lektionerne som trin 2 | `onboardingRender`: kursuskunder får trinnet »Forløbet« mellem skemaet og Drejebogen, med tallet »x af y lektioner set« og knappen »Se første lektion« / »Fortsæt forløbet«. Drejebog-trinnet låses, til forløbet er igennem. Lektionskortet under rejsen (`obFremdriftHtml`) tegnes ikke for kursuskunder; forløbskunder er uændrede. Ingen publicerede lektioner: trinnet står som »på vej« og spærrer intet. |
| F2 Låsen | Alt-eller-intet bliver, med sikkerhedsventil | Ny `kursusLaasAktiv(def)`: én dør for showTab-porten, `kursusIGangMenu` og Forløbet-siden. Er publiceringen hentet og listen tom, er intet låst. Ikke hentet endnu = låst (sikker side). Menuer og rejse tegnes om, når publiceringen er hentet. |
| F3 Menuen på computeren | Ret | Content Studio, Strategi og Performance står dæmpede (samme mønster som rejselåsen 27/8), til forløbet er igennem. »Forløbet« står i venstremenuen og bundnavet, også på rejsen (27/8-filteret, der fjernede det, er ude, fordi lektionerne nu ER rejsens trin 2). |
| F4 Done John | »Færdig — videre til næste« | Én rød knap pr. lektion: med utaget øvelse er »Tag øvelsen (N spørgsmål)« rød og »Markér som set« hvid; ellers »Færdig — videre til næste« / »Færdig — forløbet er i mål«. »Gå til forrige/næste« er ude. Telefon: alle knapper i fuld bredde, 44 px. |
| F5 Svar forsvinder ved luk | Ret | Kladde pr. tastetryk i localStorage (`ovelseKladde*`), skrives tilbage ved genåbning, slettes når øvelsen gøres færdig. Aldrig i basen. |
| F6 Versaler | Ret | Spørgsmålet i almindelig skrift, 18 px. |
| F7 Navne | Forløbet; øvelser | Navsti »Hjem / Forløbet«, menu »Forløbet«, overlayets knap »Til forløbet«, ringen på Hjem hedder »Øvelser«. |
| F8 Lover du det? | Én popup | »Øvelsen bygger din strategi« med »Tag den nu (N spørgsmål)« og »Senere«. `visLoverDuDet`/`loverDuDetNej` står ude af brug. |
| F9 Dagknapperne | Ret | 40 px brede, 4 px luft, 44 px høje: alle syv på én linje på 390. »Luk«-knappen bliver (husreglen 7/9: alle popups har lang Luk på telefon). |
| F10 Modulforsidens antal | Regel til Ida | Teksten for modul 1 siger »seks korte lektioner«; appen tæller selv. Skriv ikke antal i modulteksterne. |
| F11 »0 af 0 øvelser i mål« | Ret | Linjen skjules uden øvelser, som ringen på Hjem. Guides-kortet skjules, mens Værktøjskassen er låst. |
| F12 Tiltale | Ret | Notesbogen: »Den første skriver du med Skriv note…«. Dage-ringen: »Planlægning er hele hemmeligheden«. Modul 5 og 6 i koden: Din kernekunde, Dine værdier, Din USP, Dine fire indholdssøjler, og spørgsmålene til du/din. **Basen (`lektioner` og `lektion_oevelser`) bærer stadig I/jer og skal rettes dér: 5-3, 5-4, 5-5, 5-6 og 6-6.** |
| F13 Små mål | Ret | »Spring introen over« er 44 px. |
| F14 To velkomster | Ret | Forløbet-siden hedder »Forløbet«; hilsenen bor på Hjem. |
| F15 Notevalget | Ret | Pause er standard; feltet åbner med det samme. Valget kan stadig ændres under Indstillinger. |
| F16 Modulnavn i toplinjen | Ikke en fejl | Tomt felt kom af selens seeding (lektion uden video er ikke aktiv). Med video står »Mindset, motivation & retning«. |

## 6. Bridge-trådene 12/9

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
