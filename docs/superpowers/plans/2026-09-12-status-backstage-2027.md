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

## 6a. v1888: Idébankens vælger ser ud som en dropdown (Ida 14/9)

- **»Man kan ikke se, at det er en dropdown.«** Rodårsagen er målt, og den var min egen: reglen `.bs-filter` satte `background:#fff !important`, og et background-SHORTHAND nulstiller `background-image`. Det slettede husets egen røde dropdown-pil (19/8) på netop det felt, så vælgeren stod som en hvid boks med ren tekst. Nu sættes kun farven (`background-color`). Samme fejl er rettet på `#briefMeta input, #briefMeta select`.
- Vælgeren har fået et lille VIS-mærke i venstre side (`.ib-vaelg` + `.ib-vaelg-mrk`), så man kan læse, hvad kontrollen gør, uden at åbne den. Det er stadig en almindelig `<select>`: systemets liste, tastatur og VoiceOver virker som før.
- Målt på 390: kontrollen 358x44, hvid, rød pil `right 11px`, VIS-mærket 14 px inde, og listen delt op i søjlerne `[1A · Produkt · 2 | 1B · Målgruppens situation · 1 | Andet · 1]`. `SELE LAAS OK`. **Idas skærmbillede 09.09 viste stadig den flade liste med »Reel · <søjle>«, som ikke findes i koden efter v1885 — hendes telefon kørte altså en gammel build.** Det er det, v1882 skal fange fremover; hun er bedt om at tjekke, at foden siger 1888.

## 6b. v1889: et tomt rum er tomt, og programmerne bygges fra øvelsesbiblioteket (Ida 14/9)

- **»Når et rum er tomt som fx dette … skal det være tomt bare med mulighed for at tilføje.«** Et nyt rum i Maskinrummet stod med TRE åbne skriveflader oven i hinanden: sendefeltet »Tilføj rum«, Tekst-kortet med sin egen Gem-knap og slags-chipsene med endnu et sendefelt. Tre spørgsmål, før man har svaret på ét. Nu står der navnet og ÉN lang rød Tilføj-knap (`mrRumTom` + `.mr-tilfoej`), og alt, der skal skrives, skrives i **arket** med chips: Note · Idé · Rum · Link · Tjekliste · Program. Har rummet indhold, står fladerne som før. Låsen er skrevet ind i `DESIGNLÅS.md` samme dag.
- **»Her fx skal jeg kunne oprette programmer, som tager øvelser fra biblioteket.«** Chippen Program åbner øvelsesbiblioteket inde i arket: søgefelt og bibliotekets rækker som lange knapper (tryk = læg i, tryk på en valgt = tag ud), doseringen fra husets egen motor (`doseringMotor` med `WO_MAAL` · `WO_NIVEAU`). Gem opretter programmet som **et rum inde i rummet** (`mr_rum` med `foraelder_id`, type »Program«, øvelserne som rummets egen tekst). Ingen ny tabel, ingen ny slags, ingen SQL — og programmet kan derfor åbnes, skrives videre i og omdøbes som alt andet med det samme. Vil hun have sæt og reps som rigtige felter pr. øvelse, kræver det ét SQL-kort; det er ikke bygget.
- **Også rettet:** `mrNoterHent` hentede rummenes indhold UDEN `slags`, `url` og `klaret`, selv om fladen grupperer efter slags — så alt stod som »Note«, links havde ingen adresse, og fluebenene kunne ikke ses. Bredt select med smalt fald tilbage, som i `mrRumHent`. Og `arkSend` kan nu vise en besked, der er skrevet til hende (gem-funktionen kaster »!« + tekst), i stedet for »Kunne ikke gemme. Prøv igen.« på alt.
- Målt i Backstage-selen på 390: tomt rum = `Tilføj`-knappen alene, 362x44 = 100 % af fladen, nul textarea, nul input, nul sendefelt. Arket: titel »Morgenflow«, intet kryds, lang Luk, ingen helskærm, chips med Note valgt. Program: 12 bibliotekrækker + søgefelt, søgning på »squat« finder squat-øvelserne, ingen knap i arket er under 44 px eller kortere end 85 % af kortet. Programteksten: `Muskelvækst · Øvet` + `1. Body weight squat — 3-4 sæt · × 8-12 · tempo 2-1-2-0 · pause 60-90 sek`. Gem uden øvelser svarer »Vælg mindst én øvelse fra biblioteket«, link uden adresse »Skriv også adressen«. `SELE LAAS OK: 17 doere og bundnavet holder designlaasen`.
- **Ikke målt:** selve skrivningen mod den ægte base. Selen har en stub-base, så kvitteringen er målt på koden, ikke på Supabase. Og `koer.sh` åbner kundeappen — arket på et rum i Maskinrummet er Backstage og måles endnu ikke af porten. Det står nu i `DESIGNLÅS.md`.

## 6bb. v1890: beskeden om en ny version står, hvor hun er (Ida 14/9)

- **»Hvis der er kommet en ny version af appen, skal den vises herinde og ikke først inde på dashboardet.«** Målt i koden: banneret `#nyVersion` lå på `z-index:500`, dagskortet på `600`. Beskeden lå altså BAG det foto, der er det første, hun ser om morgenen, og hun opdagede en ny udgave først, når kortet var lukket. Banneret er nu 700, og dagskortet får beskeden ind i sin egen bund som en lang hvid knap over swipe-linjen: »Der er kommet en ny version · Hent den«. Kun ét sted ad gangen: er kortet åbent, står den der og ikke i banneret; lukkes kortet, flytter den over i banneret; »Ikke nu« gælder nu begge steder (`NY_VERSION_AFVIST`).
- Kortets ene røde handling er stadig Content Studio: beskeden er hvid med ét rødt ord, husets sekundære knap.
- Målt i selen på 390: beskeden 342x48 = 100 % af bundblokkens bredde, y 976 over swipe-linjen (1038) og den røde knap (1112), bunden slutter 1164 af 1200. Nøjagtig én rød flade på kortet. Banneret vises ikke samtidig. Et kort, der tegnes EFTER at vagten har fyret, bærer beskeden fra starten. `SELE LAAS OK`.

## 6d. v1891: hold fingeren inde på en rød I dag-flise = Done eller Udsæt (Ida 14/9)

- **»På de røde under i dag skal jeg kunne holde fingeren inde på den og så skal jeg kunne klikke done eller udsæt.«** Done fandtes kun for dagens opslag (den lille cirkel i hjørnet, 6/9), og den blev taget ud igen samme dag. De andre røde fliser — de to startopgaver i et forløb (baseline og Indblik), planlægningsdagen, nudges — kom fra `laeg()`/`unshift` uden `dagsId` og blev **aldrig filtreret**: der var ingen vej til at sige »den er gjort« om dem. Nu har hvert punkt et stabilt id (`hjemIdagPunktId`), og filteret gælder hele listen.
- Et langt tryk (480 ms) åbner husets spørgsmåls-popup (`.spmpop` med `.sw-*`): Done øverst, Udsæt til i morgen under, lang Luk nederst. **Done** tager punktet af dagens liste (nulstilles i morgen som resten af dagsprogrammet). **Udsæt** gemmer en dato i `DAGSPROG.udsat`, så punktet kommer igen i morgen og overlever natten. Ingen af dem rører opslagets egen dato, og det står ordret i popup'en. Gemmes begge steder som dagsprogrammet i forvejen: localStorage straks, `skema_svar`-blobben bagefter. Ingen ny tabel, ingen SQL.
- **Punktets id fanges, når popup'en åbner** — ikke når der trykkes. Hjem tegnes om, hver gang et tal kommer hjem fra basen, og listen bygges forfra; lå nummeret i knappen, kunne Done ramme et andet punkt, hvis listen skiftede, mens popup'en stod åben. Det er målt.
- Et swipe i karrusellen må ikke udløse valget: bevæger fingeren sig mere end 10 px, afbrydes trykket. Klikket, der følger et langt tryk, bliver slugt, så briefen bagved ikke også åbner. Computeren har ingen finger at holde inde: højreklik åbner samme valg. iOS' lup og tekstmarkering er slået fra på flisen (`-webkit-touch-callout`).
- Målt i selen på 390: to røde fliser med `data-fokus=[0,1]`, kort tryk åbner stadig punktets egen handling, langt tryk giver popup'en med `spm="1 · Find din baseline-interaktionsrate"`, knapperne 318x48 af et kort på 358 (88 %) med Done øverst (y 628) over Udsæt (y 684) og Luk 358x44, intet synligt kryds, klikket efter det lange tryk åbner intet, Done sætter `done` og skjuler punktet, Udsæt sætter `2026-09-15` og skjuler punktet, og et swipe under trykket åbner ikke popup'en.
- **Døren er lagt i proben** (`hjemIdagValg`), som designlåsens procedure kræver: `SELE LAAS OK: 18 doere og bundnavet holder designlaasen`. Låsen »Et langt tryk er en genvej, aldrig den eneste vej« er skrevet ind i `DESIGNLÅS.md`.

## 6e. To tråde gav samme versionsnummer (14/9, målt ved push)

Tråden på Idas computer pushede sin egen **v1891** til `dashboard-og-database`, mens skytråden også havde bygget v1891. Pushet blev afvist (non fast-forward), og det var det, der skulle ske. Fletningen gav INGEN konflikt, fordi begge sider havde skrevet præcis samme tal (1890 → 1891) i `APP_VERSION`, foden og `version.txt` — identiske ændringer flettes lydløst. Resultatet var altså ét bygge med to forskellige indhold under samme nummer, og det er præcis den slags, versionsvagten ikke kan se.

Rettet ved at flette computerens arbejde ind og **omnummerere skytrådens til v1892**. Ingen force, ingen omskrevet historie.

**Læren, som gælder alle tråde:** versionsnummeret er ikke en fri variabel. Hent `dashboard-og-database`, FØR nummeret sættes, og læs `version.txt` derfra. To tråde, der arbejder samtidig, skal aldrig kunne nå frem til samme tal, for porten og telefonens versionsvagt sammenligner netop det tal.

## 6f. v1893: kunden får den nye version af sig selv (Ida 14/9)

- **»Men jeg kan jo ikke bede mine kunder nulstille på den måde! Det skal jo virke?«** Fuldstændig rigtigt, og roden sad i service-workeren. Den svarede ALTID med den gemte kopi og tjekkede friskheden bagefter: kunden fik den gamle app først, og først derefter en genindlæsning. Døde baggrundshentningen (Safari dropper store hentninger i `waitUntil`), kom den nye aldrig, og der var ingen vej ud uden `?nulstil` i adressen.
- Nu tjekkes de fire tegn i `version.txt` FØR der svares. Er serveren ikke nyere, svares den gemte kopi lige så hurtigt som før. Er den nyere, hentes den nye side og DEN svares. Tager det over seks sekunder, svares den gamle, mens hentningen kører videre og lander i cachen, så næste visning er frisk. Appfilen har nu én plads i cachen (basen uden parametre), så `?frisk=` ikke kan efterlade sin egen kopi ved siden af den gamle. `friskNaarNyere` er væk: én mekanik, ingen tvillinger. Cachenavnet er bumpet til `energida-v6`.
- Genindlæsningen går ét sted: `window.__energidaGenindlaes` henter en adresse, ingen har en kopi af (`?frisk=NNNN`), og tager hash'et med, så en Backstage-side ikke lander i kundeappen. Både workerens besked, »Hent den nu« og fejlfladen bruger den vej. Før stod der `location.reload()`, og både browserens cache og workeren svarer på den samme adresse.
- **MÅLT med en rigtig service worker** (Chromium via playwright-core, tre besøg med et deploy imellem, ingen nulstilling og ingen parametre): den gamle `sw.js` gav kunden **1000**, efter at serveren var gået til **1001**. Den nye giver **1001** på det næste åbn. Tre faldgruber målt med: ingen `version.txt`, intet svar fra serveren, og samme version. Alle tre svarer den gemte app, ingen hvid skærm. Selen kunne ikke måle dette (den registrerer ingen worker), så testen er bygget for sig i skrivebordsmappen og skal bygges igen, hvis workeren ændres.
- **Mangler stadig** (ikke bygget): beskeden om en ny version prøver ikke igen af sig selv, hvis hun trykker »Ikke nu«, og den henter kun automatisk, når skærmen har ligget stille i 45 sekunder. Med v1893 er det mindre vigtigt, fordi næste åbn nu er frisk af sig selv, men det er ikke lukket.

## 6h. v1894: min egen fejl fra v1893, tom skærm i op til seks sekunder (Ida 14/9 kl. 09.23)

- **»Forstår stadig heller ikke hvorfor jeg i admin skal kigge mere end 6 sekunder på denne skærm EFTER loading siden er færdig??«** (skærmbillede: tom flade med hjertet i baggrunden, kl. 09.23, altså to minutter efter v1893 gik i luften.)
- **Det var v1893.** For at kunden skulle få den rigtige app første gang, ventede service-workeren på den nye fil, FØR den svarede navigationen, med et loft på seks sekunder. Er der kommet en ny version, og er forbindelsen langsom, står skærmen altså tom i den tid. Målt med en langsom server: svar efter 4021 ms, noget på skærmen efter 4049 ms. Det er præcis det, hun peger på, og det er min fejl, ikke en gammel fejl.
- **Rettet:** den gemte kopi svares nu med det samme, og den nye hentes ved siden af i `waitUntil`. Når den ligger i cachen, får siden besked og henter sig selv forfra på en adresse uden kopi. Det er 4/9-reglen: kunden venter aldrig på den store fil.
- **Målt igen** (rigtig service worker, tre besøg, deploy imellem, ingen nulstilling): med en langsom server (4 sekunder) står der noget på skærmen efter **86 ms** i stedet for 4049, og den nye version står på skærmen af sig selv efter 8,2 sekunder. Med en hurtig server står den nye version der efter **167 ms**. Ingen tom skærm i nogen af tilfældene, og hun gør ingenting.
- **Prisen, sagt ærligt:** på en langsom forbindelse ser hun den gamle app et øjeblik, og så opdaterer siden sig selv. Det er bedre end en tom skærm, og det er den afvejning, hun selv traf 4. september.
- **Bemærk:** den tomme Backstage-skærm fra 12/9 (»loadingskærmen forsvinder, og jeg kigger på tom skærm i 6 sekunder«) er en ANDEN sag, og den arbejder tråden på hendes computer på (deres v1891: tæppet må ikke lette, før siden har sine møbler). Den her handler kun om service-workeren.

## 6i. v1895: heroen på admins rum-side er Backstage, og datoen står over (Ida 14/9 kl. 09.24)

- **»På min admin skal der ikke stå dine rum men Backstage og datoen mangler over?«** Siden `dside-energida` (rum-fliserne) havde heroen »Dine rum« med etiketten »Energida« under og ingen dato. Nu står datolinjen ØVERST, heroen siger **Backstage**, og etiketten under er væk: den sagde det samme som heroen og var dermed en dublet.
- Datolinjen er den SAMME som Backstage-Hjem (`dkDatoKort` + ugenummer, hendes 12/9-ønske), ikke en ny dato-form. Tvillinger skal se ens ud.
- Målt i Backstage-selen på 390: linje 1 = `man. 14. september · Uge 38` med `bs-eye bs-eye-over` i y 62, heroen `Backstage` i y 79 (altså datoen OVER), »Dine rum« findes ikke længere på siden, én etiket, fliserne urørte, heroen Didot italic 52 px. `SELE LAAS OK`.
- **Set undervejs, ikke rettet:** på hendes skærmbillede er bundmenuens **Hjem** markeret rød, mens hun står på rum-siden. Enten lyser navet det forkerte punkt, eller siden nås fra Hjem uden at navet følger med. Det er ikke undersøgt, og det står her, så det ikke går tabt.

## 6j. v1904: »Seneste 7 dage« er de sidste 7 dage (Ida 14/9 kl. 09.41)

- **»Jeg forstår heller ikke hvorfor det her er så forældet??? Denne side skal vise ringene med de sidste 7 dage: der skal man se hvordan indholdet fordeler sig på indholdssøjler, på formater, hvis man har flere målgrupper så målgrupper. Jeg aner slet ikke hvad butikken er?! Og interaktionsraten skal slet ikke stå under seneste 7 dage?«**
- **Målt i koden, og det er værre end en smagssag: TO af de tre ringe under »Seneste 7 dage« var slet ikke 7-dages tal.** Interaktionsraten kom fra `MAALINGER[0]`, altså seneste måling (typisk en måned gammel), og »Til butikken« var profilbesøg delt med eksponering fra `RAPPORTER[0]`, seneste månedsrapport. Overskriften løj om to af tre tal. Ingen af tallene forsvinder: raten står på døren »Målingerne« MED sin dato, og rapport-tallet bor i »Månedsrapporten«.
- **Nu står der det, der ER de sidste 7 dage:** antal opslag mod ugemålet (ringen, nu i fuld bredde), og hvordan de opslag fordeler sig på **indholdssøjler** og **formater**. Søjlerne i Drejebogens egen rækkefølge, det uden søjle til sidst. Rækker med navn, antal og en tynd bjælke i forhold til den største gruppe. Ingen procenter: med tre opslag på en uge siger procenter mere, end tallet kan bære. Er der ingen opslag, står der det i stedet for tomme bjælker.
- **MÅLGRUPPER KAN IKKE ENDNU, og det er et faktum, ikke en udskydelse:** et opslag har ingen målgruppe i basen. Personaerne bor i lektionssvarene (`lektion_svar_5-3`), ikke på opslaget, så der skal først et felt på opslaget, og derefter skal det sættes på hver brief. Det er Idas kald: skal briefen have et målgruppe-felt?
- Målt i selen på 390 med syv postede opslag, hvoraf ét ligger 12 dage tilbage: ringen »Opslag · 7 dage« alene i fuld bredde (358), etiketterne Indholdssøjler og Formater, fordelingen `1A · Produkt=3 (100 %) · 1B=1 (33 %) · 2A=1 (33 %) · Uden søjle=1`, formaterne `Reel=3 · Karrusel=1 · Prøvereel=1 · Story=1`. Det 12 dage gamle opslag er ikke med. »Til butikken« findes ikke længere, og raten står ikke som ring. `SELE LAAS OK` 19 døre og `SELE SIDER OK` 15 sider.

## 6g. Idas rettelser og beskeder 13/9 og 14/9, punkt for punkt

Skrevet på opfordring fra tråden på Idas computer, så den kan overtage køen. (Afsnitsnavnene 6d og 6e var taget, derfor 6g.) Rækkefølgen er kronologisk. Citaterne er korte, men hendes egne ord.

**13. september**

1. Klik: »Ja, byg de fem trin som tegnet« (planlægningsdagen) · **BYGGET v1869**
2. Klik: »Første planlægning i en ny måned« (hvornår månedens tema spørges) · **BYGGET v1869**
3. Klik: »Appen skriver dem ud fra Drejebogen« (forslagene) · **BYGGET v1869**
4. Klik: »Svarvej på ønsker til appen« · **BYGGET v1870**
5. »Jeg vil gerne se hvordan inspirationssiden ser ud med previews på link mm?« · **BESVARET** med mockups, intet bygget endnu på det tidspunkt
6. Klik: »Vis mig forskellen« · **BESVARET** med to mockups
7. »Kan ikke rigtig se det på denne måde? Kan du ikke sende det som tidligere hvor hver skærm fylder siden ala en pdf jeg kan scrolle ned på?« · **BESVARET**, mockups lavet om til fuldskærms-ark
8. »Den der lav om til ide knap bliver jeg enormt bange for at se, når vi har aftalt at alle knapper på mobilskærm skal være knapper der går hele vejen over? Vil du ikke godt være sød at lave tingene ens« · **BYGGET v1871** (`.kort-knapper` på Inspiration, Arkivet og de tre brief-links)
9. Klik: »B · Skærmbillede + link« · **BYGGET v1872 og v1873**
10. »Jeg mener faktisk også jeg har et sted med alle mine egne velkomsthilsner et sted i Some appen på skrivebordet?« (skærmbillede) · **DELVIST**: listen `cs_velkomst` blev fundet, men den står tom i basen
11. Klik: »Jeg skal have dem under content studio og aktivere dem ligesom quotes« · **DELVIST v1874**: fladen, fluebenet og RPC'en `dashboard_hilsner()` er bygget, men SQL-kortet er ikke kørt, og listen er tom, så kunderne ser stadig klokkehilsenen
12. »Fuck fuck fuck hvad foregår der?! Når jeg er på b2b siden og swiper op her kommer jeg ind på den helt gamle tøm hovedet skærm og ikke den vi har låst« (to skærmbilleder) · **BYGGET v1875**
13. »Gider du være sød at fremlægge for mig hvordan fanden det kan lade sig gøre at du bygger sådan en side?« · **BESVARET**: helskærmen var fra kl. 10, arket blev låst kl. 12, og låsningen blev ikke fejet samme dag. Det er nu skrevet ind i `DESIGNLÅS.md` som reglen »låsning er fejning«
14. Klik: »Send mig det visuelt så jeg sikrer at det 1:1 er det tidligere godkendte design« · **BESVARET**
15. »Vil du være sød at gennemgå alle skærme for om du har bygget andet gammelt?« + klik »Alle otte, i én version« · **BYGGET v1876**: alle otte skriveflader går nu gennem arket
16. »Hvordan sikrer vi os at der ALDRIG bliver bygget andet end det senest låste design??« · **BYGGET v1877**: `DESIGNLÅS.md` plus målingen i `tools/designlaas/`
17. »Ok så alt der bliver deployet fra nu gennemgår den seneste?« · **BESVARET**: nej, ikke af sig selv, og derfor punkt 18
18. »Men jeg vil gerne undgå at jeg skal spørge om det på bagkant« · **BYGGET v1878**: GitHub-actionen måler hvert push og skubber kun grønne commits til grenen `produktion`, som Cloudflare deployer
19. Skærmbilleder fra Cloudflare + »done kør test« · **BEKRÆFTET**: porten er aktiv og målt
20. »Udover videoerne! Hvad synes du så jeg mangler for at kunne gå ægte i luften med contentstudio?« · **BESVARET** med listen
21. »Synes slet ikke mit admin dashboard fungerer på desktop?? Det er jo den samme som mobilversionen??« · **IKKE RØRT**. Den er ikke undersøgt, og den står stadig åben
22. Skærmbillede fra Supabase: `hilsner_i_listen 0 / aktive 0` · **DELVIST**, samme som punkt 11
23. »Har du mulighed for nr. 1 med chrome integrationen?« (den ægte gennemgang) · **UDSKUDT**: kræver at netværkspolitikken åbnes for b2b.energida.dk, admin.energida.dk, Supabase-værten, funktions-værten, cdn.jsdelivr.net, fonts.googleapis.com og fonts.gstatic.com, og at hun selv skriver et login
24. Klik: »Åbn netværket for tråden« og »Kan du ikke gøre det via integrationen uden mig?« · **UDSKUDT**, samme som 23. Jeg kan ikke åbne politikken selv
25. »Skal jeg oprette en ny tråd hvor du laver overlevering fra denne så du kan arbejde?« og »Skal jeg sende nogen promte med?« · **BYGGET**: overleveringen ligger i `docs/superpowers/plans/2026-09-13-overlevering-live-gennemgang.md`
26. Skærmbillede: den nye tråd kunne ikke finde planfilen · **BESVARET**: den skulle hente grenen først

**14. september**

27. »Det spiller stadig ikke med brugervenlighed og afstande. Tilbageknappen her kan jeg ikke komme ned til, og når jeg klikker ind på en knap ligger der en rød knap oven i mål interaktionsraten?!« (to skærmbilleder) · **BYGGET v1879**: bundpolstringen regner nu telefonens hjemme-indikator med, og den fastlåste røde knap er væk
28. »Der står stadig både tøm hovedet og ny ide her også?!« + klik »Kun Tøm hovedet« · **BYGGET v1880**
29. »Disse chips er fra min admin?! De må sku da ikke komme frem under b2b?! Hvad er det for noget rod!!!?« · **BYGGET v1881**: b2b er kundeappen, også når Ida er logget ind. Låsen er skrevet ind
30. »Altså helt seriøst. Er virkelig ikke tryg ved alle de fejl jeg hele tiden finder« · **BYGGET v1882 og v1893**: telefonen kunne stå fast på en gammel build. v1882 rettede vagten, v1893 rettede roden i service-workeren
31. »Og uhyggeligt at you got this kunder får denne menu også med forløbsoversigt mm?!!« + klik »Ja, produktet bestemmer« · **BYGGET v1883**: `PRODUKT_FUNKTIONER` og `harForloebsoversigt`
32. »You got this har jo også drejebogen med??? Hvordan kan du spørge mig om dette? Har du ikke styr på produkterne?« · **NOTERET SOM ARBEJDSREGEL**: produktmodellen skal læses i koden, ikke spørges om. Står i statusnotatet
33. »Den røde content studio skal også komme frem på tøm hovedet oversigten, så man ikke skal lukke for at komme tilbage til den« · **BYGGET v1884**
34. »Idebanken spiller heller ikke. Kan stadig se kalender mm her?! Og de er ikke delt op i kolonnerne??« · **BYGGET v1885**
35. Klik: »Arkiv skal også være der« (Content-sidens chiprække) · **BYGGET v1887**
36. »De skal jo være delt op på indholdssøjlerne, og man kan ikke se at det er en dropdown?« · **BYGGET v1888**. Søjlerne var bygget i v1885, men hendes telefon kørte en gammel build, og pilen var slettet af et background-shorthand
37. »Når et rum er tomt som fx dette i admin, skal det være tomt bare med mulighed for at tilføje. Her fx skal jeg kunne oprette programmer som tager øvelser fra biblioteket« · **DELVIST v1889**: det tomme rum og programbyggeren er bygget, programmet gemmes som et rum inde i rummet med øvelserne som tekst. Sæt og reps som rigtige felter pr. øvelse kræver ét SQL-kort og er IKKE bygget
38. »Hvis der er kommet en ny version af appen, skal den vises herinde og ikke først inde på dashboardet« · **BYGGET v1890**: banneret lå på z-index 500, dagskortet på 600
39. »På de røde under idag skal jeg kunne holde fingeren inde på den og så skal jeg kunne klikke done eller udsæt« · **BYGGET v1891, omnummereret til v1892** efter sammenstød med computertrådens eget v1891
40. »Men jeg kan jo ikke bede mine kunder nulstille på den måde! Det skal jo virke?« · **BYGGET v1893**, målt med en rigtig service worker
41. »Forstår stadig heller ikke hvorfor jeg i admin skal kigge mere end 6 sekunder på denne skærm EFTER loading siden er færdig??« (kl. 09.23) · **BYGGET v1894**: det var v1893, der ventede på den nye fil før den svarede. Nu svares den gemte kopi straks. Se afsnit 6h
42. »På min admin skal der ikke stå dine rum men Backstage og datoen mangler over?« (kl. 09.24) · **BYGGET v1895**. Se afsnit 6i. Bundmenuens Hjem lyser på den side, og det er IKKE undersøgt

**Det, ingen af hendes beskeder har lukket endnu:** admin-dashboardet på computeren (21), den ægte gennemgang med et login (23 og 24), hilsnerne i basen (11 og 22), modul 5 og 6 siger stadig »I« og »jer«, der findes ingen notifikationer, målingen dækker popups og bundnavet i kundeappen (ikke hele sider og ikke Backstage), og `CLAUDE.md` erklærer stadig deploylåsen fra 7. august aktiv.

**Køen er tom, tråden er stoppet.**

## 6c. Slutstatus for skytråden (14/9, aften)

Ida fortsætter i tråden på sin egen computer. Denne tråd stopper her.

- **Sidst pushet:** v1893 til `claude/second-thread-not-responding-2yngb0` og `dashboard-og-database`. v1888 og v1889 nåede `produktion` gennem porten efter 60 sekunder hver; v1890 gjorde det samme; v1891 forventes samme vej.
- **Idas klik og beskeder i dag, der IKKE er lukket:** (1) den ægte gennemgang med en rigtig kode kræver stadig, at netværkspolitikken åbnes for b2b.energida.dk, admin.energida.dk, Supabase-værten og funktions-værten, `cdn.jsdelivr.net`, `fonts.googleapis.com`, `fonts.gstatic.com`, og at hun selv skriver et login. (2) SQL-kortet til `dashboard_hilsner()` er ikke kørt, og `cs_velkomst` står tom i basen, så hendes egne velkomsthilsner er ikke fundet endnu. (3) Modul 5 og 6 siger stadig »I« og »jer« i basen. (4) Der findes ingen notifikationer (planlægningsdag, »Er det postet?«, svar på app-ønsker). (5) Designlåsens måling dækker popups og bundnavet i kundeappen, ikke hele sider og ikke Backstage. (6) `CLAUDE.md` erklærer stadig deploylåsen fra 7. august aktiv, selv om der deployes dagligt; kun hun kan beslutte, at teksten skal skrives om.
- **Det, der var i gang, da tråden stoppede:** intet halvt. Alt målt arbejde er committet og pushet.

## 5ad. v1891: tæppet lettede aldrig for en ny kunde (fundet 13/9 kl. 22.30 på Idas computer, uden login; lagt oven på v1890 14/9 kl. 10.15)

Overleveringens live gennemgang kunne ikke køres med login (Ida: »test alt du kan uden mig«). I stedet blev det målt, som selen aldrig havde målt: **boot-tæppet.** Proben fjernede `appLoader` med hånden, så ingen måling så, om det lettede af sig selv.

- **Fundet:** i selen med tom base (som en helt ny kunde) blev hjertet stående i 30 sekunder for ALLE fire koder (HINGES2026, ENERGIDA, RINGKOBING2026, THOMAS2026), og så kom »Appen kunne ikke starte« oven på en side, der VAR tegnet. Årsag: `harNoget()` (4/9) leder efter møbler med bestemte klasser, og rejsen på Hjem (`#onboardKort`, `.ob-proces`) og klipperens Hjem (`#klipHero`) har ingen af dem. `__SIDE_KLAR` var sat, `has-nav` var sat, aktiv skærm havde 480 tegn tekst. Ramte kun kunder, hvis Hjem er rejsen (ny kunde: intet postet, rejsen ikke i mål) og klipperen. Ida og kunder med postede opslag havde deres normale Hjem med møbler og så det aldrig. Git siger: rejsens fliser kom i v1388, møbel-tjekket i v1656 (4/9), så en ny kunde har mødt fejlfladen siden 4/9.
- **Rettet:** `MOEBLER` kender nu `.ob-proces, .ob-kort, #klipHero, #klipKpi2`. Målt efter: tæppet lettede for alle fire koder på 390 og 1440 (`vis=none`, `app-klar` sat ved t=0).
- **Proben måler det fremover:** `probe-popups.js` venter op til 6 sek. på `body.app-klar`, før dørene måles, og siger `SELE LAAS FEJL taeppet`, hvis det ikke lettede. Kørt på v1878-koden: FEJL (fanget). Kørt på v1891: se nedenfor.
- **Målt uden login mod den rigtige base:** `dashboard_hilsner()` FINDES (svarer 200 og `[]`), så listen `cs_velkomst` er tom i basen eller findes ikke. Men både `dashboard_hilsner()` og `dashboard_citater()` svarer også en, der IKKE er logget ind: `revoke … from public` fjerner ikke anon-rollens egen tilladelse. Det er Idas egne sætninger, ikke kundedata, men kortet lovede »kun indloggede«. Nyt SQL-kort øverst i Maskinrummet (`sqlk_hilsner_anon_1322`): lukker anon for begge funktioner og viser i ét opslag, hvor hilsnerne ligger i basen (kode, navn, skema, antal linjer, og at begge funktioner findes). Idas notesbog med hilsner fra juli ligger kun i `ARKIV/_TIL SLETNING` og er delt på køn, så den kan ikke bruges.
- **Set:** rejsen på 390 (dagskortet med »Godaften, Test«, klokkehilsenen som ventet med tom liste) og 1440 (rejsen som tre kort, rundvisningen 1 af 6). Ikke set: den rigtige base, Inspiration-update, admin-update af skema_svar, Backstages læsning på tværs (de fire ting i overleveringen kræver login).
- **Adressen:** overleveringen skriver `backstage.energida.dk`, men den peger på hjemmesidens server (certifikatet er kun for energida.dk). Backstage er `admin.energida.dk` (v1890 live).
- Designlåsens måling lokalt (Chrome på Mac, `timeout` erstattet af en perl-etlinjer, fordi coreutils mangler): `SELE LAAS OK: 17 doere`.

## 5ae. v1896: målingen dækker hele sider (Idas klik 14/9 kl. 10.30, bygget på computeren)

- **`tools/designlaas/probe-sider.js`** åbner 15 sider i kundeappen på 390 gennem de RIGTIGE døre (burgermenu og bundnav; Performance tegnes fx kun rigtigt gennem `openMaal()`, ikke `showTab(9)`): Hjem, Idébanken, Inspiration, Arkiv, Content, Performance, Indbakken, Værktøjskassen, Drejebogen, Tema, Målsætninger, Tilpas, Forløbsoversigt, Min profil, lektionssiden. Pr. side måles: tæppet letter af sig selv · ingen vandret sejlads · hvert trykfelt mindst 44 px (selv eller via ::before, målt med `elementFromPoint` 21 px over og under) · intet synligt kryds · ingen emoji · ingen skillelinje inde i en flise (hr, kant kun i top/bund, eller et 1-2 px element med baggrundsfarve). `koer.sh` kører den efter popup-målingen; porten på GitHub kræver begge OK.
- **Kørt på v1893 (før rettelserne): 13 fejl.** Rejsens fliser havde »den sarte skillelinje« fra 27/8 (`.obp-skille`), Forløbet, Værktøjskassen og lektionssiden havde streg under fliseoverskriften (`.kort-titel`, regel 36 fra 5/9), Idébankens »Byg en idé« var 42 px, sendefeltets cirkel og Arkivets søjlechips havde intet 44 px trykfelt, og Målsætninger (Mere) havde 22 px flueben uden trykfelt og »Ret«/»Skriv temaet« som små røde ord. Alt sammen mod låse, Ida har givet (12/9: ingen skillelinjer i fliserne, LOVET; 13/9: lange knapper på telefonen; 2/8: 44 px).
- **Rettet i v1896:** `.kort-titel` og `kh()` uden streg (alle flader), `.obp-skille` gennemsigtig, »Byg en idé« 48 px, ::before-trykfelter på sendefeltets cirkel og søjlechips (tegningen uændret, 4/9-reglen), Målsætninger på telefonen: flueben med trykfelt, Ret/Skriv temaet som lange hvide knapper, ingen streger i rækkerne, dagcirklerne runde 44 px. Computeren er urørt bortset fra stregerne.
- **Fundet undervejs, også rettet:** popuppen »Drejebogen er tom« (`drejebogTomVis`) var en dør, proben ikke kendte, og den blev stående over næste side i målingen. Nu i `DOERE` (19 døre), og dens to knapper er lange på telefonen.
- **Ikke rettet, til Idas klik:** Mere › Målsætninger er en tvilling af målsætningerne på Performance (v1854, »målsætninger som fliser med arket«). Dubletreglen siger én dør. Siden er nu lovlig, men gammel i formen.
- Målt: `SELE LAAS OK: 19 doere og bundnavet`, `SELE SIDER OK: 15 sider`. Set på 390: Målsætninger, Idébanken, Arkiv, Drejebogen er tom. Ikke set: 1440 efter kort-titel-ændringen (kun stregen er væk, resten er telefon-CSS).
- **Git på Idas computer:** `.git/index` forsvandt med en død `index.lock` fra 10.37 (to tråde og en fetch-løkke i samme repo). Genopbygget med `git reset` uden at røre filerne; ingenting tabt.

## 5af. v1907: Backstage Hjem på computeren = bud G, og dørene er sidemenuen (Idas klik 14/9 kl. 12.15)

Punkt 21 på Idas liste (»mit admin dashboard fungerer ikke på desktop, det er jo den samme som mobilversionen«). Syv bud som Artifact (1c687068) med seks af Idas kommentarer bygget ind undervejs: ingen citat, kun hilsen · dørene som foldemenu (hendes idé, bud F) · kommende aftaler med · to-do under Venter på dig · genveje og pinnede kunder i stedet for »kunder der trænger« · rammer om det, der hører sammen · 8 px mellem rækker · energien til Time to Shine · dit eget content = samme rækker som hendes b2b-login.

- **Foldemenuen** (`#dsbDoere`, `dsbDoereTegn`, `bsMenuUnder`): de ni døre, hver med det, der ligger bag: `BS_DOER_DEF` filtreret på `bsPlads`, rum flyttet dertil (`doer_placering`), Kunders kategorier (`BS_KUNDE_KATEGORIER`) + Ny kunde, Mine rum = egne rum på Dine rum, studiernes faste kort (`BS_MENU_KORT`, navnene er kortenes egne `.ws-head`, ruller kortet frem), Teknik = SQL-kort · Byggekøen · Eksempler · Det gamle Maskinrum. De gamle punkter (Kunder · Energida · Søg · Energida Studio · Get shit done) skjules kun ≥ 1000 px; telefonens bundmenu læser dem stadig i DOM-orden (bundmenuen i admin var en fejl at starte på, Ida 14/9, den røres ikke). Søg bor bag Cmd+K på computeren. `BS_MENU_LAAS`: `mrGaaTil` går via `mrLuk` → Dine rum, før området åbner, så markeringen låses under et klik (målt: Salg endte ellers som »Mine rum«).
- **Hjem på computeren** (`bsHjemComputerTegn`, `.bs-hjem-c`): I dag (venterKortHtml som i Indbakken, højst fire; to-do som før med sendefeltet; kommende aftaler fra `CRM_AFTALER` med samme filter som Næste aktiviteter, datoboksen 48 px, kundens navn og tid under, tryk åbner kundens side) · Dine (genveje: Ny kunde · Ny video · Byggekøen · SQL-kort · Mit eget studio (b2b.energida.dk i ny fane); pinnede kunder fra `KUNDE_PINS` som døre) · Dig (dit eget content: `venterHent` gemmer nu de egne koders opslag i `__EGNE_OPSLAG` og IDAENERGIDAs `plan_dato` i `__EGEN_PLAN_DATO`; dagens eller næste opslag som rød flise, planlægningsdagen under). **Denne uge og Forretningen er IKKE bygget endnu**: de tegnes kun, når `__BS_UGE_HTML`/`__BS_FORRETNING_HTML` findes, og de findes ikke. Næste version.
- **Ikke bygget, med vilje:** sendefeltet »Ny aftale« på Hjem (en aftale hører til en kunde; den oprettes på kundekortet). Kunders kategori-klik i menuen sætter `BS_KUNDE_KAT` efter `visDashSide('crm')`, fordi den nulstiller.
- **Velkomsthilsnerne (Idas SQL-svar 14/9: ingen rækker i basen, funktionerne findes):** `csHent` skriver nu en lokal liste ind i basen, hvis basen ingen række har. Åbner hun Content Studio › Velkomsthilsner på den enhed, hvor listen står, lander den i basen af sig selv.
- Målt i selen: 1440 med og uden data (venter, to-do, aftaler, pins, eget opslag), foldemenuen åben på Salg med syv punkter, `SELE LAAS OK: 19 doere`, `SELE SIDER OK: 15 sider`. Ikke målt: den rigtige base (IDAENERGIDA-læsning under RLS med admin-session; `venterHent` læser allerede alle koder, så det bør holde), Kunder-siden på 1440 efter menuskiftet, telefonen (koden er gated på ≥ 1000 px).
- Overleveringen fra skytråden er kopieret ind på denne gren (`2026-09-14-overlevering-til-computertraaden.md`).

**v1908: Denne uge og Forretningen bygget færdig.** Denne uge = tre af husets ringe på kundernes opslag (`__ALLE_OPSLAG`): postet mod planlagt i ugen (mandag til søndag, `energidaUgeMandag`) · briefs godkendt mod dem, der venter på dig (status Godkendt mod Klar til godkendelse) · kunder med opslag i ugen mod alle aktive. Forretningen = Energida Studio (hvor bolden ligger, `KLIP_OPGAVER` med tavlens egne statusser: hos dig = manus mangler eller klippet til godkendelse · hos klipperen = råfiler eller rettelser · venter på optagelse = manus godkendt; tryk åbner studiet) og Salget (samme motor som CRM'ets »Følg op på«: kun kontakter med en opfølgningsdato, Idas regel 21/7, forfaldne først, højst tre, tryk åbner kontakten). Målt i selen 1440 med data: fem grupper, tre ringe, tre studio-rækker, to salgsrækker. `SELE LAAS OK`, `SELE SIDER OK`.

## 5ag. v1909: de tre sidste »Skriv løs« går gennem arket (Idas klik 14/9 kl. 13.05)

Overleveringen sagde »Skriv løs« stod tre steder: Content Studios idéfelt, Mindful Studios idéfelt (det var Idé til manus i Energida Studio) og dagens fang i Backstages Tøm hovedet. Det var tre gamle hvide popups med tekstfelt og Gem, bygget før arket blev låst 11/9. Ordet er ikke byttet; formen er: alle tre åbner nu arket (`arkAabn`) med titlen som navn og undertitlen som »hvor lander det«: Idé til Content Studio · Idé til manus · Skrevet ned/Hvad er idéen?/Hvad har du set? App-ønskets studio er arkets chips. Et link i teksten bliver til `link` som før. Gem-funktionerne (`csIdeGem`, `manusIdeGem`) tager nu teksten som argument og svarer sandt/falsk, så arket kan kvittere. Dødkode klippet: trin 2's gamle html og `dashFangSkrevet`. Målt i selen på 390 (Backstage): alle seks veje åbner arket med den rigtige titel, app-ønsket med syv chips; »Set noget fedt« går stadig gennem valget først. Ikke målt: den rigtige base.

## 5ah. Den ægte gennemgang mod basen (14/9 kl. 13.30, Idas admin-session i browserpanelet) og v1910

Alt gemt undervejs hed »TEST 14/9« og er slettet igen (talt: 0 tilbage).

**Målt OK:** Backstage Hjem på 1440 med rigtige data (9 i Venter på dig, 14 aftaler, ringene, 46 manus mangler, 3 venter på optagelse, 90 kontakter; IDAENERGIDA læses: 480 idéer, 2 postet). Backstage læser skema_svar på tværs af 18 koder og må opdatere en anden kodes række (tom opdatering, 1 række). Arket hos testkunden IDATEST3RU7: alle fire chips lander i basen (content_ideer, inspiration med link, toem_hovedet, maalsaetninger). Planlægningsdagen: plan_dato gemmes, kortet står på Hjem, alle trin til »Godt gået«, plan_ritual, maanedens_tema og plan_maaned gemmes. v1909: Backstages Tøm hovedet skriver til rodebutikken. Inspiration hos en rigtig kunde: linkkortet med gråt felt og tre lange knapper.

**Fundet:** (1) Ingen `cs_*`-rækker i basen overhovedet (velkomst, quotes, dashboard-citater, ideer): listerne lå kun i browseren. Skrivning virker (testrække skrevet og slettet), så v1907's automatik gemmer dem, når listen åbnes på den enhed. (2) `plan_maaned_<mdr>` blev gemt med tomt navn (`skemaSvarSkriv` bruger CURRENT_NAVN, tomt for fælles login) og to gange ved to tryk. **v1910:** navn »config«, opdatér ellers opret, lås mod dobbelttryk. (3) Kundens dagskort sagde »Goddag,« uden navn. **v1910:** kommaet følger navnet. (4) Planlægningsdag-kortet havde en streg inde i den røde flise og en kort knap på telefonen. **v1910:** stregen væk, `.planrit-start` lang på telefonen. (5) Ikke målt: kundens egen UPDATE på inspiration (kræver kundens session). **v1910:** SQL-kort »Må kunden opdatere sin egen inspiration?« (`sqlk_insp_policy_1409`) viser policies på inspiration, skema_svar og kunde_maal; ændrer intet.

## 5ai. v1911: Kunder, Salg og Content Studio på 1440 efter menuskiftet (Idas klik 14/9 kl. 13.40)

Set i den ægte admin-session på 1440 (browserpanelet), ikke i selen.

**Kunder:** Kundeopgaverne stod som ni røde kort i fuld bredde (1092 px) under hinanden, en stak aflange kasser. Nu fliser i tre spalter på computeren (`body.dash-nav .bs-opgaver` gitter, 16 px luft), 353 px hver; telefonen urørt. »Klienter« stod to gange: kategori-døren fra `BS_KUNDE_KATEGORIER` og rummet »Klienter«, som er flyttet til Kunder og som `mrRumAaben` alligevel sender til samme klientliste.

**Salg:** »Økonomi« og »Forretningsoverblikket« stod to gange (registrets dør + Idas rum med samme navn, som kun er en vej til samme side). Samme dubletter i foldemenuen.

**Rettelsen:** `bsRumErVejDublet(r, side)`: et rum, der kun er en vej (`MR_RUM_VEJE`, Klienter, Økonomi, Byggekøen), vises ikke som dør på en side, hvor registret allerede har en dør med samme navn. Gælder `bsFremmedeDoere` (siderne) og `bsMenuUnder` (foldemenuen). Foldemenuen under Kunder viser nu samme kategorier som siden (kun dem med kunder; Klienter altid). Kunder: 3 kategori-døre + Ny kunde + Pipeline. Salg-menuen: 16 punkter, ingen dubletter af veje.

**Ikke rettet (Idas valg):** »Gameplan« står stadig to gange på Salg: registrets dør går til Motorer og biblioteker, Idas rum »Gameplan« er et tomt rum. »Priser« (prislisten) og »Priser og tilbud« (tomt rum) ligner også to navne for én ting. Rummene har eget indhold (eller kan få det), så de er ikke slettet.

**Content Studio på 1440:** OK. Ingen streger i fliser, ingen små trykfelter, døre kun navne.

**Målt:** `koer.sh` 19 døre + 15 sider OK. Verificeret live ved at lægge de nye funktioner ind i Idas session før deploy (Kunder-siden og menuen tegnet igen).

## 5aj. v1912: Idas fire fund kl. 13.55 til 14.05 og resten af 1440-gennemgangen

Idas ord: »hvorfor ser min admin pludselig sådan her ud med menuen på desktop?« · »overskrifterne her er lidt uklare?« · »når jeg klikker på de 3 prikker her i energida studio skal de altså ikke komme op sådan her til separate knapper???« · »min print manus for hvert enkelt modul er også forsvundet?« · »jeg er godt nok ægte i chock … at du ikke har lavet en grundig gennemgang og fjernet dubletter«.

1. **Menuen som smal skinne:** menuen var skubbet ind (pin-knappen »Skjul menuen« nederst, valget huskes pr. bruger). De gamle punkter havde ikoner i skinnen, foldemenuens døre havde ingen, så navnene stod klippet (»Kunde«, »Mine r«). Nu bærer hver dør samme ikon som telefonens Hjem-døre (`bsMenuIkon`), skinnen viser kun ikonet, den udfoldede menu kun navnet.
2. **Uklare overskrifter (1.1 · Velkommen):** målt i selen: ingen transform, filter eller opacitet på flisen eller dens forældre; Poppins 14,5 px, sort. Det, der kan gøre den blød, er Chromes zoom (ikke 100 %) eller skærmbilledets nedskalering fra Retina. Ikke rettet i koden, for der er ingen kode at rette.
3. **⋯-menuen i Energida Studio** tegnede ti fliser i fuld bredde oven over siden (bud 6, 11/9). Nu husets ark (`#bsFlytMenu`/`.bs-flyt-ark`, samme som langt tryk): lange hvide knapper i ét kort på 420 px, Luk nederst. Målt: 12 knapper à 48 px.
4. **Print pr. modul** sad i den gamle modulvisning (»Print dette modul«, 2/8), som bud 6 afløste. Tilbage i ⋯-arket øverst; printer det valgte chip-modul (`printModul(KLIP_MODUL_CHIP)`). Målt: Modul 1 = 5 videoer.
5. **Mine rum i foldemenuen** viste alle 20 rum hos Ida (og 3 i selen): `bsFlytHent` meldte »hentet« til kalder nr. 2, før placeringerne var i hus, og menuen brugte et andet filter end siden. Nu: samme liste som siden (nålede først, så `bsRumTop()` uden veje), alle venter på samme hentning (`BS_FLYT_LOFTE`), og menuen tegnes én gang til, når placeringer, rum og nåle er hentet.
6. **Studierne på computeren:** rum flyttet til Food/Workout/Mindful Studio stod kun på telefonen. Nu døre under heroen + »Tilføj rum« (`bsStudioRumTegn`). Rummene »Food Studio« på Food Studio og »Workout Studio« på Workout Studio var døre til sig selv (veje): væk.
7. **Luft under heroen i områderne:** `.mr-omr .ch-titel {margin 4px !important}` vandt over `.bs-hero-ren` (32 px) på Salg, Content Studio og studierne. Nu 32 px.

**Stadig Idas valg (rum med samme navn som noget andet, ikke rørt):** Gameplan × 2 på Salg (dør til Skabeloner + tomt rum), »Priser« (prisliste) og »Priser og tilbud« (tomt rum) på Salg, rummet »Mindful Studio« på Mindful Studio. Rum på Salg/Content Studio står også under Mine rum (Ida 11/9: »Hvor er alle mine knapper!!?«).

**Målt:** `koer.sh` 19 døre + 15 sider OK før deploy; arket og Kunder/Salg/Mindful målt i Idas admin-session ved at lægge funktionerne ind før deploy.

## 5ak. v1913: Mine rum viser kun rum, der ikke er lagt et andet sted (Ida 14/9 kl. 14.30: »dette er IKKE de korrekte låste rum«)

Idas ord: »mine rum er jo netop KUNDER : SALG osv … for 2 dage siden placerede vi alt indholdet i mine rum ud på de nye rigtige knapper … kan du ikke finde det låste tidligere???«

**Det låste, fundet i noten:** 9/9 kl. 09.05 »Dine rum = kun egne rum … hvert rum får en placering« + 11/9 kl. 08.30-11.30: Idas 27 svar i `doer_placering` (Salg bærer forretningen + Markedsføring med Hjemmesiden/Anmeldelser og omtale/Nyhedsbrev; Content Studio bærer Content-planner/Contentmodellen/Drejebogen/Opgavebiblioteket; Vidensbank på Hjem; Quotekalenderen under Produkter; Reset din energi under Salg). **Det, der væltede det:** 11/9 kl. 14.12 »Hvor er alle mine knapper!!?« blev læst som »vis alle egne rum på Dine rum igen«, så Gameplan, Markedsføring, Drejebogen osv. stod både på Salg/Content Studio og på Mine rum. Læsningen er vendt: rummene manglede på Salg og Content Studio (på computeren indtil v1912), ikke på Mine rum.

**Rettelsen:** `bsMineRumListe()` er den ene liste for siden og foldemenuen: nålede + `bsRumTop()`, kun rum med placering »energida« (ikke flyttet), uden veje. Rummet »Mindful Studio« (produkt Time to Shine) er nu en vej til Mindful Studio som Workout/Food Studio (`MR_RUM_VEJE`), ikke et tomt rum.

**Målt i Idas admin-session før deploy:** se listen i næste afsnit af samtalen (rum med placering energida vs. det, siden viser). `koer.sh` 19 døre + 15 sider OK.

**Lærestreg (skrevet i hukommelsen):** når Ida siger »hvor er mine knapper«, er svaret at finde det sted, hun HAR lagt dem, ikke at vise dem alle steder. Én ting, ét sted.

## 5al. Idas klik 14/9 kl. 14.50: de to tomme rum på Salg er arkiveret (ingen kodeændring)

»Arkivér de to tomme rum (anbefalet)«. Gjort i Idas egen admin-session mod basen: `mr_rum` Gameplan (dfb191ed…) og Priser og tilbud (569e4048…) har `aktiv = false` (kvitteret med `.select()`, 1 række hver; intet slettet). Salg viser nu 14 døre uden dubletter: Pipeline · Forretningsoverblikket · Produkter · Økonomi · Gameplan · Priser · Tilbud og salgstekster · Markedsføring · Oplæg · Bookinger · I GOT YOU · Leads og kampagner · Målsætninger · Medarbejderdelen. Foldemenuen viser de samme 14.

## 5am. v1914: Workout, Food og Teknik på 1440 (Idas klik 14/9 kl. 14.55) + manus rettes på stedet

**Målt i Idas admin-session på 1440:**
1. **Teknik var tom.** `bsTeknikAabn` → `visDashSide('maskinrum')` → `mrLuk()` → Dine rum; `#mrForside` stod med `display:none` fra et tidligere `mrAabn`, og `mrLuk` sprang forbi linjen, der viste den igen. Nu: `mrOmraaderLuk()` (lukker områderne, viser forsiden, navigerer ikke) bruges af `visDashSide('maskinrum')` og `bsTeknikAabn`; Teknik viser sine døre og har stien Hjem › Teknik.
2. **Stien sagde »Hjem / Energida« på Salg, Content Studio og studierne**: `mrLuk` gik til Dine rum (visDashSide('energida')), hvis sti blev tegnet efter områdets. Nu følger stien placeringen: Hjem › [siden, rummet er lagt på] › [rummet]; Tilbage = leddet før det sidste. `mrLuk` (vejen ud af et rum) går til den side, rummet er lagt på, ellers Hjem; Dine rum er ikke længere vejen ud (den er tom). `BS_SIDER.energida` hedder »Mine rum« som menuen (var »Dine rum«). `bsSideGaa(side)` er den ene vej til en side.
3. **Streg under hvert korts overskrift** (Food, Workout, Mindful Studio: `.ws-head` border-bottom): væk i Backstage (`body.dash-mode .ws-card > .ws-head`). Kundeappen urørt.
4. **Workout og Food:** menu = kortene (Øvelsesbiblioteket · Doserings-motoren · Workout-kunder · Idéer / Opskrifter · Kogebøger · Idéer · Kalorieberegner), 32 px under heroen, ingen emoji, ingen sejlads. Chips 36 px og »+« 34×25 er computerens mål (44 er telefonens).
5. **Ikke rettet (kræver Idas klik):** Øvelsesbiblioteket på computeren er 100+ rækker med streger i én kasse (5/9: »altid fliser, aldrig en liste i én kasse«); på telefonen bliver de til fliser (`bsFliserAfRaekker`). Et gitter af fliser på computeren er en synlig ombygning.
6. **Tøm hovedet-skærmen (`#studieVaelger`) på 1440** i browserpanelet var panelets egen (den blev tegnet, mens panelet stod under 760 px, og blev stående ved skift til 1440). `studieVaelgerVis` har 760-spærren; på computeren kommer den ikke.

**Manus rettes på stedet (Ida 14/9 kl. 15.10):** »når jeg vil ændre noget i teksten i manus … skal siden IKKE åbne i en ny helside — den funktion skal du bare slette«. `kbFokus` åbner ikke længere fuld skærm (`kbFuldAaben`); felterne rettes direkte i briefen. Vælter 2/9 (»manus åbner som hel skærm hvis man klikker på den«). Fuldskærmens CSS og Escape-håndtering står, men nås ikke.

**Målt:** `koer.sh` 19 døre + 15 sider OK. Teknik, stien og Tilbage måles live efter deploy (næste afsnit).

## 5an. v1915: status på videoerne kan skiftes igen (Ida 14/9 kl. 15.25: »jeg kan ikke ændre status på lektionerne nogle steder nu??«)

Statuschippen sad i den gamle modulvisning (`klipKort`), som bud 6 afløste 12/9; bud 6 viste ringene, men gav ingen vej til at skifte. Nu: tryk på statuslinjen/ringene på flisen (`.kv-status`) eller på status-knappen i briefen (`#kbStatusChip`, knapraekken ved Start optagelse) → husets ark (`klipStatusArk`) med de seks statusser som lange knapper, den valgte rød; valget skriver via `klipStatus` (samme motor som før), tegner siden igen og opdaterer knappen i briefen. Ordene på flisen er uændrede (`klipLinje`); i arket står statussernes egne navne (`klipStatusVis`).

## 5ao. v1916: Hjem på computeren efter Idas fem beskeder kl. 15.30 til 15.45

Idas ord: »hvad sker der seriøst her for layoutet på mit hjem på desktop???« · »disse skal komme frem på kunden - altså hinges hus!! Ikke på min idag?« · »jeg skal kunne arbejde i mine todos?? lige nu kan jeg kun klikke på fluebenet???« · »ALT skrift på min desktop version ser super grumset ud« · »er du ikke lige sød at kalde på superpower og ux ui og emil design« · »det er som om at alt jeg besluttede i den anden tråd er gået tabt«.

**Hvad der var gået tabt fra skytråden (læst i overleveringen, afsnit 6.1):** rækkefølgen Kunder · Salg · Content Studio som de tre første. Bud G havde Kunder · Mine rum · Energida Studio · Salg … Nu: Kunder · Salg · Content Studio · Energida Studio · Workout Studio · Food Studio · Mindful Studio · Mine rum · Teknik, på computeren. Resten af skytrådens 42 punkter er i koden (v1888 til v1906 ligger under alt herfra); det åbne fra dens liste er stadig hilsnerne i basen, I/jer i modul 5 og 6, notifikationer og målgrupper på Performance.

1. **»Er det postet?« er kundens.** Grenen er fjernet fra Idas Venter på dig (`venterRaekkerFra`); kunden får spørgsmålet i sin egen Indbakke (`opslagPostetListe`, alle kunder, ikke kun Content Studio-kunder). Godkend, retur, kommentar, to-do og ønsker står stadig hos Ida.
2. **Venter på dig som bud G:** én rød ramme med hvide rækker (`bsVenterRammeHtml`, `.bs-idag`), svarene som røde ord til højre; før stod telefonens røde kort stablet i fuld bredde.
3. **Bredden:** `#bsForside` var låst til 1100 px, så et 2000 px vindue viste en smal søjle og 900 px tomt. Nu 1500 px på computeren.
4. **To-do kan rettes:** tryk på flisen åbner arket med teksten og datoen som chips (Ingen dato · I dag · I morgen · Om en uge · den nuværende); Gem skriver til samme række som telefonens to-do-side (`bsTodoRet`). Fluebenet = klaret som før.
5. **Egne ikoner i den smalle skinne:** person · søjler (Salg) · pen (Content Studio) · afspil (Energida Studio) · håndvægt · skål · hjerte (Mindful) · hus (Mine rum) · tandhjul (Teknik). Før: fire ens kalendere.
6. **»Grumset skrift«:** målt på html, body, dashMain, dash-wrap, dside-overblik og bsForside: ingen transform, filter, opacity, zoom eller font-smoothing-regel; Poppins 400. Ikke rettet, for der er ingen kode at rette; Chromes »Genstart for at opdatere« og zoom er de to ting uden for koden.

**Målt:** `koer.sh` 19 døre + 15 sider OK. Hjem måles live efter deploy.

## 5ap. v1917: Idas to-dos lå kun i hendes Chrome (fundet 14/9 kl. 16.05 under målingen af v1916)

**Målt i basen:** `skema_svar` har TRE rækker ENERGIDA/Ida/haengepartier (13/7 og to fra 10/9), alle med den samme ene to-do. `vaneRow` brugte `maybeSingle()`, som fejler ved flere rækker, så alle Idas Vane-lister med dubletter faldt tilbage til browserens localStorage. Derfor: 10 to-dos i Idas Chrome, 1 i basen, 1 i browserpanelet. Ingen af de ni var nogensinde nået basen (så en anden enhed viser dem ikke).

**Rettelsen:** `vaneRow` læser første række (`limit(1)`); `vaneGemRow` opdaterer i forvejen alle rækker med samme nøgle, så de holder samme indhold (ingen række slettes). `haengHent` lægger to-dos, som browseren har og basen ikke har, til ÉN gang og gemmer (Gem må ikke slette: intet fjernes). Når Ida åbner appen i sin Chrome, følger de ni med i basen. Arket til en to-do hedder »To-do« (titlen var to-do'ens egen tekst i Didot over tre linjer).

**Ikke gjort:** de to dubletrækker er ikke slettet (kræver Idas ja; et SQL-kort kan gøre det, når listen er i basen).

## 5aq. v1918: hele videoflisen åbner lektionen igen (Ida 14/9 kl. 16.15: »nu kan jeg ikke åbne lektionerne og se manus når jeg klikker på dem«)

v1915 lod statuslinjen og ringene på flisen åbne status-arket; et tryk midt på flisen (hvor man plejer at trykke) ramte dem og åbnede arket i stedet for briefen. Målt i Idas session: titlen åbnede briefen, statuslinjen åbnede arket. Nu: hele flisen åbner lektionen (`klipBriefAaben`), status skiftes ét sted, i briefen (`#kbStatusChip` → `klipStatusArk`). Ét tryk, ét svar (4/9).

## 5ar. v1919: UX-politiet over alle admin-sider på 1440 med Idas data (Idas klik 14/9 kl. 16.30)

Målt i Idas admin-session (browserpanelet, 1440) med en måler (`__uxMaal`) på 20 sider: hero (Didot 52, én hero, 32 px luft), streger i fliser, trykfelter under 32 px, emoji, vandret sejlads, fed Poppins, Didot på rødt, gamle ord, dubletdøre, stiens første led, rosa. Sider: Hjem · Kunder · Kunder › Succesfuld Detaildrift · Kundeside · Salg · Pipeline · Priser · Tilbud og salgstekster · Økonomi · Produkter · Gameplan (Skabeloner) · rummet Markedsføring · Content Studio · Velkomsthilsner · Citater · Energida Studio · Workout · Food · Mindful · Mine rum · Teknik · Byggekøen · Eksempler pr. forretningstype.

**Rettet (bryder en lås, ingen ny tegning):**
1. `.bs-hero` var 60 px fra 900 px (Hjem, Kunder, Produkter, rummene, Teknik, Mine rum). Låsen 11/9: én hero, 52 px på alle bredder. Nu 52.
2. Etiketten under heroen (»Backstage« på Kunder, Søg, Indbakken; »Energida« på Produkter) gav 4 px luft og sagde det samme som siden. Ude; 32 px luft som Mine rum (14/9 kl. 09.24).
3. Byggekøens egen titel havde 4 px under (`.mr-omr .ch-titel {4px}` vandt). Nu 32 for områdernes egne titler.
4. Stien: Produkter sagde »Energida / Produkter« (nu Hjem › Salg › Produkter, Tilbage → Salg); Eksempler pr. forretningstype sagde »Maskinrummet / …« (nu Hjem › Teknik › …, Tilbage → Teknik).
5. Mine rum-døren viste den sidst åbnede undervisning (Produkter) i stedet for Mine rum. Nu altid Mine rum.
6. Didot på rødt: Kundeopgavernes røde kort (`.bs-rk-n`) havde opslagets titel i Didot. DESIGNLÅS: Didot er forbeholdt navnet; opgaver står i Poppins. Nu Poppins 15.
7. Trykfelter: »Kør systemtjek« i foden (72×15) og »Ret typerne« (66×17) er 32 px høje; svarene i Venter på dig (Ja/Nej, 32) er 34.

**Målt OK uden fund:** Salg, Priser, Tilbud og salgstekster, Gameplan (Skabeloner), Content Studio, Velkomsthilsner, Energida Studio, Mindful Studio, Teknik (kun fodens knap, nu rettet).

**Åbent, kræver Idas klik (gammelt design eller ny tegning, ikke en lås-rettelse):**
- **Salg › Pipeline** åbner det gamle CRM (`dside-crm` med fanerne Kunderne · Pipeline · Kontakter & leads · Koder og adgang · Testere, 27 små faner, streger i pipelinekortet, heroen siger »Kunder«). Hele siden er før låsen.
- **Salg › Økonomi** (`dside-budget`): ingen hero, tabel med streger, slet-knapper 19×20. Før låsen.
- **Lister i én kasse på computeren:** Citater på dashboardet (16 rækker med streger, Slet 46×31), Food (1), Workout Studios øvelsesbibliotek (103 rækker + »+« 34×25). På telefonen bliver rækkerne til fliser (5/9-låsen); på computeren står de som rækker i kortet. Fliser i fuld bredde er den anden lås (14/9). Kræver en tegning.
- Idas egen to-do-tekst indeholder en emoji (»Let's go bro🚀«): hendes ord, ikke rørt.
- »Ingenting endnu.« som tom-tekst i kort (Workout, Food, Mindful) er 12/9-låsen for tomme lister (v1848) og står.

## 5as. v1920: forretningstyperne på Eksempler-siden var basens gamle navne (Ida 14/9 kl. 16.50: »jeg er i chok!! dette er totalt forældet??«)

**Målt i basen (`bs_forretningstype`):** raadgiver hed stadig »Raadgiver, klinik eller B2B« (24/8), spisested var aktiv (lukket i koden 26/8), webshop lå efter butik+webshop (rækkefølgen vendt 3/9). Siden Eksempler pr. forretningstype læste navnene direkte fra basen, så den viste 24/8-verdenen, mens oprettelsen og kundens app viser kodens fire (Fysisk butik · Webshop · Fysisk butik + Webshop · Ydelsesforretning).

**Rettet i basen i Idas session (kvitteret med `.select()`):** raadgiver → navn »Ydelsesforretning« (beskrivelsen tømt), spisested → aktiv = nej (intet slettet), webshop → sortering 11.

**Rettet i koden:** `teHent` viser kun `FORRETNINGSTYPER`s nøgler, med kodens navne og rækkefølge; basens navn bruges ikke længere til visning. Eksempler-siden: 32 px under heroen. Stien på Mine rum siger »Mine rum« (ikke »Energida«).

**Ikke afgjort:** om eksemplerne pr. type (`bs_type_eksempler`, skrevet 24/8) stadig er dem, Ida vil have. Det er hendes ord.

## 5at. v1921: Salg › Pipeline = bud 3 »Dagens salg« (Idas klik 14/9 kl. 17.20 efter fem bud med anbefalinger, Artifact 0cd313f6)

Ida valgte UX-politiet frem for en ny tegning (kl. 16.30), derefter Pipeline som den første af de tre gamle flader (kl. 17.05), fem bud med min anbefaling pr. bud (kl. 17.15), og bud 3 (kl. 17.20).

**Bygget:** `bsSalgAabn` åbner `SALG_AABEN = "pipeline"` i Salg-området (`salgTegn`), ikke det gamle CRM. `plHtml`: »Følg op i dag« (`plIdag`: næste aktivitet ≤ i dag, eller samarbejde udløber inden 14 dage; Afsluttet/Ikke igang tælles ikke) som `.bs-idag`-rammen med Åbn → `openModal(kontakt)`; fire ringe (`energidaRing`, 88 px) i `.pl-rg`-fliser med tal og andel af alle; chips på status (`PL_STATUS`, Idas ord: Lead · Kontaktet · Ikke sendt · Aktiv · Passiv · Ikke igang · Afsluttet), kun dem med kontakter; kontakterne som `.bs-kf` i `.pl-gitter` (3 spalter, 1 på telefonen); »Tilføj kontakt …« (`plNyGem` → `contacts` med status Lead, kvitteret med `.select()`). Heroen i området skifter til »Pipeline«, stien Hjem › Salg › Pipeline, Tilbage → Salg.

**Ikke bygget:** kontaktkortet som ark (det gamle `openModal` bruges), Ny kontakt-arket, langt tryk = flyt status. Det gamle CRM (`bsSalgAabnGAMMEL`) står urørt bag Kunder › »Pipeline, kontakter og koder«.

**Målt:** `koer.sh` 19 døre + 15 sider OK. Live-måling på 1440 og 390 i næste afsnit.

## 5au. v1922: foldemenuen følger det åbne område (målt i selen 14/9 kl. 17.45)

**Målt i selen (tom base) på 1440 og 390:** Pipelinen står som bud 3: hero »Pipeline«, sti Hjem › Salg › Pipeline, Følg op i dag (tom-tekst uden data), fire ringe (to spalter på telefonen), chips, tom liste, »Tilføj kontakt …«, Tilbage 48 px lang på telefonen. Ingen vandret sejlads. **Fund:** åbnes Pipeline fra Hjem (mrGaaTil), stod »Mine rum« rød i menuen, fordi `visDashSide('maskinrum')` ikke svarer til nogen dør. Nu tegner `mrAabn` menuen efter området (salg, contentstudio, oevelser → workout, food, mindful).

**Ikke målt med Idas data:** browserpanelet mistede login, da det blev lukket, så Følg op i dag, ringene og de 90 kontakter er ikke set live. Måles, når Ida logger ind i panelet igen.

## 5av. v1923: dagens kort (telefonens) stod på computerens dashboard i b2b (Ida 14/9 kl. 18.05: »mobil tøm hovedet er også på dashboardet med swipefunktionen!!!! FIX DETTE«)

**Målt i browserpanelet, logget ind som en Content Studio-kunde:** kortet (foto, »Godaften«, »SWIPE OP FOR EN NY IDÉ«, Content Studio-knappen) er `position:fixed` og dækkede hele fladen på 1440. `dagensKortKunde` har en 760 px-spærre, når kortet TEGNES, men blev vinduet bredere bagefter (panelet: tegnet ved 679 px), stod kortet der stadig. **Rettet:** `@media (min-width:761px) { #dagensKort { display:none !important } }`: på computeren findes kortet ikke, uanset hvornår det blev tegnet. Telefonen er urørt.

## 5ax. v1924: kundeappen med elevens øjne (Ida 14/9 kl. 17.40: »log ind som en kunde, en elev i en butik der skal bruge det i en travl hverdag, og gennemgå ALLE sider for alle funktioner«)

Målt i Idas browserpanel, logget ind som en Content Studio-kunde, 390 og 1440, alle sider og arkene (Tøm hovedet, planlægningsdagen, briefen). Fund-listen: Artifact c18ec2f6 (»Kundeappen med elevens øjne«).

**Rettet (v1924):** Indbakkens »Ja, postet«/»Nej, ny dato« var 158×40 side om side → lange 48 px under hinanden på telefonen. »Start planlægningen« 318×44 (inline-stil slog reglen) → 48 px fuld bredde. »Tema« i menuen førte til kalenderen uden tema-kort → åbner Målsætninger, hvor temaet sættes.

**Stopper eleven, Idas valg:** ~~Drejebogen siger »Strategien er på vej«~~ RETTET MÅLING kl. 18.55: Drejebogen findes (generation med 16.344 tegn markdown) og åbner i sit eget vindue (`window.open`, 112 KB bog med Tilbage); browserpanelet blokerede vinduet, og jeg læste screen1's skjulte reservetekst. Fejlen var min. Eleven skal vide, at bogen åbner som ny fane, og at Safari skal tillade pop op. Kalenderen på telefonen har kun I dag + Kommende. Idébanken: 25 af 31 idéer under »Andet« (ingen søjle sat).

**Gammelt design, venter på tegning:** Værktøjskassen (tekstblokke, versaler, »Åbner, når din strategi er bygget« hos en kunde med bygget strategi, 90 px felt), Målsætninger (22 px toggles, 17 px tekstlinks), Hjem på computeren (ugegitter med små plus, 30 px ikoner, 20 px flueben), kalenderen på computeren (28 px pile, 17 px link), planlægningsdagens topbar med Tilbage (Idas eget klik 13/9).

**Målt OK:** Hjem på telefonen, briefen, Performance, Indbakken, Tøm hovedet-arket, Arkivet, Inspiration, planlægningsdagens fem trin.

**Ikke målt:** optagelse/oplæsning, Del, Log ud, Skift adgangskode, Drive-mappen, Ønsker til appen med et rigtigt ønske, strategibyggeren, en YOU GOT THIS-kunde.

## 5ay. v1925: Drejebogen på telefonen åbner i appen (Ida 14/9 kl. 19.10: »vurderer du at drejebogen fungerer?«)

**Målt i Idas session som kunde på 390:** menuens »Drejebogen« kaldte `drejebogAaben` → hentning (await) → `bsVis` → `window.open`. Et nyt vindue EFTER en hentning er uden for trykket, så pop op-spærren (Safari på iPhone og browserpanelet) stoppede det: bogen kom aldrig, og alerten »Browseren blokerede vinduet« var det eneste, eleven så. Samtidig lå telefonens egen bog (`bsMobilBogTegn`, bud 2 8/9: hvide sider, én ad gangen, swipe) klar i screen1 og blev kun tegnet af `showTab(1)`, som menuen ikke kaldte.

**Rettet:** på ≤ 760 px åbner `drejebogAaben` screen1 og tegner bogen i appen (målt: 10 sider, »Den røde tråd · Drivkraften …«, Tilbage 358 px lang, ingen tom-tekst). På computeren åbnes vinduet FØR hentningen (mens trykket gælder) og lukkes igen, hvis der ingen bog er; `bsVis(kode, vindue)` tager det åbne vindue.

**Vurdering:** teknisk virker Drejebogen nu på begge flader for en kunde med genereret bog. Om ordene i bogen holder, er Idas dom, ikke min.

## 5az. Kalenderen på telefonen bliver, som den er (Ida 14/9 kl. 19.30)

Ida klikkede bud 4 kl. 19.20 (Dag · Uge · Måned som piller, kun dage med opslag). Jeg byggede det (`KAL_TLF_VIS`, `kalTlfVis`, perioderækker i `contentFacitTegn`), målte det i selen (OK) og var på vej til at måle det live, da hun skrev kl. 19.30: »jeg vil heller ikke have vist datoerne hvor der ikke er indhold. det skal bare være som det fint var kommende indhold eller noget som det var før? det var da super?? vi havde da ramt noget godt tidligere???« **Ændringen er rullet tilbage før deploy** (index.html og version.txt tilbage til v1925). Telefonens kalender er uændret: I dag · Kommende indhold · Kommende opslag · den røde plus. Buddene (Artifact 67bd2170) står som dokumentation. Lære: et klik på et bud er ikke det samme som et ja til at bygge om det, der virker; spørg »skal det ændres overhovedet?« før fem bud på noget, hun er glad for.

## 5ba. v1926: søjlen vælges, når idéen skrives (Idas klik 14/9 kl. 20.00; hendes ord kl. 19.55: »forslag, der udelukkende løfter produktet«)

**Løftet:** 25 af kundens 31 idéer lå under »Andet«, fordi ingen søjle var sat, så briefen, kalenderen og Performance kendte ikke søjlen. **Bygget:** `kundeArkAabn` → `ekstraAf("ide")` tegner `kundeArkSoejleChips()` (1A · 1B · 2A · 2B med kundens navne via `soejleVis`) som anden chip-række; `kundeArkSoejleVaelg` sætter `KUNDE_ARK_SOEJLE` (tryk igen = fravalgt); `kundeArkGem` kaster »!Vælg en søjle først.« uden valg (arket viser beskeden). Idébankens sendefelt »Ny idé …« (`ibMobilNyIde`) går nu gennem arket med teksten forudfyldt (13/9-låsen: alt skrives i arket); »+ Ny idé« på computeren gik allerede gennem arket. Står man i en søjle i Idébanken, er den valgt på forhånd. `efterLuk` tegner Idébanken igen. Eksisterende idéer uden søjle er urørte (Idas data).

**Målt:** `koer.sh` 19 døre + 15 sider OK; arket målt i selen (chips, afvisning uden søjle, gem med søjle) og live i Idas session, se næste afsnit.

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
