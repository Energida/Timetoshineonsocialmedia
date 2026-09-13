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
