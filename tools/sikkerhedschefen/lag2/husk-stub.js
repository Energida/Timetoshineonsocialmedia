/* SIKKERHEDSCHEFEN · LAG 2 · HUSKE-BASEN. Erstatter Supabase i selen med en base, der HUSKER (localStorage "SELE_DB"),
   saa gem → genindlaes → laes tilbage kan maales. localStorage "SELE_AFVIS" = "fejl" | "0" faar alle skrivninger til at
   blive afvist (fejl) eller ramme 0 raekker. Maa ALDRIG deployes; bygges kun uden for repoet. */
(function () {
  var KODE = (new URLSearchParams(location.search).get("selekode") || "HINGES2026").toUpperCase();
  var user = { id: "sele-test", email: "sele@test.dk", app_metadata: { kode: KODE }, user_metadata: { navn: "Test", hilsen: "Test", kode: KODE } };
  var session = { user: user, access_token: "sele", refresh_token: "sele", expires_at: 9999999999 };
  /* BASEN FOELGER MED MELLEM FASERNE: runneren skriver sele-db.json; den laeses synkront, foer appen spoerger om noget */
  try { if (!sessionStorage.getItem("SELE_DB_SAAET")) { var x = new XMLHttpRequest(); x.open("GET", "sele-db.json?t=" + Date.now(), false); x.send(); if (x.status === 200) { var j = JSON.parse(x.responseText || "{}"); Object.keys(j.ls || {}).forEach(function (k) { localStorage.setItem(k, j.ls[k]); }); } sessionStorage.setItem("SELE_DB_SAAET", "1"); } } catch (e) {}
  function db() { try { return JSON.parse(localStorage.getItem("SELE_DB") || "{}"); } catch (e) { return {}; } }
  function gem(d) { try { localStorage.setItem("SELE_DB", JSON.stringify(d)); } catch (e) {} }
  function afvis() { try { return localStorage.getItem("SELE_AFVIS") || ""; } catch (e) { return ""; } }
  function svar(v) { return new Promise(function (r) { setTimeout(function () { r(v); }, 5); }); }
  function builder(tabel) {
    var st = { op: "select", data: null, filtre: [], single: false, orden: null, graense: null, vilSelect: false };
    function match(r) { return st.filtre.every(function (f) { var v = r[f[1]];
      if (f[0] === "eq") return String(v) === String(f[2]); if (f[0] === "neq") return String(v) !== String(f[2]);
      if (f[0] === "in") return (f[2] || []).map(String).indexOf(String(v)) > -1; if (f[0] === "is") return (v == null) === (f[2] == null);
      if (f[0] === "gte") return v >= f[2]; if (f[0] === "lte") return v <= f[2]; if (f[0] === "gt") return v > f[2]; if (f[0] === "lt") return v < f[2];
      return true; }); }
    function koer() {
      var d = db(); var rk = d[tabel] = d[tabel] || []; var ud = [];
      var a = afvis(); var skriv = st.op !== "select";
      if (skriv && a === "fejl") return { data: null, error: { message: "afvist (sele)", code: "42501" }, status: 403 };
      if (skriv && a === "0") return { data: st.single ? null : [], error: null, status: 200 };
      if (st.op === "insert" || st.op === "upsert") {
        var nye = (Array.isArray(st.data) ? st.data : [st.data]).map(function (x, i) { return Object.assign({ id: (x && x.id) || ("sele-" + Date.now() + "-" + i + "-" + Math.round(Math.random() * 1e6)), created_at: new Date().toISOString() }, x); });
        var kon = (st.op === "upsert" && st.konflikt) ? String(st.konflikt).split(",").map(function (x) { return x.trim(); }) : null;   /* onConflict: "bruger,skema" — samme række opdateres (10/10) */
        nye.forEach(function (n) { var j = rk.findIndex(function (r) { return kon ? kon.every(function (c) { return String(r[c]) === String(n[c]); }) : String(r.id) === String(n.id); }); if (j > -1) { if (kon) delete n.id; rk[j] = Object.assign(rk[j], n); n = rk[j]; } else rk.push(n); });
        ud = nye;
      } else if (st.op === "update") { rk.forEach(function (r) { if (match(r)) { Object.assign(r, st.data); ud.push(r); } }); }
      else if (st.op === "delete") { d[tabel] = rk.filter(function (r) { if (match(r)) { ud.push(r); return false; } return true; }); }
      else { ud = rk.filter(match); if (st.orden) ud.sort(function (x, y) { var a1 = x[st.orden[0]], b1 = y[st.orden[0]]; return (a1 < b1 ? -1 : a1 > b1 ? 1 : 0) * (st.orden[1] ? 1 : -1); }); if (st.graense) ud = ud.slice(0, st.graense); }
      if (skriv) { gem(d); try { (window.__SELE_SKRIV = window.__SELE_SKRIV || []).push(st.op + " " + tabel); } catch (e) {} }
      var data = st.single ? (ud[0] || null) : ud;
      return { data: data, error: null, count: ud.length, status: 200 };
    }
    var p = new Proxy(function () {}, { get: function (mål, navn) {
      if (Object.prototype.hasOwnProperty.call(mål, navn)) return mål[navn];   /* appens dør (ÉN DØR UD TIL DATABASEN) sætter sin egen .then — den skal bruges, ellers testes døren aldrig (10/10) */
      if (navn === "then") return function (res, rej) { if (st.op !== "select" && afvis() === "net") return Promise.reject(new TypeError("Failed to fetch")).then(res, rej); return svar(koer()).then(res, rej); };   /* "net" = forbindelsen er væk midt i et gem */
      if (navn === "catch" || navn === "finally") return function () { return svar(koer()); };
      return function () { var a = arguments;
        if (["insert", "upsert", "update", "delete"].indexOf(navn) > -1) { st.op = navn; st.data = a[0]; st.konflikt = a[1] && a[1].onConflict; }
        else if (navn === "select") { st.vilSelect = true; }
        else if (["eq", "neq", "in", "is", "gte", "lte", "gt", "lt"].indexOf(navn) > -1) st.filtre.push([navn, a[0], a[1]]);
        else if (navn === "match") Object.keys(a[0] || {}).forEach(function (k) { st.filtre.push(["eq", k, a[0][k]]); });
        else if (navn === "order") st.orden = [a[0], !(a[1] && a[1].ascending === false)];
        else if (navn === "limit") st.graense = a[0];
        else if (navn === "single" || navn === "maybeSingle") st.single = true;
        return p; }; } });
    return p;
  }
  var sb = {
    from: function (t) { return builder(t); }, rpc: function () { return builder("__rpc"); },
    auth: { getUser: function () { return svar({ data: { user: user }, error: null }); }, getSession: function () { return svar({ data: { session: session }, error: null }); },
      onAuthStateChange: function (cb) { setTimeout(function () { try { cb("SIGNED_IN", session); } catch (e) {} }, 0); return { data: { subscription: { unsubscribe: function () {} } } }; },
      signInWithPassword: function () { return svar({ data: { user: user, session: session }, error: null }); }, signOut: function () { return svar({ error: null }); },
      updateUser: function () { return svar({ data: { user: user }, error: null }); }, setSession: function () { return svar({ data: { session: session, user: user }, error: null }); },
      refreshSession: function () { return svar({ data: { session: session, user: user }, error: null }); }, resetPasswordForEmail: function () { return svar({ data: {}, error: null }); },
      signUp: function () { return svar({ data: { user: user, session: session }, error: null }); } },
    channel: function () { var c = { on: function () { return c; }, subscribe: function () { return c; }, unsubscribe: function () {} }; return c; }, removeChannel: function () {},
    storage: { from: function () { return { getPublicUrl: function () { return { data: { publicUrl: "" } }; }, upload: function () { return svar({ data: null, error: null }); }, list: function () { return svar({ data: [], error: null }); }, remove: function () { return svar({ data: [], error: null }); } }; } },
    functions: { invoke: function () { return svar({ data: null, error: null }); } }
  };
  window.supabase = { createClient: function () { return sb; } };
  window.__SELE_SB = sb;
})();
