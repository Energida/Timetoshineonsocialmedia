// REALTID (19/11): koerer en side i headless Chrome i RIGTIG tid (ingen --virtual-time-budget), saa et frys i appen ogsaa er et frys i maalingen.
// Brug: node realtid.mjs <chrome> <url> <bredde> <hoejde> <sekunder> [film.dir]
// Skriver den foerste konsol-linje, der starter med "@@", og slutter. Med film.dir gemmes hvert billede (screencast) som JPG med tid i navnet.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const [chrome, url, b, h, sek, filmDir] = process.argv.slice(2);
if (typeof WebSocket === "undefined") { console.log("REALTID: Node " + process.version + " har ingen WebSocket — kræver Node 22 eller nyere"); process.exit(1); }
const prof = mkdtempSync(join(tmpdir(), "rt-prof-"));
const port = 9300 + Math.floor(Math.random() * 500);
const c = spawn(chrome, ["--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, `--window-size=${b},${h}`, "about:blank"], { stdio: "ignore" });
const slut = (kode) => { try { c.kill("SIGKILL"); } catch {} setTimeout(() => { try { rmSync(prof, { recursive: true, force: true }); } catch {} process.exit(kode); }, 300); };
setTimeout(() => { console.log("REALTID: tiden løb ud"); slut(1); }, (parseInt(sek, 10) + 20) * 1000);
let mal = null;
for (let i = 0; i < 60 && !mal; i++) { await new Promise((r) => setTimeout(r, 250)); try { const l = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); mal = l.find((x) => x.type === "page"); } catch {} }
if (!mal) { console.log("REALTID: Chrome startede ikke"); slut(1); }
const ws = new WebSocket(mal.webSocketDebuggerUrl);
let id = 0; const venter = new Map();
const send = (method, params = {}) => new Promise((ok) => { const n = ++id; venter.set(n, ok); ws.send(JSON.stringify({ id: n, method, params })); });
let n = 0;
ws.onmessage = async (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && venter.has(m.id)) { venter.get(m.id)(m.result); venter.delete(m.id); return; }
  if (m.method === "Runtime.consoleAPICalled") {
    const t = (m.params.args || []).map((a) => a.value).join(" ");
    if (String(t).startsWith("@@")) { console.log(t); slut(0); }
    if (String(t).startsWith("FILM ")) console.log(t);
  }
  if (m.method === "Page.screencastFrame") {
    send("Page.screencastFrameAck", { sessionId: m.params.sessionId });
    if (filmDir) writeFileSync(join(filmDir, String(++n).padStart(5, "0") + "-" + Math.round((m.params.metadata.timestamp || 0) * 1000) + ".jpg"), Buffer.from(m.params.data, "base64"));
  }
};
ws.onopen = async () => {
  await send("Runtime.enable"); await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: +b, height: +h, deviceScaleFactor: 1, mobile: +b < 900 });
  if (filmDir) { mkdirSync(filmDir, { recursive: true }); await send("Page.startScreencast", { format: "jpeg", quality: 60, everyNthFrame: 1, maxWidth: +b, maxHeight: +h }); }
  await send("Page.navigate", { url });
};
