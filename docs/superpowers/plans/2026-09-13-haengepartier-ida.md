# Hængepartier fra Ida, indtalt 13. september 2026

Idas egne ord er kortet ned til det, hun bad om. Under hvert punkt står, hvad appen kan i dag (målt i koden, v1861), hvad der mangler, og hvad sky-tråden anbefaler. Størrelse: S = en eftermiddag, M = en dag, L = flere dage med klik-valg undervejs. **Kontrakt** = rører storage, RLS, Edge Functions eller noget, der koster pr. kald; skal igennem `ENERGIDA SECURITY CONTRACT.md` først.

## 1. Oplæsning på briefoversigten (ordblind kunde) · S

**Ida:** En kunde er ordblind og har bedt om en oplæsningsfunktion på briefoversigten.
**I dag:** Backstage kan allerede læse manus op med en dansk stemme (`klipBriefLaesOp`, Web Speech, vælger da-DK-stemmer, højtaler-ikon). Kundeappen har ingen oplæsning.
**Mangler:** En "Læs op"-knap på briefens overblik (og på hvert spørgsmålskort), der læser titel, de tre trin og felterne op i rækkefølge, med stop-knap. Samme motor som Backstage, én funktion, to steder.
**Anbefaling:** Byg først. Lille, én kunde venter, og det gavner alle på telefonen. Virker på iPhone og computer uden nogen server. Stemmen er telefonens egen; kvaliteten afhænger af, om kunden har den danske stemme installeret (iPhone har den som standard).

## 2. Billede, kamera og link på en idé (Ny idé / Idébanken / Inspiration) · M · Kontrakt (kun læsning af, hvad der findes)

**Ida:** Når en kunde swiper op på Ny idé, skal man kunne sætte et link til inspirationen og/eller vedhæfte et billede, som "+"-knappen i en sms. Og gerne åbne kameraet direkte og tage billedet dér, hvor man står. Inspiration er den del, der mangler mest styr på.
**I dag:** Inspiration kan uploade billeder (`uploadInspBilleder`, bucket `inspiration`, offentlig url) og gemme links. En idé kan bære ét inspirationselement (`INSP_VEDHAEFT`) valgt fra listen. Ny idé-arket har ingen "+"-knap, intet kamera, intet linkfelt.
**Mangler:** På Ny idé-arket: én "+"-knap med tre valg: Tag et billede (kamera), Vælg fra kamerarullen, Indsæt et link. Billedet lander i Inspiration (samme bucket, samme upload) og hægtes på idéen; linket gemmes på idéen med titel hentet fra adressen. Idéens kort og briefen viser billedet/linket. Kameraet er ét attribut på filfeltet (`capture="environment"`), ingen ny teknik.
**Anbefaling:** Byg som nummer to. Bucket og upload findes, så kontrakten røres ikke, men størrelsen på billeder skal begrænses (nedskalering på telefonen før upload), ellers fylder én kundes fotos hurtigt.

## 3. "Ønsker til appen" på b2b under profilen · S

**Ida:** Et sted, kunderne kan skrive ønsker til funktioner. Ikke noget kun hun ser; det skal være for kunderne.
**I dag:** Findes ikke. Der er en kundenoter-tabel og Indbakken i Backstage.
**Mangler:** Under profilmenuen (b2b): "Ønsker til appen" med ét felt og Send. Ønsket lander som række (skema_svar, skema `app_oenske`) og i Idas Indbakke og på Backstage Hjem som Venter på dig. Kunden ser sine egne ønsker og status (modtaget / på vej / bygget), så det ikke føles som et hul.
**Anbefaling:** Byg som nummer tre. Lille og giver Ida en kanal, der ellers går over sms.

## 4. Indbakken skal bære al kommunikation begge veje · M

**Ida:** Sikre, at Indbakken virker: når teamet eller Ida sender noget til godkendelse hos en kunde, når noget bliver godkendt, når en kunde kommenterer eller spørger. Kommunikation på tværs.
**I dag:** Kundens Indbakke (`indbakkenAaben`) regner sig frem til rækker: briefs sendt til godkendelse, godkendte, noter fra Ida (`KUNDE_NOTER`). Backstage har Indbakken med Venter på dig. Kundens kommentar/spørgsmål på en brief findes som noter på idéen, men ingen ensartet "besked"-række, og intet sted, hvor en tråd samles.
**Mangler:** En gennemgang med de fire roller (Ida, teamet, kunde A, kunde B) af hver hændelse: sendt til godkendelse, godkendt, afvist med kommentar, spørgsmål fra kunden, svar fra Ida, ønske (punkt 3), dagen-efter-kortet (punkt 7). Hver skal have ét sted at lande på begge sider, og et svar skal kunne gives fra rækken. Ingen ny tabel, hvis `kunde_noter` kan bære retningen (fra/til).
**Anbefaling:** Kør som en 360 med sele, ligesom briefen og lektionerne: mål hver hændelse, ret hullerne, deploy. M, men den binder punkt 3 og 7 sammen, så den bør ligge før dem to.

## 5. Tilpas Drejebogen: de fire byggesten på telefon og computer, og alt følger med · M

**Ida:** Kunden skal nemt, på telefon og computer, kunne åbne de fire byggesten og ændre dem. Derefter skal briefen (som bygger på Drejebogen) og Drejebogen selv opdateres automatisk, så hun kan stole på, at en ændring slår igennem alle relevante steder.
**I dag:** "Tilpas drejebog" findes (`tilpasAaben('drejebog')`) for dem, der ejer strategien (`maaRedigereByggesten`). Briefen læser byggestenene, når den tegnes; Drejebogen tegnes af motoren fra de samme data. Ingen måling af, om ALLE flader læser samme kilde, og om telefonens vej er lige så kort som computerens.
**Mangler:** Et tvillingetjek: samme byggesten ændret på 390 og 1440, og så hver flade målt bagefter: Drejebogens 16 sider, briefens forslag og CTA-lister, Hjems rejse, ordbogen. Fund rettes; det, der cacher gamle værdier, ryddes.
**Anbefaling:** M. Kør som gennemgang med sele, og skriv resultatet ind i statusdokumentet, så trygheden er målt, ikke lovet.

## 6. Performance: mål for prøvereels og story-dage, og planlægningsdagen som ritual · L

**Ida:** Under Performance skal man kunne sætte mål for prøvereels og for tjek-ind i Story (hvilke dage man er aktiv i Story). Og en ny funktion på planlægningsdagen: et fast tidspunkt til at planlægge næste uges indhold. Appen skal selv foreslå næste opslag ud fra de indholdssøjler, der mangler. Ikke kun planlægge opslag: også hvornår de skal optages, ugens mål, og hvornår næste uges indhold planlægges (i kalenderen). Man starter med at kigge tilbage på sidste uges indhold og hvordan det gik.
**I dag:** Målsætninger findes (ugemål for opslag, `MAAL_UGE`, `kunde_maal`), planlægningsdagen vælges én gang (`vaelgPlanDagModal`, `planDato`), Prøvereel er en liste i Idébanken, de fire søjler og kalenderen findes, statusser Planlagt/Postet findes.
**Mangler:** Selve ritualet: en guidet flade, der åbner på planlægningsdagen (og fra Hjem): 1 Tilbageblik: sidste uges opslag, sæt Postet, hvad gik godt og hvad var svært (punkt 7 genbruges). 2 Næste uge: appen foreslår ét opslag pr. søjle, der mangler dækning i kalenderen, ud fra Drejebogen og månedens tema; kunden vælger og lægger dem på dage. 3 Optagedage: hvornår optages de. 4 Ugens mål: opslag, prøvereels, story-dage (nye mål i `kunde_maal`). 5 Book næste planlægning: dato og klokkeslæt i kalenderen. Performance viser målene ved siden af tallene.
**Anbefaling:** Den største og vigtigste. Byg i to trin: først målene (prøvereels, story-dage) på Performance (S), så ritualet (L) med mockups først, som ved lektionssiden.

## 7. Dagen efter et opslag: "I går postede du …", status og refleksion · M

**Ida:** Automatisk dagen efter et planlagt opslag: en besked "i går havde du dette opslag"; kunden sætter status til Postet og reflekterer: hvad gik godt, hvad var svært. Skal lande i Indbakken, medmindre noget andet er bedre.
**I dag:** Statusserne findes; dagens kort (Tøm hovedet) vises ved åbning; ingen notifikationer (appen har ikke push: ingen `Notification`, ingen `pushManager` i sw.js).
**Mangler:** Et "I går"-kort: alle idéer med status Planlagt og dato i går (eller tidligere) samles i ét kort på Hjem og i Indbakken: Postet / Ikke postet, og to korte felter: godt / svært. Svarene gemmes på idéen og vises i Performance og på kundekortet i Backstage.
**Anbefaling:** Byg det i appen (Hjem + Indbakke), ikke som push. Push kræver serviceworker-push, en server der sender, og nøgler, og det er kontraktarbejde. Kunden åbner appen på planlægningsdagen alligevel, og kortet er der, når de kommer. Push kan lægges på senere, når resten virker.

## 8. Månedsplanlægning: hver fjerde planlægning · L (del af punkt 6)

**Ida:** Hver fjerde planlægning bliver en månedsplanlægning med et spørgeskema som popup: hvad skal næste måneds tema være, hvilken udfordring står målgruppen/målgrupperne i, hvad skete der på samme tid sidste år, og alt det, der gør ugens opslag nemmere.
**I dag:** Månedens tema findes (`temaAaben`, Tema under Content Studio); øvelse 6-6 i forløbet stiller allerede tema-spørgsmålene (måneden, hvad sker der i butikken, søjlerne, faste dage).
**Mangler:** Ritualet (punkt 6) tæller planlægninger; hver fjerde åbner månedsdelen først: spørgsmål ét ad gangen (samme form som øvelsen), svar skriver månedens tema og lander som forslag i næste uges planlægning. "Samme tid sidste år" kræver, at kalenderens historik læses (findes).
**Anbefaling:** Byg sammen med punkt 6, som trin 0 i ritualet. Spørgsmålene bør være Idas egne ord; sky-tråden foreslår kun formen.

## Foreslået rækkefølge

1. Oplæsning (S), 2. Billede, kamera og link på idéen (M), 3. Indbakke-360 (M), 4. Ønsker til appen (S), 5. Drejebog-synk-tjek (M), 6. Mål for prøvereels og story-dage (S), 7. Dagen efter-kortet (M), 8. Planlægningsritualet med månedsplanlægning (L, mockups først).

Rækkefølgen er sky-trådens forslag; Ida vælger på klik.
