#!/bin/bash
# DESIGNLAASENS MAALING (13/9): bygger selen uden for repoet, serverer den, aabner kundeappen paa 390 i headless
# Chromium og koerer probe-popups.js. Slutter med 0 ved "SELE LAAS OK", ellers 1. Bruges af GitHub-actionen og lokalt:
#   bash tools/designlaas/koer.sh            (finder selv chromium: $CHROME, playwright's, eller 'chromium'/'google-chrome')
set -u
ROD="$(cd "$(dirname "$0")/../.." && pwd)"
MAAL="${SELE_MAPPE:-$(mktemp -d)}"
python3 "$ROD/tools/designlaas/byg-sele.py" "$MAAL" || exit 1
C="${CHROME:-}"
if [ -z "$C" ]; then for k in "$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1)" "$(ls -d "$HOME"/.cache/ms-playwright/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1)" "$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux/chrome 2>/dev/null | head -1)" "$(command -v chromium)" "$(command -v chromium-browser)" "$(command -v google-chrome)"; do if [ -n "$k" ] && [ -x "$k" ]; then C="$k"; break; fi; done; fi
[ -z "$C" ] && { echo "SELE LAAS FEJL: ingen chromium fundet (saet CHROME=sti)"; exit 1; }
cd "$MAAL" || exit 1
python3 -m http.server 4600 >/dev/null 2>&1 &
SERVER=$!; sleep 1
K=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(open(sys.argv[1]).read()))" "$ROD/tools/designlaas/probe-popups.js")
UD=$(timeout 90 "$C" --headless=new --no-sandbox --disable-gpu --window-size=390,1200 --virtual-time-budget=20000 --enable-logging=stderr --v=0 --screenshot="$MAAL/laas.png" "http://127.0.0.1:4600/sele.html?vis=kunde&fil=index-sele.html&bred=390&kode=$K" 2>&1 | grep -a 'CONSOLE' | sed -E 's/^.*CONSOLE:[0-9]+\] //; s/", source:.*$//; s/^"//' | grep -a 'SELE LAAS')
kill "$SERVER" >/dev/null 2>&1
echo "$UD"
echo "$UD" | grep -q "SELE LAAS OK" && exit 0
echo "SELE LAAS FEJL: maalingen sagde ikke OK"; exit 1
