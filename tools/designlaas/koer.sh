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
if [ -z "$C" ]; then for k in "$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1)" "$(ls -d "$HOME"/.cache/ms-playwright/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1)" "$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux/chrome 2>/dev/null | head -1)" "$(command -v chromium)" "$(command -v chromium-browser)" "$(command -v google-chrome)"; do if [ -n "$k" ] && [ -x "$k" ]; then C="$k"; break; fi; done; fi
[ -z "$C" ] && { echo "SELE LAAS FEJL: ingen chromium fundet (saet CHROME=sti)"; exit 1; }
PORT=$(python3 -c "import socket;s=socket.socket();s.bind(('127.0.0.1',0));print(s.getsockname()[1]);s.close()")
cd "$MAAL" || exit 1
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
ryd() { kill "$SERVER" >/dev/null 2>&1; }
trap ryd EXIT
for i in 1 2 3 4 5 6 7 8 9 10; do curl -s -o /dev/null "http://127.0.0.1:$PORT/sele.html" && break; sleep 0.4; done
LEVERET=$(curl -s "http://127.0.0.1:$PORT/index-sele.html" | grep -c "const APP_VERSION = \"$VER\"")
[ "$LEVERET" = "0" ] && { echo "SELE LAAS FEJL: serveren paa port $PORT leverer ikke v$VER — maalingen ville have vaeret paa en anden kopi"; exit 1; }
K=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-popups.js")
UD=$(timeout 90 "$C" --headless=new --no-sandbox --disable-gpu --window-size=390,1200 --virtual-time-budget=20000 --enable-logging=stderr --v=0 --screenshot="$MAAL/laas.png" "http://127.0.0.1:$PORT/sele.html?vis=kunde&fil=index-sele.html&bred=390&kode=$K" 2>&1 | grep -a 'CONSOLE' | sed -E 's/^.*CONSOLE:[0-9]+\] //; s/", source:.*$//; s/^"//' | grep -a 'SELE LAAS')
echo "$UD"
# SIDEMAALINGEN (14/9): samme sele, anden probe — hele sider paa 390 (taeppet, sejlads, 44 px, kryds, emoji, streger i fliser)
K2=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-sider.js")
UD2=$(timeout 90 "$C" --headless=new --no-sandbox --disable-gpu --window-size=390,1200 --virtual-time-budget=40000 --enable-logging=stderr --v=0 --screenshot="$MAAL/sider.png" "http://127.0.0.1:$PORT/sele.html?vis=kunde&fil=index-sele.html&bred=390&kode=$K2" 2>&1 | grep -a 'CONSOLE' | sed -E 's/^.*CONSOLE:[0-9]+\] //; s/", source:.*$//; s/^"//' | grep -a 'SELE SIDER')
echo "$UD2"
echo "$UD" | grep -q "SELE LAAS OK" && echo "$UD2" | grep -q "SELE SIDER OK" && exit 0
echo "SELE LAAS FEJL: maalingen sagde ikke OK"; exit 1
