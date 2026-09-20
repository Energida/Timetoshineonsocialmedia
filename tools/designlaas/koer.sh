#!/bin/bash
# DESIGNLAASENS MAALING: bygger selen uden for repoet, serverer den paa en LEDIG port, aabner kundeappen
# paa 390 i headless Chromium og koerer probe-popups.js. Slutter med 0 ved "SELE LAAS OK", ellers 1.
#   bash tools/designlaas/koer.sh          (finder selv chromium; ellers saet CHROME=<sti>)
#
# PORTEN SKAL VAERE LEDIG, OG BYGGET SKAL VERIFICERES (14/9). Foer brugte scriptet 4600 blindt. Var porten
# optaget af en aeldre server, loed maalingen paa en GAMMEL kopi af appen — den kunne baade bestaa og fejle
# uden grund. Nu vaelges en ledig port, og vi tjekker, at det, serveren leverer, ER det, vi lige byggede.
set -u
ROD="$(cd "$(dirname "$0")/../.." && pwd)"
MAAL="${SELE_MAPPE:-$(mktemp -d)}"
python3 "$ROD/tools/designlaas/byg-sele.py" "$MAAL" || exit 1
VER=$(grep -o 'const APP_VERSION = "[0-9]*"' "$ROD/index.html" | head -1 | grep -o '[0-9]*')
[ -z "$VER" ] && { echo "SELE LAAS FEJL: kunne ikke laese APP_VERSION"; exit 1; }
C="${CHROME:-}"
# DEN FULDE CHROMIUM FOERST (15/9): porten paa GitHub faldt efter 4 sek. siden 13/9 — playwright 1.47 lægger BAADE
# chromium-1134 og chromium_headless_shell-1134, og scriptet tog headless_shell foerst. Den kender ikke --headless=new
# paa samme maade, og saa kom der ingen CONSOLE-linjer, og maalingen sagde »ikke OK« uden at have maalt. Nu tages den
# fulde chromium foerst (maalt paa Mac 15/9: SELE LAAS OK), headless_shell kun som sidste udvej — og MED --headless.
if [ -z "$C" ]; then for k in "$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux/chrome 2>/dev/null | head -1)" "$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome 2>/dev/null | head -1)" "$(ls -d "$HOME"/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium 2>/dev/null | head -1)" "$(command -v chromium)" "$(command -v chromium-browser)" "$(command -v google-chrome)" "$(ls -d "$HOME"/.cache/ms-playwright/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1)" "$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1)"; do if [ -n "$k" ] && [ -x "$k" ]; then C="$k"; break; fi; done; fi
[ -z "$C" ] && { echo "SELE LAAS FEJL: ingen chromium fundet (saet CHROME=sti)"; exit 1; }
echo "SELE chromium: $C"
HL="--headless=new"; case "$C" in *headless_shell*) HL="--headless";; esac
TO=""; command -v timeout >/dev/null 2>&1 && TO="timeout 90"; command -v gtimeout >/dev/null 2>&1 && [ -z "$TO" ] && TO="gtimeout 90"
PORT=$(python3 -c "import socket;s=socket.socket();s.bind(('127.0.0.1',0));print(s.getsockname()[1]);s.close()")
cd "$MAAL" || exit 1
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
# RYD OP (15/9): mktemp-mappen blev efterladt ved hver koersel (17 MB pr. gang) og fyldte disken paa en eftermiddag. Kun vores egen mappe slettes.
ryd() { kill "$SERVER" >/dev/null 2>&1; if [ -z "${SELE_MAPPE:-}" ] && [ -f "$MAAL/sele.html" ]; then rm -rf "$MAAL"; fi; }
trap ryd EXIT
for i in 1 2 3 4 5 6 7 8 9 10; do curl -s -o /dev/null "http://127.0.0.1:$PORT/sele.html" && break; sleep 0.4; done
LEVERET=$(curl -s "http://127.0.0.1:$PORT/index-sele.html" | grep -c "const APP_VERSION = \"$VER\"")
[ "$LEVERET" = "0" ] && { echo "SELE LAAS FEJL: serveren paa port $PORT leverer ikke v$VER — maalingen ville have vaeret paa en anden kopi"; exit 1; }
K=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-popups.js")
RAA=$($TO "$C" $HL --no-sandbox --disable-gpu --window-size=390,1200 --virtual-time-budget=20000 --enable-logging=stderr --v=0 --screenshot="$MAAL/laas.png" "http://127.0.0.1:$PORT/sele.html?vis=kunde&fil=index-sele.html&bred=390&kode=$K" 2>&1)
UD=$(echo "$RAA" | grep -a 'CONSOLE' | sed -E 's/^.*CONSOLE[:(][0-9]+\)?\] //; s/", source:.*$//; s/^"//' | grep -a 'SELE LAAS')
echo "$UD"
# Kom der ingen maaling, skal loggen sige HVORFOR — ikke bare »ikke OK« (15/9).
[ -z "$UD" ] && { echo "SELE LAAS FEJL: ingen maaling fra chromium — de foerste linjer af, hvad den sagde:"; echo "$RAA" | head -20; }
# SIDEMAALINGEN (14/9): samme sele, anden probe — hele sider paa 390 (taeppet, sejlads, 44 px, kryds, emoji, streger i fliser)
K2=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-sider.js")
RAA2=$($TO "$C" $HL --no-sandbox --disable-gpu --window-size=390,1200 --virtual-time-budget=40000 --enable-logging=stderr --v=0 --screenshot="$MAAL/sider.png" "http://127.0.0.1:$PORT/sele.html?vis=kunde&fil=index-sele.html&bred=390&kode=$K2" 2>&1)
UD2=$(echo "$RAA2" | grep -a 'CONSOLE' | sed -E 's/^.*CONSOLE[:(][0-9]+\)?\] //; s/", source:.*$//; s/^"//' | grep -a 'SELE SIDER')
echo "$UD2"
[ -z "$UD2" ] && { echo "SELE SIDER FEJL: ingen maaling fra chromium — de foerste linjer:"; echo "$RAA2" | head -20; }
# SKINNE-MAALINGEN (LOVET Ida 20/9 kl. 21.50): samme sideprobe paa 1440 med FRIGJORT menu (body.nav-smal) — intet under skinnen, intet klippet.
K4=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote('window.SELE_SMAL=1;' + open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-sider.js")
RAA4=$($TO "$C" $HL --no-sandbox --disable-gpu --window-size=1480,1000 --virtual-time-budget=40000 --enable-logging=stderr --v=0 --screenshot="$MAAL/smal.png" "http://127.0.0.1:$PORT/sele.html?vis=kunde&fil=index-sele.html&bred=1440&hoej=940&kode=$K4" 2>&1)
UD4=$(echo "$RAA4" | grep -a 'CONSOLE' | sed -E 's/^.*CONSOLE[:(][0-9]+\)?\] //; s/", source:.*$//; s/^"//' | grep -a 'SELE SIDER')
echo "$UD4" | sed 's/^SELE SIDER/SELE SMAL/'
[ -z "$UD4" ] && { echo "SELE SMAL FEJL: ingen maaling fra chromium — de foerste linjer:"; echo "$RAA4" | head -20; }
# BUD-LAASEN (LOVET Ida 20/9 kl. 21.50): det klikkede buds loefter som maalinger — paa 390 og 1440, fuld og tom forside.
K5=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-bud.js")
RAA5=$($TO "$C" $HL --no-sandbox --disable-gpu --window-size=390,1200 --virtual-time-budget=30000 --enable-logging=stderr --v=0 --screenshot="$MAAL/bud390.png" "http://127.0.0.1:$PORT/sele.html?vis=kunde&fil=index-sele.html%3Fselekode%3DHINGES2026&bred=390&hoej=1600&kode=$K5" 2>&1)
UD5=$(echo "$RAA5" | grep -a 'CONSOLE' | sed -E 's/^.*CONSOLE[:(][0-9]+\)?\] //; s/", source:.*$//; s/^"//' | grep -a 'SELE BUD')
echo "$UD5"
[ -z "$UD5" ] && { echo "SELE BUD FEJL (390): ingen maaling fra chromium"; echo "$RAA5" | grep -a 'CONSOLE' | tail -10 | cut -c1-300; }
RAA6=$($TO "$C" $HL --no-sandbox --disable-gpu --window-size=1480,1000 --virtual-time-budget=30000 --enable-logging=stderr --v=0 --screenshot="$MAAL/bud1440.png" "http://127.0.0.1:$PORT/sele.html?vis=kunde&fil=index-sele.html%3Fselekode%3DHINGES2026&bred=1440&hoej=940&kode=$K5" 2>&1)
UD6=$(echo "$RAA6" | grep -a 'CONSOLE' | sed -E 's/^.*CONSOLE[:(][0-9]+\)?\] //; s/", source:.*$//; s/^"//' | grep -a 'SELE BUD')
echo "$UD6"
[ -z "$UD6" ] && { echo "SELE BUD FEJL (1440): ingen maaling fra chromium"; echo "$RAA6" | grep -a 'CONSOLE' | tail -10 | cut -c1-300; }
# UX-POLITIET (Ida 20/9 kl. 22.28): hele b2b paa 390 og 1440 (fast + frigjort) — Didot uden for heroen, fed Poppins, »skriv«, lange streger, I/jer, koen, native vaelgere, klip, lys graa paa laeselinjer. Nul fund er kravet.
K7=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-ux.js")
K8=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote('window.SELE_SMAL=1;' + open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-ux.js")
UX_OK=1
for UXK in "390 1200 $K7" "1440 940 $K7" "1440 940 $K8"; do
  set -- $UXK
  RAAX=$($TO "$C" $HL --no-sandbox --disable-gpu --window-size=$(($1+40)),$(($2+60)) --virtual-time-budget=60000 --enable-logging=stderr --v=0 --screenshot="$MAAL/ux-$1.png" "http://127.0.0.1:$PORT/sele.html?vis=kunde&fil=index-sele.html%3Fselekode%3DHINGES2026&bred=$1&hoej=$2&kode=$3" 2>&1)
  UDX=$(echo "$RAAX" | grep -a 'CONSOLE' | sed -E 's/^.*CONSOLE[:(][0-9]+\)?\] //; s/", source:.*$//; s/^"//' | grep -a 'SELE UX')
  echo "$UDX" | grep -v "SELE UX SUM 0 " | head -30
  echo "$UDX" | grep -q "SELE UX SUM 0 " || UX_OK=0
done
[ "$UX_OK" = "1" ] && echo "SELE UX OK: nul fund paa 390, 1440 og 1440 frigjort" || echo "SELE UX FEJL: fund staar ovenfor"
# BACKSTAGE (20/9, Idas ord: »hver eneste side i loop«): probe-backstage.js paa 390 og 1440 — markbaandet som hero, 32 px luft, hvid side, trykfelter, streger, kryds, emoji.
K9=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-backstage.js")
K10=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[2] + open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-backstage.js" "document.body.classList.add('dash-nav');")
BS_OK=1
for BSK in "390 1200 $K9" "1440 1300 $K10"; do
  set -- $BSK
  RAAB=$($TO "$C" $HL --no-sandbox --disable-gpu --window-size=$(($1+40)),$(($2+40)) --virtual-time-budget=120000 --enable-logging=stderr --v=0 --screenshot="$MAAL/backstage-$1.png" "http://127.0.0.1:$PORT/sele.html?vis=dash&side=overblik&fil=index-sele.html&bred=$1&hoej=$2&kode=$3" 2>&1)
  UDB=$(echo "$RAAB" | grep -a 'CONSOLE' | sed -E 's/^.*CONSOLE[:(][0-9]+\)?\] //; s/", source:.*$//; s/^"//' | grep -a 'SELE BACKSTAGE')
  echo "$UDB" | sed "s/^/[$1] /"
  echo "$UDB" | grep -q "SELE BACKSTAGE OK" || BS_OK=0
done
[ "$BS_OK" = "1" ] && echo "SELE BACKSTAGE OK: alle sider holder laasen paa 390 og 1440" || echo "SELE BACKSTAGE FEJL: fund staar ovenfor"
# ENS-PORTEN FOR BRIEFEN (17/9, Idas ord: »inden der bygges noget, kontrolleres systemet for hvordan de andre funktioner omkring ser ud«):
# briefen paa 1440 — forsiden + alle skrivetrin — piller, chips, versaler, fliser, felter og bjaelker skal vaere ens, og intet maa vaere rosa.
K3=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-brief.js")
RAA3=$($TO "$C" $HL --no-sandbox --disable-gpu --window-size=1480,1000 --virtual-time-budget=30000 --enable-logging=stderr --v=0 --screenshot="$MAAL/brief.png" "http://127.0.0.1:$PORT/sele.html?vis=kunde&fil=index-sele.html%3Fselekode%3DACORNS2026&bred=1440&hoej=940&kode=$K3" 2>&1)
UD3=$(echo "$RAA3" | grep -a 'CONSOLE' | sed -E 's/^.*CONSOLE[:(][0-9]+\)?\] //; s/", source:.*$//; s/^"//' | grep -a 'SELE BRIEF')
echo "$UD3"
[ -z "$UD3" ] && { echo "SELE BRIEF FEJL: ingen maaling fra chromium — de SIDSTE 30 konsollinjer (18/9: de foerste 20 var kun opstartsstoej):"; echo "$RAA3" | grep -a 'CONSOLE' | tail -30 | cut -c1-400; echo "--- og de foerste 5 raa linjer:"; echo "$RAA3" | head -5; }
echo "$UD" | grep -q "SELE LAAS OK" && echo "$UD2" | grep -q "SELE SIDER OK" && echo "$UD4" | grep -q "SELE SIDER OK" && echo "$UD5" | grep -q "SELE BUD OK" && echo "$UD6" | grep -q "SELE BUD OK" && [ "$UX_OK" = "1" ] && [ "$BS_OK" = "1" ] && echo "$UD3" | grep -q "SELE BRIEF OK" && exit 0
echo "SELE LAAS FEJL: maalingen sagde ikke OK"; exit 1
