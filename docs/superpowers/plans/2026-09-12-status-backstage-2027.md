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

## 5d. v1860: lektionssiden moderniseret (Idas klik 13/9 på mockup-lærredet »Lektionssiden mockups«)

Idas spørgsmål: er det det mest moderne og mobilvenlige design? Svaret var nej på fire punkter. Mockups blev tegnet først (otte tavler, telefon, computer og telefonen drejet), og Ida klikkede ja til alt plus to ønsker undervejs.

| Ønske | Bygget |
|---|---|
| Intet om øvelsen, før videoen er set (Idas ønske) | Lektionen viser én rød knap, »Færdig — videre«. Øvelsen tilbydes først i færdig-kortet. Er lektionen set, står øvelsen som den røde, til den er taget. |
| Fast handlingsbjælke på telefonen | `.lek-bar`: fast i bunden, 48 px, over safe-area. Kun kursus-lektionen; Workout Studios lektion i samme `#lekVis` er uændret. Noten er en pille ved titlen. |
| Større skrift | Titel 22, forløbsliste 14, moduletiketter 11, spørgsmål 19, tekstfelt 16 (iPhone zoomer ikke). Variablerne `--lek-rk`/`--lek-mh` sættes kun under 700 px. |
| Øvelsen som bundark | `ov-ark` på `#ideBack` under 760 px: greb, glid op, feltet lige over tastaturet. Computeren beholder midterpopup'en. Luk-knappen bliver (8/9-reglen: intet kryds på telefonen). |
| Færdig-øjeblik | `lekMoment(id, art)`: flueben, tallet der rykker (bar animeres fra før til nu), »Næste: …«, stjernerne fra den gamle refleksions-popup (Idas klik: stjernerne herind, skrivefeltet ud; `REFLEKSION_PROMPTS` står i koden, `refleksionVis("lektion")` kaldes ikke længere), én rød knap. Med øvelse: »Nu øvelsen« / »Tag øvelsen (N spørgsmål)« / »Senere«. Uden stjerner at give går kortet selv videre efter 2,5 s. Efter en gennemført øvelse vises kortet også. |
| Videoen slutter af sig selv | `<video onended>` og Vimeo-API'ets »ended« via postMessage (`lekVimeoLyt`) kalder `lekVideoSlut` → færdig-kortet uden tryk. |
| Telefonen drejet | Medieregel (liggende, højde ≤ 520): videoen fylder hele skærmen, alt andet skjules, »Tilbage« som pille øverst. iPhone følger rotationen, når rotationslåsen er fra; appen kan ikke tvinge den. Android: `screen.orientation.lock("landscape")` ved fuld skærm, `unlock` når den forlades. |

Målt i selen 13/9: 390 (bjælke 358×48 fast, ark med greb, felt 16 px), 1440 (én rød knap 120×32, kortet centreret, bar 50 %), 844×390 (video 0,0 fuld bredde, top og bjælke skjult, Tilbage synlig).

## 5e. v1861: stjerner og kommentar på hver lektion, læst i Backstage (Ida 13/9)

Idas ord: »bedømme videoen med stjerner fra et til fem og ... tilføje kommentar ... at den feedback så lander inde i studio på hver lektion så jeg kan se hvad de rater og se deres kommentar«.

- **Kunden:** færdig-kortet har »Hvordan var videoen?« med fem stjerner og linket »Skriv en kommentar til videoen«, der folder et felt ud (16 px). Begge gemmes, når kortet forlades, uanset vej (knap, Bliv, kryds, klik udenfor): `lekMomentFeedbackGem` → `skemaSvarSkriv("lektion_feedback_<id>", { stjerner, kommentar, dato, lektion })`, én række pr. person pr. lektion. Vises til lektionen er vurderet (`reflSet`).
- **Backstage, produktionstavlen:** `klipFeedbackHent` henter alle `lektion_feedback_%`-rækker én gang, når tavlen hentes. Hvert lektionskort får en chip »★ 4,0 (3)« ved statussen og afsnittet »Kundernes feedback« nederst: snit, antal vurderinger og kommentarerne i Didot-kursiv med navn, virksomhed, dato og stjerner. Intet afsnit uden feedback. Kun læsning, ingen ny tabel, ingen ny policy. **Kan admin ikke læse andre koders skema_svar-rækker (RLS), står der intet; det skal Ida tjekke live på en lektion, der har fået en vurdering.**
- **Kundekortet (Aktivitet):** kommentaren fra feedback-rækken vises som kundens note under lektionen, som de gamle refleksionsnoter.

## 5f. v1862: oplæsning af briefen (hængeparti 1, Ida 13/9: ordblind kunde)

Samme motor som Backstages manus-oplæsning (Web Speech, dansk stemme, ingen server). Én knap læser det, der er fremme, og trykket igen stopper. Teksten deles i stykker pr. flise, så Chrome ikke stopper midt i. Sideskift stopper oplæsningen.

- **Overblikket, computer:** højtaler-symbol i symbolrækken ved blyant, mappe og del. Læser titlen og hver flise: etiket og svar, klip for klip.
- **Overblikket, telefon:** lang hvid knap »Læs briefen op« øverst i knaprækken under rammen (topraekken er skjult på telefonen siden 8/9). Læser de synlige fliser; foldede fliser springes over.
- **Spørgsmålene, telefon:** højtaler ved opslagets titel i hovedet. Læser spørgsmålet, hjælpen og kundens svar.
- **Spørgsmålene, computer:** højtaler i topraekken. Læser alle synlige spørgsmål på siden med svar.

Målt i selen: 390 og 1440, overblik og spørgsmål, tekststykkerne logget. Ikke målt: selve stemmen (kræver en rigtig telefon). På iPhone er den danske stemme med som standard; er den ikke installeret, læser telefonen med en anden stemme.

## 5g. v1863: billede, kamera og link på Ny idé (hængeparti 2, Ida 13/9)

- **Ny idé (plusset og swipe op):** under feltet står pillen »Vedhæft billede eller link«. Den folder tre valg ud: Tag et billede (kameraet direkte, `capture="environment"`), Fra kamerarullen, Indsæt et link. Billedet gøres lille på telefonen (længste side 1200 px, jpeg, `foodBilledeSkaler`), lander i bucket `inspiration` under kundens kode og som række i tabellen `inspiration`, og hægtes på idéen som i dag: `INSP_VEDHAEFT` → »Inspiration: <url>« i briefens beskrivelse. Linket gemmes også på inspirationsvæggen med idéens tekst som note. Vedhæftningen vises som en lille flise med kryds; kryds fjerner den fra idéen (billedet bliver på væggen).
- **Idékortet i Idébanken:** har idéen et billede, står det som 40 px kvadrat før titlen (`ideInspUrl`, `erBilledeUrl`).
- **»Jeg har set noget fedt«:** ny rød knap »Tag et billede nu« (kameraet), kamerarullen som hvid knap under. Alle billeder til væggen gøres små før upload.
- Ingen ny tabel, ingen ny policy, ingen ny lagerplads: samme bucket og tabel som væggen har haft siden 30/7.
- Målt i selen på 390 og 1440: valgrækken, linkflisen (instagram.com), billedflisen, kortets miniature, kamera-feltet. Selve upload og kameraet kræver en rigtig telefon og basen.

## 5h. v1864: Indbakke-360 (hængeparti 4, Ida 13/9)

Målt i koden: hvilke hændelser lander hvor, for Ida (Backstage: Venter på dig på Hjem, kundekortet og Indbakken) og for kunden (Indbakken i appen og Indbakke-kortet på Hjem).

| Hændelse | Ida så det før | Kunden så det før | Nu |
|---|---|---|---|
| Kunden sender til Ida | Venter på dig (Godkend) | (egen brief: »Venter på Ida«) | Uændret |
| Ida sender til kunden | (egen brief) | **Ingen steder i Indbakken.** `GODK_KOE` fyldes kun på Backstages forside, så kundens »Afventer din godkendelse« var altid tom. Kun briefens bjælke sagde det. | Kundens egne opslag er kilden: sendt TIL mig (ikke AF mig) står under Afventer din godkendelse med afsender, tid og note. Åbner briefen direkte. |
| Kunden godkender Idas brief | **Ingen steder** | (egen brief) | Venter på dig: »Godkendt af Rikke« med OK, der kvitterer (set-mærke på enheden). |
| Kunden sender Idas brief retur med kommentar | **Ingen steder** | (egen brief) | Venter på dig: »Sendt retur af Rikke · kommentar«, Åbn / Set. |
| Ida godkender kundens brief | (status) | **Kun i briefen** | Til orientering: »… er godkendt af Ida« med Idas kommentar og »Vælg dato«, når der ingen dato er. |
| Ida sender kundens brief retur | (status) | **Kun i briefen** | Til orientering: »… er sendt retur af Ida« med kommentaren, Åbn briefen. |
| Kommentar på briefen (begge veje) | Venter på dig: »Kommentar fra …« | **Kun i briefen** | Til orientering: »Ida har kommenteret …« med teksten, Svar. |
| Er det postet? | Venter på dig (kunder Ida poster for) | Indbakken øverst | Uændret |
| To-do til dig | Venter på dig (ansvarlig Ida) | Til dig | Uændret |
| Tøm hovedet-noter | (kundekortet) | Det du har skrevet ned | Uændret |

Orienteringsrækker hos kunden forsvinder, når de er åbnet (`ibSetMark`, pr. kode på enheden). Idas »godkendt«- og »retur«-rækker kvitteres med OK/Set (`bsVenterSetMark`). Rækkebygningen for Backstage er én ren funktion, `venterRaekkerFra(rows, mig, idag)`, målt i selen med seks opslag. Kundens Indbakke målt på 390 med fem opslag: én under Afventer (den fra Ida), tre under Til orientering, og den, kunden selv sendte til Ida, står ikke som hendes opgave.

Ikke rørt: teamet (klipperen) har sin egen kæde på produktionstavlen (Klippet → Til din godkendelse), og »Ønsker til appen« er hængeparti 3. Den tomme tekst under Til orientering sagde »Ingen aftaler i kalenderen lige nu« (aftalerne flyttede til Hjem 3/8); nu »Ingenting nyt«.

## 5i. v1865: Ønsker til appen (hængeparti 3, Ida 13/9)

- **Kunden:** »Ønsker til appen« under Mere (telefon) og i profilmenuen (computer), lige efter Min profil. Åbner arket (den ene popup-form, 11/9): »Hvad ville gøre appen bedre?«, Ida læser det selv. Send gemmer ønsket som liste på kundens egen række i skema_svar (skema `app_oensker`, én pr. person, samme mønster som Tøm hovedet-noterne). Kvittering: »Sendt til Ida. Tak.« Ingen ny tabel, ingen ny policy.
- **Ida:** hvert ønske står i Venter på dig (Hjem, kundekortet, Indbakken) som »Ønske til appen fra Rikke · dato« med teksten og Set, der kvitterer (set-mærke på enheden). Kan lægges på to-do fra Indbakken som alle andre rækker.
- Målt i selen: menuen, arket, kvitteringen. Ikke bygget: svar tilbage til kunden med status (modtaget / på vej / bygget). Det kræver en skrivevej fra Backstage til kundens Indbakke og hører under Indbakke-360 næste runde.

## 5j. v1866: Drejebog-synk målt (hængeparti 5, Ida 13/9)

Idas ønske: at kunne stole på, at en rettet byggesten slår igennem alle steder, på telefon og computer.

**Målt i selen** (390 og 1440) med en generation, der siger »GAMMEL«, og byggesten rettet til »NY« under Tilpas drejebog:

| Flade | Læser | Resultat |
|---|---|---|
| Drejebogens 16 sider (`bsBogSider` via `bsBogRaastof`) | `CURRENT_DEF.strategi` lagt oven på generationen | Alle fire NY (drivkraft, USP, kernekunde med navn og tekst, værdier). Ingen GAMMEL. |
| Briefens »Fra brandstrategien« (`brandDelData`) | `CURRENT_DEF.strategi` | 1A USP, 1B kernekunden, 2A drivkraften, 2B værdierne: alle NY. |
| Tilpas drejebog (`byggTegn`) | samme | Viser NY. På telefonen stables rækkerne (label over tekst). |

Kæden efter Gem: `byggGem` skriver `kunde_strategi.byggesten`, henter forfra gennem den ene dør (`hentStrategiOverride` → `loadForloebStrategi` → `CURRENT_DEF.strategi`) og tegner siden igen. Drejebogen hentes og tegnes forfra ved hver åbning; briefen tegner sin boks ved hver åbning. Der er ingen cache imellem.

**Rettet:** Ret/Skriv-knapperne på Tilpas drejebog var 26 × 12 px på telefonen; nu 44 px. Og Drejebogens port »er der grundlag?« kendte kun generationen; nu tæller kundens egne byggesten med, så en kunde med rettelser men uden ny generation ikke får »tom bog«.

**Ikke rørt, men værd at vide:** de fire indholdssøjlers tekster (side 3-4 og 11-14) kommer fra generationen alene; kunden retter eksempler og hooks pr. søjle, ikke søjlens grundtekst. Det er efter reglen 17/8 (kun ejeren af strategien retter byggesten) og valget 25/8.

## 5k. v1867: mål for prøvereels og story-dage på Performance (hængeparti 6a, Ida 13/9)

- **Prøvereels om måneden:** ny flise under Målsætninger på Performance. Målet gemmes i `perf_maal.proeve` (samme række som rate og fokus). Flisen viser »1 af 2«: postede opslag i denne måned med indholdssøjlen Prøvereel mod målet. Ret via arket som de andre.
- **Story-dage:** ny flise, der viser de faste dage (»Ma · On · Fr«) fra `MAALS.storyDage`, den liste forsidens check-ind allerede læser. Trykket åbner en lille popup med de syv runde dagknapper (44 px); hvert tryk gemmes med kvittering (`maalsGem`).
- Målt i selen på 390: fliserne »Opslag om ugen 3 · Prøvereels om måneden 1 af 2 · Story-dage Ma · On · Fr · Interaktionsrate 5 % · Månedens fokus sæt et mål« og dagvælgeren.
- Ikke rørt: selve planlægningsritualet (hængeparti 6b/8) tegnes som mockups først.

## 5l. v1868: dagen efter et opslag (hængeparti 7, Ida 13/9)

- »Er det postet?« fandtes allerede (7/9) øverst i kundens Indbakke og i Idas Venter på dig. Nyt: når kunden trykker »Ja, postet«, kommer ét kort: »Hvordan gik det?« med to frivillige felter, Hvad gik godt? og Hvad var svært? Gem eller Spring over. Svaret bor på opslaget (`brief.refleksion` med godt, svært, dato) via `ideUpdate`, ingen ny tabel.
- **Backstage, kundens side:** afsnittet »Efter opslagene« med de fem nyeste refleksioner (dato, opslag, Godt, Svært). Intet afsnit uden refleksioner. `__ALLE_OPSLAG` bærer nu refleksionen med.
- Ikke push: appen har ingen push-notifikationer. Kortet står i Indbakken og på Hjem, til kunden svarer. Push er kontraktarbejde (serviceworker, server, nøgler) og tages separat, hvis Ida vil.
- Målt i selen på 390: kortet efter Ja, postet; gemt refleksion på opslaget; Backstage-afsnittet med ét opslag.

## 5m. v1869: Planlægningsdagen som fem trin (hængeparti 6b og 8, Ida 13/9)

Bygget efter mockups (»Planlægningsdagen mockups«) og Idas tre klik: de fem trin som tegnet; månedsplanlægning ved første planlægning i en ny måned; appen skriver forslagene ud fra Drejebogen, ingen AI-kald.

- **Døren:** ét rødt kort på Hjem, »I dag er planlægningsdag · Uge N på 25 minutter«, med de fem trin listet og knappen Start planlægningen. Vises når den faste planlægningsdag (`plan_dato`) er i dag eller passeret, og ugen ikke allerede er planlagt. På computeren ligger kortet lige før I DAG (`#planRitKort`, order 39); på telefonen tegner facittet det samme indhold under I DAG-flisen (`planRitKortHtml` er ét sted). Den gamle I DAG-række »I dag er vores planlægningsdag« viger, når ritualet kan køres (dublet-reglen). Ritualet er ikke tilgængeligt for kunder uden Content (`funkTaendt`).
- **Status:** `skema_svar` række `plan_ritual` (navn config) med sidst, uge, tid, maanedPlan. Ingen ny tabel.
- **Måneden (trin 0):** første planlægning i en ny måned (ugens torsdag afgør måneden) starter med fem spørgsmål, ét ad gangen: tema, kundernes udfordring, hvad sker i butikken, hvad virkede sidste år, det ene mål. Temaet gemmes i `maanedens_tema` (samme række som Content-siden og Hjem læser), alle fem i `plan_maaned_<YYYY-MM>`.
- **Trin 1 Tilbageblik:** sidste syv dages opslag med status. Ikke-postede får Postet / Nej (Nej åbner ny dato). Postede uden refleksion får »Hvordan gik det?« med samme to felter som v1868 (`brief.refleksion`). Ugens tal: postet af planlagt, prøvereels, faste story-dage.
- **Trin 2 Næste uge:** appen foreslår op til fire opslag: antallet er ugemålet minus det, der allerede ligger i næste uge; søjlerne er dem, næste uge mangler, i Drejebogens rotation. Teksten er kundens egne eksempler fra Drejebogen (`egneFor`), ellers grundtekstens eksempler, ellers hooks. Månedens tema hentes fra `maanedens_tema` og vises i forklaringen. Pr. forslag: dagchip (forvalgt fra `MAALS.naesteDage`), Andet forslag, Skriv min egen, Ikke denne uge. »Læg de N i kalenderen« opretter dem via `ideAdd` som Planlagt Reel med `brief.beskrivelse` og `brief.fraPlanlaegning`.
- **Trin 3 Optagedage:** samlet på én dag (dag og tidsrum) eller pr. opslag. Gemmes som `brief.optagedag` og `brief.optagetid` på hvert opslag i ugen.
- **Trin 4 Ugens mål:** de fire Performance-fliser (opslag, prøvereels, story-dage, fokus) i samme motor (`perfMaalRet`), rettes her.
- **Trin 5 Book næste:** dag i næste uge og klokkeslæt; »Læg i min kalender (.ics)«; Færdig gemmer `plan_dato` (`setPlanDato`) og ritualstatus. Færdig-kortet er det samme som lektionens (ring, Godt gået, næste planlægning).
- Målt i selen på 390 og 1440: Hjem-kortet på begge flader; de fem månedsspørgsmål og temaet gemt; tilbageblik med Postet og refleksion på opslaget; tre forslag (1A, 1B, 2A) oprettet i kalenderen med dato; optagedag på alle tre; målfliserne; book med 11 chips og .ics; status `{sidst, uge, tid, maanedPlan}`; efter Tilbage til Hjem er kortet væk.
- Ikke bygget: notifikation på dagen (ingen push i appen, jf. 5l). Forslagenes »hvorfor« står ikke på kortet, kun søjlen der mangler.

## 5n. v1870: svarvejen på ønsker til appen (hængeparti 3b, Ida 13/9)

- **Backstage:** rækken »Ønske til appen fra …« i Venter på dig og Indbakken har nu Svar og Set. Svar åbner arket (samme popup-form som kundens), Ida skriver, og svaret gemmes PÅ ønsket i kundens egen `app_oensker`-række (`svar: {t, af, dato}`). Ingen ny tabel, ingen ny policy. Besvarede ønsker forsvinder fra listen; Set gemmer set-mærket på enheden som før.
- **Kunden:** egne ønsker hentes én gang pr. session (`APP_OENSKER`, samme mønster som noterne). Et svar står i Indbakken under Til orientering: »Ida har svaret på dit ønske: …« med svaret og datoen, knap Set. Rækken tæller med i klokkens prik på telefonen (orienteringsrækker tæller nu med der, så et svar kan ses). Arkets undertekst siger nu, hvad der sker: »Svarer hun, står svaret i Indbakken.«
- Målt i selen: Backstage 1440 (rækken med Svar/Set, arket, kvittering »Sendt til Rikke.«, svaret på ønsket, rækken væk bagefter); kunden 390 (orienteringsrækken, prikken i klokken, Set fjerner rækken).
- Ikke målt live: at Ida (admin) må læse og opdatere andre koders `skema_svar`-rækker under RLS. Læsningen bruges allerede af Venter på dig; opdateringen er ny og skal prøves i drift én gang.

## 5o. v1871: kortenes knapper er lange knapper på telefonen (Ida 13/9)

- Ida så mockups af Inspirationssiden med det lille røde »Lav til idé« og reagerede: alle knapper på mobilskærm skal være knapper, der går hele vejen over. Reglen fandtes for briefen og navigationen (`bsam-mobknap`), men kortene på Inspiration og Arkivet havde stadig små røde ord.
- **Nu:** kortets handlinger står i én stak `.kort-knapper`. På telefonen (op til 760 px) bliver hvert ord en lang knap: hvid flade, rød tekst, 48 px, primær øverst; den dæmpede (Slet, Gendan) har grå tekst. På computeren står de som før, små røde ord til højre.
- Rettet: Inspiration (Lav til idé, Slet), Arkivet (Genbrug idéen, Gendan) og tre steder i briefen (»Se tidligere opslag fra søjlen i Arkivet«, »Skift« ved CTA'en, »Åbn Drive-mappen«).
- Målt i selen på 390: Inspiration 324×48 pr. knap, Arkivet 316×48; på 1440 uændret (79×14).
- Mockups af Inspiration med previews (canvas »Inspiration previews« og PDF) rettet, så de viser de samme lange knapper.

## 5p. v1872: skærmbillede + link på Inspiration (Idas valg B, 13/9)

Ida så tre bud (canvas »Inspiration previews« og PDF): A som i dag, B skærmbillede + link, C rigtige previews via mellemled. Hun valgte B: ingen server, intet sendes ud af huset, og det virker også for Instagram og TikTok, som blokerer previews.

- **Gem inspirationen (popup og »Jeg har set noget fedt«):** ny valgfri knap »Vedhæft et skærmbillede af opslaget« med miniature og Fjern. Ved Gem uploades billedet som de andre (lille, jpeg, bucket `inspiration` under kundens kode), og STIEN gemmes på link-rækken i kolonnen `sti`, som billedrækkerne allerede bruger. Ingen ny kolonne, ingen ny policy. Uden base: besked, intet tabes.
- **Linkkortet:** med skærmbillede står billedet øverst (4:3) og åbner linket. Uden står det grå felt som én stor knap: »Tag et skærmbillede af opslaget, så står det her · Tilføj skærmbillede«; trykket vælger billedet, uploader og skriver `sti` på rækken med kvittering (update + select). Siger basen nej, fjernes billedet igen, og kunden får besked.
- Kortets knapper: Lav til idé, Åbn linket, Slet (lange på telefonen, jf. 5o). Slet fjerner nu også et links skærmbillede fra bucketen.
- **Skal ses live én gang:** at kunden må UPDATE sin egen række i `inspiration` (insert og delete er allerede i drift). Går det ikke, siger kortet »Kunne ikke gemme skærmbilledet på kortet«, og så skrives en update-regel efter husets mønster.
- Målt i selen på 390 og 1440: kort med skærmbillede (billede + link), kort uden (det grå felt som knap), popuppen med miniature, gem med `sti` på rækken. v1873: »Tilføj skærmbillede« i det grå felt er også en lang knap på telefonen.

## 5q. v1874: velkomsthilsnerne fra Content Studio (Ida 13/9)

Ida: »Jeg mener faktisk også jeg har et sted med alle mine egne velkomsthilsner … i Some-appen på skrivebordet«. Listen fandtes (Backstage → Content Studio → Velkomsthilsner, `cs_velkomst`), men var ikke koblet til noget: telefonens forside sagde Godmorgen/Goddag/Godaften, computeren de fem klokkehilsner. Hendes valg: »under Content Studio og aktivere dem ligesom quotes«.

- **Backstage:** Velkomsthilsner har nu flueben pr. linje som Citater på dashboardet (`brug`), og døren siger »N bruges«. Samme motor (`csBrug`).
- **Kunderne:** appen læser de aktive hilsner gennem `dashboard_hilsner()` (security definer, læser kun rækken ENERGIDA/Ida/cs_velkomst) i `DASH_HILSNER`, én pr. dag (`dagensNr`). `dagensVelkomst(ellers)` bruges på telefonens dagskort, Hjem-heroen (computer og telefon) og facittet. Er listen tom, eller er funktionen ikke kørt, står klokkehilsenen som før.
- **SQL-kort** øverst i »Supabase, venter på dine klik«: opretter funktionen og giver kun indloggede lov at kalde den. Kan køres igen uden skade. Det tilsvarende kort for `dashboard_citater` (12/9) ligger ikke i repoet; funktionen her er skrevet efter samme mønster.
- Målt i selen: Backstage-listen med flueben og »1 bruges«; kundens dagskort, Hjem og facit med »Godmorgen sunshine«-typen hilsen; tom liste giver klokkehilsenen.

## 5r. v1875: swipe op på dagskortet åbner arket for Idas egne koder (Ida 13/9)

- Ida på b2b som sig selv: swipe op på dagskortet åbnede plus-menuen (FANG_KNAPPER: Jeg har en god content-idé, Jeg har set noget fedt, …), altså kundernes Tøm hovedet, ikke arket »Tøm hovedet · Ny idé« med chips, som hendes Backstage-skærm åbner. Det kom med v1857, hvor kortet fik `dagensKortToemHovedet()` for alle.
- Nu: for egne koder (`erEgenKode`) er swipe `nyIdeAabn('cs', true)`, arket oven på fotoet, samme som standarden i `dagensKortVis`. Kunderne er uændrede: plus-menuen.
- Målt i selen på 390: ENERGIDA får arket (paa-foto), HINGES2026 får plus-menuen.

## 5s. v1876: alle kundens skrivefelter er arket (Ida 13/9)

Ida (13/9 kl. 14.24, med skærmbillede af helskærms-Tøm hovedet): »hvordan fanden det kan lade sig gøre at du bygger sådan en side … med det nye låste designvalg«. Forløbet: helskærmen (v1823, 11/9 kl. 10.35) blev bygget tre timer før arket blev låst (11/9, »aldrig hele skærmen«) og aldrig lagt om; v1830 og v1857 sendte swipet derind. Gennemgang af alle kundens popups på telefonen i selen fandt otte skriveformer i den gamle form (hvidt kort, overskrift i versaler, rød knap). Idas klik: alle otte i én version.

- **Nu arket, alle otte:** Tøm hovedet (plus og swipe, alle bredder), Jeg har en god content-idé, Jeg skal bare have det skrevet ned, Jeg har set noget fedt, Gem inspirationen (var dublet af Set noget fedt, kortet i DOM'en bærer kun filfelterne), Ny idé i Idébanken (`addIdea`/`openIdeaPanel`, søjlen fra filteret følger med), Lav til idé fra Inspiration (forudfyldt med noten, linket/billedet følger med i briefen), Idé til et ugetema, Link til indholdet i briefen, og Hvordan gik det? efter Ja, postet.
- **Kundens ark** (`kundeArkAabn`): chips Content-idé, Set noget fedt, Skrevet ned, Nyt opslag, Ugetema (kun hvor strategien er tændt). Søg og Find en idé er ikke skrivning og står ikke i arket; de findes i Idébanken og Indbakken. Plus-menuen (FANG_KNAPPER) er kun bevaret som kode.
- **Arket har fået to små udvidelser:** forudfyldt tekst (`tekst`) og en ekstra række under chips (`ekstraAf`). Set noget fedt bruger rækken til tre lange knapper: Tag et billede, Fra kamerarullen (begge går direkte på væggen som billede, kvittering i arket) og Vedhæft et skærmbillede (følger linket i teksten som `sti`, jf. 5p).
- **Hvordan gik det?** er arket med to chips, Hvad gik godt? og Hvad var svært?, ét felt. Gem skriver det valgte svar på opslaget, det andet røres ikke; man bliver stående og kan skifte chip. Backstage læser `brief.refleksion` uændret.
- **Ikke skriveformer, uændrede:** Story-dage, Planlægningsdag, Dagens opslag, Ny dato, Tag den nu/Senere. Hvide kort uden kryds og med lang Luk.
- Målt i selen på 390 (og 1440 for arket): alle otte åbner arket; gem af idé med søjle, Lav til idé med link i briefen, ugetema i MAALS, refleksion godt og svært på opslaget, skærmbillede valgt i arket. Ikke målt: Link til indholdet (kræver åben brief), kamera og upload (kræver telefon og base).

## 5t. v1877: Designlåsen som fil og måling (Ida 13/9: »Hvordan sikrer vi os, at der ALDRIG bliver bygget andet end det senest låste design?«)

- **`DESIGNLÅS.md` i repo-roden:** de låste regler som korte, målbare sætninger med dato (arket, popups uden kryds og med lang Luk, lange knapper, 44 px, én rød handling, Didot kun til navne, ingen emoji og I/jer, dubletreglen, navigationen). Proceduren: den, der låser, fejer hele appen samme dag; nyt låses kun ind i filen; ukendt = spørg med klik. `CLAUDE.md` peger på filen øverst, så enhver tråd læser den, før den rører noget, kunden ser.
- **`tools/designlaas/probe-popups.js`:** åbner 17 kendte popup-døre i kundeappen på 390 og måler: skriveformer skal være arket, ingen helskærm, ingen lille dialog, intet synligt kryds, lang Luk, alle knapper mindst 44 px og lange. Kørt nu: `SELE LAAS OK: 17 døre`. Fandt undervejs dagknapperne i Planlægningsdag på 43 px; rettet til 44.
- Ærligt: ingen fil kan garantere »aldrig«. Det, der virker, er tre ting sammen: én fil, alle tråde læser først; en måling, der siger fejl før deploy; og fejningen, når en lås ændres. 11/9 manglede de to sidste.

## 5u. Designlåsens port (Ida 13/9: »jeg vil gerne undgå, at jeg skal spørge om det på bagkant«)

- **Mekanisk, ikke en regel:** `.github/workflows/designlaas.yml` kører ved hvert push til `dashboard-og-database`: syntaks, versionsnummer (APP_VERSION = version.txt), Chromium, og `tools/designlaas/koer.sh`, som bygger selen uden for repoet (`byg-sele.py`, stub og sele.html ligger som tekst i scriptet, aldrig som filer) og kører `probe-popups.js` på 390. Siger målingen OK, skubbes samme commit til grenen `produktion`. Siger den fejl, sker intet, og GitHub sender besked.
- **Idas ene klik:** i Cloudflare Pages sættes produktionsgrenen til `produktion`. Fra det øjeblik når intet ud til kunderne uden målingen. Indtil da er porten en alarm: den kører og fejler synligt, men sitet deployer stadig fra `dashboard-og-database`.
- Kørt lokalt før commit: `SELE LAAS OK: 17 døre`, exit 0.
- Første kørsel på GitHub (13/9 kl. 14.38): grøn på 46 sekunder, grenen `produktion` oprettet. Ida satte Cloudflare Pages til `produktion` kl. 14.50. v1878 er testpushet gennem hele kæden: push, måling, produktion, live.

## 5v. v1879: bunden af hver side kunne ikke nås, og den røde knap blev stående (Idas fund 14/9)

To fejl fra to skærmbilleder af Performance, begge målt og rettet.

- **Bunden af HVER side lå bag bundnavet.** `.content` havde 90 px flad luft i bunden. Bundnavet er 68 px PLUS `env(safe-area-inset-bottom)`, som er cirka 34 px på en iPhone med hjemme-indikator, altså cirka 102 px. Derfor kunne Ida ikke komme ned til Tilbage. Rettet til `calc(90px + env(safe-area-inset-bottom, 0px))` for `body.has-nav .content` op til 899 px. **Hvorfor det aldrig blev fanget:** i selen er insettet 0 px, så 90 px ser rigtigt ud.
- **Den røde »Mål interaktionsraten« blev stående oven i sideoverskriften**, når en dør på Performance blev åbnet. Reglen, der skjuler `.pb-top > *` ved en åben dør, havde ikke `!important`, og `.pb-knap { display:block !important }` vandt over den. Rettet med `!important` på skjulet.

**Designlåsens måling er udvidet med bundnavet.** Den kan ikke sætte `env()` i headless, så den gør to ting: den læser kildeteksten og kræver, at en `.content`-regel regner `safe-area-inset-bottom` med i bunden, og den **simulerer** en 34 px hjemme-indikator og tjekker, at det nederste element på Hjem, Content, Idébanken og Performance ikke havner bag navet. Bevist ved at fjerne rettelsen: målingen sagde fejl med den præcise diagnose og exit 1.

**En fejl i målingen selv, rettet samme sted:** `koer.sh` brugte port 4600 blindt. Var porten optaget af en ældre server, målte porten en **gammel kopi** af appen og kunne både bestå og fejle uden grund (det skete to gange under arbejdet). Nu vælges en ledig port, og scriptet verificerer, at serveren leverer præcis den `APP_VERSION`, der lige blev bygget, før der måles. Kørt fire gange i træk med samme svar.

## 5x. v1880: ét navn i Tøm hovedet (Ida 14/9)

- Arket viste både etiketten »TØM HOVEDET« og titlen »Ny idé«: to navne på det samme, og ordet idé passer ikke, når man skriver en to-do eller en note. Idas klik: kun Tøm hovedet.
- Nu er titlen »Tøm hovedet« i Didot, etiketten er væk, og undertitlen siger fortsat, hvor det lander (»Lander i Idébanken«, »Lander i din to-do på Hjem«). Gælder både kundens ark og Idas eget.
- Gennemgået alle syv ark: kun dette havde dubletten. De andre bruger etiketten til at sige, hvor man er (»Postet · Vinterjakken«, »Ønske til appen · Hinges Hus«), og titlen til handlingen eller spørgsmålet. Reglen står nu i `DESIGNLÅS.md` under dubletreglen.

## 5y. v1881: Idas admin-chips ud af b2b (Ida 14/9)

- Ida på b2b som sig selv fik Tøm hovedet med **sine Backstage-chips**: Content Studio, Skrevet ned, To-do, Manus, Food Studio, Workout Studio, Mindful Studio, App-ønske. Hendes ord: »Disse chips er fra min admin. De må sku da ikke komme frem under b2b.«
- **Min fejl fra v1875.** Da swipet blev rettet den 13/9, gav jeg egne koder Backstage-arket på b2b i stedet for kundens. Det så rigtigt ud, fordi hendes Content Studio bor på b2b, men chipsene peger på lister, der kun findes i Backstage.
- Nu: plusset og swipet på b2b åbner **kundens ark** for alle koder, også egne: Content-idé, Set noget fedt, Skrevet ned, Nyt opslag, Ugetema. `nyIdeAabn` kaldes kun fra Backstage-skærmen (`studieFang`). Dagskortets standard-swipe er også kundens ark.
- Reglen står nu i `DESIGNLÅS.md`: b2b er kundeappen, også når Ida er logget ind.
- Målt i selen på 390 med kode ENERGIDA: både plusset og swipet giver de fem kundechips, ingen Manus eller studier.

## 5z. v1882: telefonen kunne stå fast på en gammel build (Ida 14/9, den vigtigste fejl i dag)

Ida sendte tre skærmbilleder i træk med fejl, jeg netop havde rettet, og skrev: »Er virkelig ikke tryg ved alle de fejl, jeg hele tiden finder.« Skærmbillederne var **gammel kode**, og det var ikke hendes skyld.

**Kæden, målt i koden:** service-workeren svarede ENHVER GET fra cachen først, også navigationer. Vagten i appen (`versionVagtTjek`) læste rigtigt på `version.txt` hvert femte minut og så, at serveren var nyere, men `nyVersionHent()` var `location.reload()`. En genindlæsning gik gennem workeren og fik **den gemte index.html igen**. Appen kunne derfor stå fast på en gammel build, uanset hvor mange gange hun genindlæste. Baggrundshentningen, der skulle fornye cachen, er 1,2 MB og dør på Safari. Det samme skete 5/9 (telefonen sad på 1642, serveren leverede 1690), og dengang blev symptomet lappet med `?nulstil` i stedet for årsagen.

**Rettet tre steder:**
- `nyVersionHent(ude)` sletter nu den gemte APPFIL, før den genindlæser, så workeren skal på nettet. Hjælper det ikke, tages den hårde vej én gang (afmeld workeren, slet alle caches). Et mærke i `sessionStorage` gør, at det aldrig kan loope. Loopet 25/8 kom af netop en genindlæsning uden mærke.
- Service-workeren tjekker friskheden på `version.txt` (fire tegn) og henter kun den store fil, når serveren er **strengt nyere**. Det er den ændring, der gør, at opdateringen faktisk fuldføres på en telefon.
- `version.txt` svares aldrig fra cachen længere. Før blev hvert tjek (`?vagt=<tid>`) også gemt, så cachen voksede med en række hvert femte minut.
- Cachenavnet bumpet til `energida-v5`, så hver enhed smider sit gamle indhold væk denne ene gang.

**Prøvet:** sammenligningslogikken kørt isoleret (samme version giver ingen hentning, nyere giver hentning og besked, ældre server giver ingenting, ukendt tal giver hentning). Syntaks på begge filer. **Kan ikke prøves herfra:** en service-worker kræver en rigtig enhed. Første bevis er, at Idas telefon selv skifter til 1882 uden `?nulstil`.

## 5æ. v1883: produktet bestemmer adgangen (Ida 14/9)

Ida åbnede menuen på b2b og skrev: »uhyggeligt at you got this kunder får denne menu også med forløbsoversigt mm«. Målt på alle fem produkter, og hun havde ret to gange.

**Fejl 1: en manglende fluebensliste betød »alt er tændt«.** `funkTaendt` svarede `true`, når kunden ikke havde en `funktioner`-liste. En kunde, oprettet uden at sætte flueben, fik derfor hele Content Studio-menuen uanset produkt. Modellen fandtes allerede i koden (en selvkøbt kunde fødes med `["strategi"]` og får `SELVKOEB_FULD`, når hun trykker »Gå til mit content«), men produkterne havde ingen lister.

**Nu:** `PRODUKT_FUNKTIONER` pr. produkt, og `funktionerFor(def)` med denne rækkefølge: kundens egen liste vinder altid, Idas egne koder får alt, derefter produktets liste, og kender vi ikke produktet, er alt tændt som før. **Ingen eksisterende kunde skifter adgang**, for alle med en liste beholder præcis det, de har. Listerne er appens egne produktbeskrivelser plus Idas rettelse: lektionerne bygger Drejebogen, så `strategi` hører til begge YOU GOT THIS-produkter.

**Fejl 2: Forløbsoversigt havde ingen lås på telefonen.** Computerens menu har haft gaten siden 26/8 med Idas ord: »forløbsoversigt er jo også kun til we got this og i got you kunder«. Burgeren fik den aldrig, så punktet stod hos alle. Og gaten var desuden for bred: `erForloeb` dækker også `contentplanner`, så CONTENT STUDIO-kunder fik et punkt, der åbner en tom side. Nu er der én dør, `harForloebsoversigt(def)`: produktet er I GOT YOU eller WE GOT THIS, eller kunden har en rigtig `forloeb_plan` (så en plan aldrig kan blive usynlig). Bruges af begge menuer.

**Målt i selen på 390, fem produkter, hver i sin egen indlæsning** (menuen skrives destruktivt om ved opstart, så den faste menu hentes fra filen først):

| Produkt | Menuen |
|---|---|
| YOU GOT THIS | Indbakken · Hjem · Drejebogen · Tema · Tilpas drejebog |
| YOU GOT THIS · DETAIL | + Værktøjskassen |
| I GOT YOU | alt · Forløbsoversigt · ingen Tilpas drejebog (17/8: strategien bygges sammen med Ida) |
| WE GOT THIS | alt uden Værktøjskassen · Forløbsoversigt · ingen Tilpas drejebog |
| CONTENT STUDIO | alt · Tilpas drejebog · ingen Forløbsoversigt |

Også målt: Idas egne koder får alt, en kunde med egen liste beholder sin liste, et ukendt produkt får alt. Mens et kursusforløb kører, er menuen stadig den låste (Forløbet plus fire dæmpede) som før.

## 5ø. v1884: Content Studio med ind i Tøm hovedet (Ida 14/9)

- Ida: »Den røde content studio skal også komme frem på Tøm hovedet, så man ikke skal lukke for at komme tilbage til den.« Står arket på dagskortets foto, ligger kortets egen røde knap bag arket.
- Arket kan nu bære **én** ekstra lang knap (`knap: {tekst, klik}`), sat ind lige over Luk. Dagskortets ark bruger den med kortets egen handling, så der er én dør: luk kortet, og appen står der. Både kundens ark og Idas eget.
- Kun over dagskortet. Åbnes arket fra plusset, er appen allerede bag det, og bundmenuen har Content. Målt: ingen ekstra knap dér.
- **Rækkefølgen er sat med `order` i foto-varianten**, ikke af DOM'en. Første forsøg lagde knappen over chippene. Rettet, og målt: feltet, så den røde knap, så Luk.
- **Målt i rigtig telefonhøjde (390×844)**, fordi bundfejlen fra v1879 var samme klasse: arket er 541 px mod en grænse på 726, det kan rummes uden at rulle, og Luk slutter 816 px ned på en 844 px skærm. Slide-ind-animationen fryser i selen, så målingen er taget med animationen tvunget til sin slutposition.

## 5å. v1885: Idébanken på telefonen delt op i søjlerne, og Kalender-chippen væk (Ida 14/9)

- **»De er ikke delt op i kolonnerne.«** Computeren har haft søjlerne hele tiden (`#ideBank` med filterrækken `#ibFilterRow`), men telefonen fik en flad liste 8/9, og filterrækken er skjult på telefon. Nu står idéerne under deres søjle i Drejebogens egen rækkefølge med antal, og det, der ikke hører til en søjle, står under »Andet« til sidst. Samme fliser, samme klik, kun grupperingen er ny. Kender appen ingen søjler endnu (Drejebogen ikke hentet), grupperes der på idéernes eget søjlenavn, så siden aldrig falder tilbage til den flade liste.
- **»Kan stadig se kalender mm her.«** Chippen Kalender på Idébanken-siden er bundmenuens Content. Idébanken er sit eget punkt i bundnavet i det nye design, så chippen var en anden dør til samme sted. Skjult på telefonen, står stadig på computeren, hvor der ikke er noget bundnav. Idébanken, Inspiration og Arkiv bliver: de er sidens egne undervisninger og den eneste vej til de to sidste.
- Målt i selen på 390 med seks idéer: `[1A · Produkt · 2]` Krea rum ovenpå, Vinterjakken · `[1B · Målgruppens situation · 1]` · `[2A · Menneskerne i forretningen · 1]` · `[Andet · 2]`. Chipsene er nu Idébanken · Inspiration · Arkiv.
- **Også rettet (v1887, Idas klik): Content-siden.** Chippen Idébanken dér er samme dublet af bundmenuen og er væk på telefonen. Inspiration og Arkiv bliver, Idas ord: »Arkiv skal også være der«. Content-siden har TO chiprækker: den faste markup (computeren) og en, content-facittet tegner i JavaScript (telefonen). Første rettelse ramte kun den faste, og målingen fangede det. Målt på 390: Kalender · Inspiration · Arkiv. På 1440 er alle chips uændrede, for der er ingen bundmenu at være dublet af.
- Målingen lærte mig noget om selen: seed ALTID efter appens egen hentning. Første forsøg gav en tom liste, fordi `IDEER` blev ryddet af boot bagefter.

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
