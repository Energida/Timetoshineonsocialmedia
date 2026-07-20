-- TIP TOP STUDIO: opret produktionstavlen OG læg manus ind — ÉN kørsel, i rigtig rækkefølge
-- Kilde: 'MANUS - de 7 rettede filer' (14.-15. juli).
-- FREDNING: opretter kun lektioner der mangler + udfylder kun TOMME manus-felter. Kan køres igen uden skade.

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$0.1 · Velkommen til forløbet$x$, $x$Modul 0 · Introduktion$x$, $x$KLIPPE-BRIEF · Lektion 0.1 · Velkommen til forløbet
Modul: Modul 0 · Introduktion
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 0-1-velkommen-til-forloebet.mp4
Kernen: M0-L1-velkommen-til-forloebet-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M0-L1-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M0-L1-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Hej!
Og rigtig meget velkommen til!
I det her modul gennemgår jeg alt det, der er nice og need -to-know, så du kan få fuldt udbytte af dette forløb.
Rigtig god fornøjelse!$x$
where not exists (select 1 from video_opgaver where titel like $x$0.1 %$x$);
update video_opgaver set manus_tekst = $x$Hej!
Og rigtig meget velkommen til!
I det her modul gennemgår jeg alt det, der er nice og need -to-know, så du kan få fuldt udbytte af dette forløb.
Rigtig god fornøjelse!$x$ where titel like $x$0.1 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$0.2 · Perfekt, uperfekt$x$, $x$Modul 0 · Introduktion$x$, $x$KLIPPE-BRIEF · Lektion 0.2 · Perfekt, uperfekt
Modul: Modul 0 · Introduktion
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 0-2-perfekt-uperfekt.mp4
Kernen: M0-L2-perfekt-uperfekt-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M0-L2-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M0-L2-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Jeg har faktisk haft det her forløb klar længe.
Men jeg har gået og bildt mig selv ind, at jeg ikke kunne gå i gang - før både jeg og de fysiske rammer var perfekte.
-
Jeg har haft en helt klar idé om, hvordan de her undervisningsmoduler skulle se ud.
Og hvordan jeg selv skulle se ud.
 
Alt sammen baseret på, hvad jeg tænkte, at I forventede af mig og hvordan andre laver sådan noget her.
Perfekthedsfælden kalder jeg det.
Måske kender du den?
 
Men da jeg endelig fandt lidt ro, blev jeg bevidst om, at det slet ikke var det der holdt mig tilbage – det var bare min undskyldning.
Den reelle årsag var frygt.
-
B-ROLL: mig på marken der kigger ud gennem et gardin
Jeg har set dette billede for mig.
Jeg står på en stor scene og kigger ud gennem forhænget.
“Uha. Det ser lidt farligt ud derude. - Jeg venter lige lidt endnu.”
Og det har faktisk været enormt hårdt at stå deromme og trippe, når man har så meget på hjertet.
-
Derfor var det en stor forløsning, da jeg kom ind til kernen af, hvad der faktisk spændte ben for mig.
-
B-ROLL: jeg går ud på marken. På vejen smider jeg mine stiletter. Og så tager jeg et papir ud af min blazer og smider det væk — på papiret står der “hvad andre tænker om mig”.
For nu er jeg klar til at gå ud på den scene – og formidle alt det jeg har på hjertet, som jeg ved kan gøre en stor forskel for jer.
-
Så her får I mig.
Helt uperfekt – i videoer lavet præcis på den måde, der føles rigtig i mig.
For det er nemlig hele kernen af dette forløb:
-
At forstå dig selv.
Forstå hvorfor du gør som du gør.
At blive bevidst om, hvad der spænder ben for dig og din forretning.Og derefter tage kontrollen tilbage.
Og det gør vi nu. Sammen.
-
Men inden vi går rigtigt i gang, er der lige nogle praktiske ting, der er gode at vide, så du får mest muligt ud af forløbet.$x$
where not exists (select 1 from video_opgaver where titel like $x$0.2 %$x$);
update video_opgaver set manus_tekst = $x$Jeg har faktisk haft det her forløb klar længe.
Men jeg har gået og bildt mig selv ind, at jeg ikke kunne gå i gang - før både jeg og de fysiske rammer var perfekte.
-
Jeg har haft en helt klar idé om, hvordan de her undervisningsmoduler skulle se ud.
Og hvordan jeg selv skulle se ud.
 
Alt sammen baseret på, hvad jeg tænkte, at I forventede af mig og hvordan andre laver sådan noget her.
Perfekthedsfælden kalder jeg det.
Måske kender du den?
 
Men da jeg endelig fandt lidt ro, blev jeg bevidst om, at det slet ikke var det der holdt mig tilbage – det var bare min undskyldning.
Den reelle årsag var frygt.
-
B-ROLL: mig på marken der kigger ud gennem et gardin
Jeg har set dette billede for mig.
Jeg står på en stor scene og kigger ud gennem forhænget.
“Uha. Det ser lidt farligt ud derude. - Jeg venter lige lidt endnu.”
Og det har faktisk været enormt hårdt at stå deromme og trippe, når man har så meget på hjertet.
-
Derfor var det en stor forløsning, da jeg kom ind til kernen af, hvad der faktisk spændte ben for mig.
-
B-ROLL: jeg går ud på marken. På vejen smider jeg mine stiletter. Og så tager jeg et papir ud af min blazer og smider det væk — på papiret står der “hvad andre tænker om mig”.
For nu er jeg klar til at gå ud på den scene – og formidle alt det jeg har på hjertet, som jeg ved kan gøre en stor forskel for jer.
-
Så her får I mig.
Helt uperfekt – i videoer lavet præcis på den måde, der føles rigtig i mig.
For det er nemlig hele kernen af dette forløb:
-
At forstå dig selv.
Forstå hvorfor du gør som du gør.
At blive bevidst om, hvad der spænder ben for dig og din forretning.Og derefter tage kontrollen tilbage.
Og det gør vi nu. Sammen.
-
Men inden vi går rigtigt i gang, er der lige nogle praktiske ting, der er gode at vide, så du får mest muligt ud af forløbet.$x$ where titel like $x$0.2 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$0.3 · Nice- og need-to-know$x$, $x$Modul 0 · Introduktion$x$, $x$KLIPPE-BRIEF · Lektion 0.3 · Nice- og need-to-know
Modul: Modul 0 · Introduktion
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 0-3-nice-og-need-to-know.mp4
Kernen: M0-L3-nice-og-need-to-know-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M0-L3-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M0-L3-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Noter
Helt med vilje har jeg ikke lavet færdige notater til hver lektion.
Vi lærer nemlig bedst - hvis de noter vi skriver - kommer ud gennem vores egen hånd.
Og jeg vil rigtig gerne, at du lærer det jeg har på hjertet. Så grib en kuglepen og papir eller åbn et dokument på din computer – vælg det der fungerer bedst for dig.
Jeg vil anbefale dig at se en lektion færdig, før du begynder at skrive noter. Og du kan altid gå tilbage og se alle moduler igen.
 
Opgaver
Efter nogle af lektionerne venter der en lille øvelse i appen. Den stiller spørgsmålene ét ad gangen — og til sidst bliver alle dine svar samlet, så de arbejder videre for dig gennem hele forløbet.
 
Skærmdublering
Noget, jeg selv godt gad have vidst tidligere, er, hvor smart det er at skærmdublere online undervisning.
Uanset om du ser med på din telefon eller computer, så kan du få undervisningen op på dit TV.
Det giver et helt andet overblik og gør det mere behageligt at følge med.
 
AI & kildehenvisninger
Det er vigtigt for mig at sige, at jeg har brugt AI som sparringspartner på struktur og opbygning til forløbet, men erfaringerne og metoderne er fra mig til dig.
Du finder alle kildehenvisninger samlet efter sidste modul.
 
Har du ikke tid?
Hvis du allerede har kigget ned over modulerne og tænkt:
“Holy badoly. Det har jeg sgu ikke tid til.”
Så giv lige modul 1 en chance.
Og se, om du derefter synes, at du har tid til at lade være.
 
Hvornår kan jeg se resultaterne?
Som tommelfingerregel skal du give dig selv cirka tre måneder til at teste hvad der virker for dig, dine kunder og din forretning.
Og ikke mindst hvad du faktisk synes er sjovt og giver dig energi.
For lidt ligesom i et træningscenter får du ikke resultater af bare at møde op, sætte dig i sofaen og drikke en halvdårlig kop kaffe.
Øvelse gør mester og du er nødt til at arbejde med det for at lære det.
-
Hvis der er en lille stemme inde i dig, der siger:
“Men jeg kan altså ikke bruge mere tid på content end jeg allerede gør.”
Så lad mig lige vise dig to prøvereels.
Og hvis du ikke ved, hvad en prøvereel er, så er det kun endnu en god grund til, at du er her.
VIDEO 2+3 - Drinksvideoerne
Begge videoer er lavet på præcis det samme råmateriale.
Samme optagelser.
Men med få ændringer i opbygning og klipningen fik den ene over 90.000 visninger og den anden under 1.000.
Det betyder ikke, at målet altid er at gå viralt.
Det viser bare, hvor stor forskel små justeringer kan gøre.
Og det er præcis den slags, du skal lære undervejs – så du kan få værdi ud af den tid du lægger i.
 
Contentpolitiet
Undervejs i modulerne kommer du til at møde Contentpolitiet.
De er ikke til for at slå dig oven i hovedet, men som en kærlig reminder, der siger:
“Ups. Den tager vi lige næste gang, makker.” når du falder tilbage i det, du plejer.
 
Adgang
Ligesom du gerne vil passe på din forretning, vil jeg også gerne passe på min.
Derfor vil jeg bede dig ikke dele din adgang eller undervisningen i forløbet med nogen uden for din virksomhed.
Du må til gengæld meget gerne anbefale forløbet til en ven. Det vil jeg blive virkelig glad for.
 
◆ TIL OPTAGELSEN: Velkomstvideoen optages i TO korte versioner (1-2 min) — én pr. produkt. Produktnavnet nævnes KUN her. Resten af Modul 0 er fælles.$x$
where not exists (select 1 from video_opgaver where titel like $x$0.3 %$x$);
update video_opgaver set manus_tekst = $x$Noter
Helt med vilje har jeg ikke lavet færdige notater til hver lektion.
Vi lærer nemlig bedst - hvis de noter vi skriver - kommer ud gennem vores egen hånd.
Og jeg vil rigtig gerne, at du lærer det jeg har på hjertet. Så grib en kuglepen og papir eller åbn et dokument på din computer – vælg det der fungerer bedst for dig.
Jeg vil anbefale dig at se en lektion færdig, før du begynder at skrive noter. Og du kan altid gå tilbage og se alle moduler igen.
 
Opgaver
Efter nogle af lektionerne venter der en lille øvelse i appen. Den stiller spørgsmålene ét ad gangen — og til sidst bliver alle dine svar samlet, så de arbejder videre for dig gennem hele forløbet.
 
Skærmdublering
Noget, jeg selv godt gad have vidst tidligere, er, hvor smart det er at skærmdublere online undervisning.
Uanset om du ser med på din telefon eller computer, så kan du få undervisningen op på dit TV.
Det giver et helt andet overblik og gør det mere behageligt at følge med.
 
AI & kildehenvisninger
Det er vigtigt for mig at sige, at jeg har brugt AI som sparringspartner på struktur og opbygning til forløbet, men erfaringerne og metoderne er fra mig til dig.
Du finder alle kildehenvisninger samlet efter sidste modul.
 
Har du ikke tid?
Hvis du allerede har kigget ned over modulerne og tænkt:
“Holy badoly. Det har jeg sgu ikke tid til.”
Så giv lige modul 1 en chance.
Og se, om du derefter synes, at du har tid til at lade være.
 
Hvornår kan jeg se resultaterne?
Som tommelfingerregel skal du give dig selv cirka tre måneder til at teste hvad der virker for dig, dine kunder og din forretning.
Og ikke mindst hvad du faktisk synes er sjovt og giver dig energi.
For lidt ligesom i et træningscenter får du ikke resultater af bare at møde op, sætte dig i sofaen og drikke en halvdårlig kop kaffe.
Øvelse gør mester og du er nødt til at arbejde med det for at lære det.
-
Hvis der er en lille stemme inde i dig, der siger:
“Men jeg kan altså ikke bruge mere tid på content end jeg allerede gør.”
Så lad mig lige vise dig to prøvereels.
Og hvis du ikke ved, hvad en prøvereel er, så er det kun endnu en god grund til, at du er her.
VIDEO 2+3 - Drinksvideoerne
Begge videoer er lavet på præcis det samme råmateriale.
Samme optagelser.
Men med få ændringer i opbygning og klipningen fik den ene over 90.000 visninger og den anden under 1.000.
Det betyder ikke, at målet altid er at gå viralt.
Det viser bare, hvor stor forskel små justeringer kan gøre.
Og det er præcis den slags, du skal lære undervejs – så du kan få værdi ud af den tid du lægger i.
 
Contentpolitiet
Undervejs i modulerne kommer du til at møde Contentpolitiet.
De er ikke til for at slå dig oven i hovedet, men som en kærlig reminder, der siger:
“Ups. Den tager vi lige næste gang, makker.” når du falder tilbage i det, du plejer.
 
Adgang
Ligesom du gerne vil passe på din forretning, vil jeg også gerne passe på min.
Derfor vil jeg bede dig ikke dele din adgang eller undervisningen i forløbet med nogen uden for din virksomhed.
Du må til gengæld meget gerne anbefale forløbet til en ven. Det vil jeg blive virkelig glad for.
 
◆ TIL OPTAGELSEN: Velkomstvideoen optages i TO korte versioner (1-2 min) — én pr. produkt. Produktnavnet nævnes KUN her. Resten af Modul 0 er fælles.$x$ where titel like $x$0.3 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$1.1 · Et anderledes social media forløb$x$, $x$Modul 1 · Mindset, motivation & retning$x$, $x$KLIPPE-BRIEF · Lektion 1.1 · Et anderledes social media forløb
Modul: Modul 1 · Mindset, motivation & retning
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 1-1-et-anderledes-social-media-forloeb.mp4
Kernen: M1-L1-et-anderledes-social-media-forloeb-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M1-L1-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M1-L1-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Min far tror jeg har lavet et kursus i de sociale medier… men det er ikke helt rigtigt.
Det her forløb handler om at give dig mere energi, få flere kunder i din forretning og skabe en bedre bundlinje.
-
Elsker jeg selv de sociale medier?
Nej.
Hver gang man tror man lige har knækket koden, ændrer algoritmen sig eller man skal gøre tingene på en ny måde.
Så kan man nærmest føle sig slået hjem i ludo.
-
Sociale medier er ikke målet – det er redskabet.
-
Jeg har en sundhedsfaglig baggrund som Health- og Adfærdscoach, der giver mig en dyb forståelse af dig som menneske - fysisk og mentalt.
Jeg er uddannet på Content Marketing-linjen på Den Danske Reklameskole, hvilket gør mig i stand til at bygge en stærk og autentisk brand- og contentstrategi.
Gennem hele mit arbejdsliv har jeg arbejdet koncentreret med salg, salgsledelse og motivation i detailbranchen.
Derfor kender jeg alt til den hverdag og de udfordringer, du står i.
-
Dette forløb er bygget på min tværfaglige baggrund med én mission:At få dig til at ligne hende hér, når du skal arbejde med sociale medier.
 
Billede 1 – Pigen med fregnerne
 
 
Lektion 1.2 Energi – Strategi - Resultat
Jeg er ret sikker på, at du godt ved, at det der med sociale medier virker.og jeg er også sikker på at det føles så uoverskueligt at bare tanken dræber din energi.
 
I forløbet lærer du alt det du har brug for – og jeg har gjort mig umage for at du kan forstå det – uanset hvilket niveau du er på.
I forløbet lærer du ikke kun, hvordan en god social media strategi hænger sammen.
Du lærer selvfølgelig hvordan du gør, hvad for noget udstyr du skal bruge, hvornår og hvor meget og alt det der.
 
Men selv den bedste strategi er fuldstændig værdiløs, hvis du ikke har energien til at følge den.
 
Derfor er forløbet bygget op omkring min model: ENERGI – STRATEGI – RESULTAT.
 
Og det, vi skal
er faktisk meget simpelt.
 
Først skal vi forstå mennesket.
Og derefter skal vi forstå din forretning.
Med afsæt i det – bygger vi en strategi, - der får både dig og din forretning ud gennem skærmen.
-
Undervejs får du redskaber til at lære at forstå dig og din krop bedre, for at blive bevidst om, hvad der faktisk spænder ben for dig i dag.
Strategien skal nemlig passe til den du er i dag, til din hverdag, dine ressourcer og dine kunder.
For det er tydeligt at mærke om du brænder for dit indhold eller ej.
Og når du gør det – kan sociale medier faktisk blive sjovt.
Og når det er en opgave på skal-listen, så kan vi lige så godt se, om vi ikke kan gøre det sjovt.
for når det bliver sjovt for dig, så bliver det også sjovt for din bundlinje.
-
Det her er ikke et quickfix.
Det her er et “nu lærer vi det én gang for alle”-forløb.
 
Sammen vender vi sociale medier fra noget der tager din energi til noget der er sjovt, og giver både dig og din bundlinje ny energi.
Så hvis du er klar, så er jeg også.
 
 
“Du får ikke kun en strategi — du får energien til at følge den.”$x$
where not exists (select 1 from video_opgaver where titel like $x$1.1 %$x$);
update video_opgaver set manus_tekst = $x$Min far tror jeg har lavet et kursus i de sociale medier… men det er ikke helt rigtigt.
Det her forløb handler om at give dig mere energi, få flere kunder i din forretning og skabe en bedre bundlinje.
-
Elsker jeg selv de sociale medier?
Nej.
Hver gang man tror man lige har knækket koden, ændrer algoritmen sig eller man skal gøre tingene på en ny måde.
Så kan man nærmest føle sig slået hjem i ludo.
-
Sociale medier er ikke målet – det er redskabet.
-
Jeg har en sundhedsfaglig baggrund som Health- og Adfærdscoach, der giver mig en dyb forståelse af dig som menneske - fysisk og mentalt.
Jeg er uddannet på Content Marketing-linjen på Den Danske Reklameskole, hvilket gør mig i stand til at bygge en stærk og autentisk brand- og contentstrategi.
Gennem hele mit arbejdsliv har jeg arbejdet koncentreret med salg, salgsledelse og motivation i detailbranchen.
Derfor kender jeg alt til den hverdag og de udfordringer, du står i.
-
Dette forløb er bygget på min tværfaglige baggrund med én mission:At få dig til at ligne hende hér, når du skal arbejde med sociale medier.
 
Billede 1 – Pigen med fregnerne
 
 
Lektion 1.2 Energi – Strategi - Resultat
Jeg er ret sikker på, at du godt ved, at det der med sociale medier virker.og jeg er også sikker på at det føles så uoverskueligt at bare tanken dræber din energi.
 
I forløbet lærer du alt det du har brug for – og jeg har gjort mig umage for at du kan forstå det – uanset hvilket niveau du er på.
I forløbet lærer du ikke kun, hvordan en god social media strategi hænger sammen.
Du lærer selvfølgelig hvordan du gør, hvad for noget udstyr du skal bruge, hvornår og hvor meget og alt det der.
 
Men selv den bedste strategi er fuldstændig værdiløs, hvis du ikke har energien til at følge den.
 
Derfor er forløbet bygget op omkring min model: ENERGI – STRATEGI – RESULTAT.
 
Og det, vi skal
er faktisk meget simpelt.
 
Først skal vi forstå mennesket.
Og derefter skal vi forstå din forretning.
Med afsæt i det – bygger vi en strategi, - der får både dig og din forretning ud gennem skærmen.
-
Undervejs får du redskaber til at lære at forstå dig og din krop bedre, for at blive bevidst om, hvad der faktisk spænder ben for dig i dag.
Strategien skal nemlig passe til den du er i dag, til din hverdag, dine ressourcer og dine kunder.
For det er tydeligt at mærke om du brænder for dit indhold eller ej.
Og når du gør det – kan sociale medier faktisk blive sjovt.
Og når det er en opgave på skal-listen, så kan vi lige så godt se, om vi ikke kan gøre det sjovt.
for når det bliver sjovt for dig, så bliver det også sjovt for din bundlinje.
-
Det her er ikke et quickfix.
Det her er et “nu lærer vi det én gang for alle”-forløb.
 
Sammen vender vi sociale medier fra noget der tager din energi til noget der er sjovt, og giver både dig og din bundlinje ny energi.
Så hvis du er klar, så er jeg også.
 
 
“Du får ikke kun en strategi — du får energien til at følge den.”$x$ where titel like $x$1.1 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$1.2 · Energi – Strategi – Resultat$x$, $x$Modul 1 · Mindset, motivation & retning$x$, $x$KLIPPE-BRIEF · Lektion 1.2 · Energi – Strategi – Resultat
Modul: Modul 1 · Mindset, motivation & retning
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 1-2-energi-strategi-resultat.mp4
Kernen: M1-L2-energi-strategi-resultat-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M1-L2-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M1-L2-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', null
where not exists (select 1 from video_opgaver where titel like $x$1.2 %$x$);

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$1.3 · Ingen standardstrategi her, makker$x$, $x$Modul 1 · Mindset, motivation & retning$x$, $x$KLIPPE-BRIEF · Lektion 1.3 · Ingen standardstrategi her, makker
Modul: Modul 1 · Mindset, motivation & retning
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 1-3-ingen-standardstrategi-her-makker.mp4
Kernen: M1-L3-ingen-standardstrategi-her-makker-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M1-L3-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M1-L3-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Hvis du lige nu tænker: ”Hvilket modul kan jeg spole frem til, for at finde ud af hvilken strategi der er den rigtige for mig?” - så må jeg skuffe dig.
For du kommer ikke til at få nogen standard strategi her. Hvis du vil have det, så kan du bare spørge ChatGPT - og så er du velkommen tilbage om 14 dage, når du igen kan høre dig selv sige: ”Jeg hader de sociale medier” eller ”Jeg har prøvet - det virker ikke” .
Det er ligesom når nogen spørger mig om jeg ikke kan sende et godt træningsprogram.
Det kan jeg sagtens!
Altså efter jeg har lavet en mental screening for at finde ud af hvilke barrierer der spænder ben i dag og hvordan de er opstået og lave en 3 timers fysisk undersøgelse.
SÅ kan jeg lave et RIGTIG godt træningsprogrammen. Men hvordan Søren skulle jeg kunne lave et træningsprogram hvis jeg hverken har set eller undersøgt personen?
For hvis planen ikke passer til dit udgangspunkt, bliver den bare endnu en ting på din to-do-liste, du kan slå dig selv oven i hovedet over, at du ikke fik gjort.
Og det er lige præcis dér, vi ikke skal hen.
 
Vi bygger en strategi der passer til den hverdag og ressourcer du har og lige præcis til det niveau du er på.
Og når du undervejs begynder at kunne se mulighederne, opstår der typisk en ny udfordring:
For lynhurtigt kommer du til at tænke ”Hold da kæft mand, jeg har fuldstændig sovet i bussen” (eller timen) og du kan mærke at du får lyst til at gå direkte i gang fordi du nærmest kan dufte millionerne.
Men lige præcis når du rammer dét punkt, så er det vigtigt for mig at sige til dig: Tanquillo makker! (Slap af)
Se forløbet som en samlevejledning. Det er ikke lige altid, at man lige får læst den helt til ende inden man går i gang…. eller Jeg kan jo kun tale på egne vegne.
Men man fortryder det altså bare altid når man står til sidst og man troede man var i mål, men man må starte forfra.
Det er lige præcis også det vi heller ikke skal bede om.
Så når følelsen kommer, så smil tænk: FEDT - jeg mærker en motivation indeni - og tage så næste modul.$x$
where not exists (select 1 from video_opgaver where titel like $x$1.3 %$x$);
update video_opgaver set manus_tekst = $x$Hvis du lige nu tænker: ”Hvilket modul kan jeg spole frem til, for at finde ud af hvilken strategi der er den rigtige for mig?” - så må jeg skuffe dig.
For du kommer ikke til at få nogen standard strategi her. Hvis du vil have det, så kan du bare spørge ChatGPT - og så er du velkommen tilbage om 14 dage, når du igen kan høre dig selv sige: ”Jeg hader de sociale medier” eller ”Jeg har prøvet - det virker ikke” .
Det er ligesom når nogen spørger mig om jeg ikke kan sende et godt træningsprogram.
Det kan jeg sagtens!
Altså efter jeg har lavet en mental screening for at finde ud af hvilke barrierer der spænder ben i dag og hvordan de er opstået og lave en 3 timers fysisk undersøgelse.
SÅ kan jeg lave et RIGTIG godt træningsprogrammen. Men hvordan Søren skulle jeg kunne lave et træningsprogram hvis jeg hverken har set eller undersøgt personen?
For hvis planen ikke passer til dit udgangspunkt, bliver den bare endnu en ting på din to-do-liste, du kan slå dig selv oven i hovedet over, at du ikke fik gjort.
Og det er lige præcis dér, vi ikke skal hen.
 
Vi bygger en strategi der passer til den hverdag og ressourcer du har og lige præcis til det niveau du er på.
Og når du undervejs begynder at kunne se mulighederne, opstår der typisk en ny udfordring:
For lynhurtigt kommer du til at tænke ”Hold da kæft mand, jeg har fuldstændig sovet i bussen” (eller timen) og du kan mærke at du får lyst til at gå direkte i gang fordi du nærmest kan dufte millionerne.
Men lige præcis når du rammer dét punkt, så er det vigtigt for mig at sige til dig: Tanquillo makker! (Slap af)
Se forløbet som en samlevejledning. Det er ikke lige altid, at man lige får læst den helt til ende inden man går i gang…. eller Jeg kan jo kun tale på egne vegne.
Men man fortryder det altså bare altid når man står til sidst og man troede man var i mål, men man må starte forfra.
Det er lige præcis også det vi heller ikke skal bede om.
Så når følelsen kommer, så smil tænk: FEDT - jeg mærker en motivation indeni - og tage så næste modul.$x$ where titel like $x$1.3 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$1.4 · Godsejeren og stenhuggerne$x$, $x$Modul 1 · Mindset, motivation & retning$x$, $x$KLIPPE-BRIEF · Lektion 1.4 · Godsejeren og stenhuggerne
Modul: Modul 1 · Mindset, motivation & retning
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 1-4-godsejeren-og-stenhuggerne.mp4
Kernen: M1-L4-godsejeren-og-stenhuggerne-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M1-L4-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M1-L4-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Jeg vil gerne vise dig en tegneserie der har fulgt mig i rigtig mange år.
Billede 2 – Godsejeren og stenhuggerne
Her ser du en godsejer. Han går ned ad vejen og på hans højre hånd, møder han en mand der sidder og hugger sten. Godsejeren spørger ham: Min brave mand hvad laver du?
Manden svarer opgivende: ”Jeg hugger sten.”
Godsejeren fortsatte lidt længere ned ad vejen og møder endnu en mand der sidder og hugger sten og spørger ham. ”Min brave mand hvad laver du?” Manden lyser op og svarer: ”Jeg er med til at bygge en katedral.”
Hvem af de her 2 tror I har det fedeste liv?
-
Hvis du minder mest om ham der hugger sten, hver gang du arbejder med de sociale medier, så bebrejder jeg dig ikke.
De færreste jeg kender, startede nemlig deres forretning for at være på de sociale medier. Og hvis du ser med her nu, så har du det måske på samme måde.
Du startede din forretning fordi du brænder for det du laver og fordi du kan noget særligt når mennesker træder ind ad døren hos dig.
Det er faktisk bare præcis den følelse vi skal have ud gennem skærmen på dine sociale medier, for at du i stedet bliver ham der er med til at bygge en katedral.
 
Det her handler ikke om at du skal gøre mere - men du skal lære at gøre det rigtige.
Og bare rolig. Du skal hverken være influencer, fransk klovn eller opfinde flere dybe tallerkener. Du skal bare være dig selv og det lover jeg at hjælpe dig med og blive tryg i.
 
Men hvad er det så der gør at den ene hugger sten mens den anden bygger en katedral?
Det er mindsettet.
Det liv vi lever er resultatet af det vi gør.
Alt vi gør – kommer ud af følelser.
Og alle følelser udspringer af vores tanker.
Så hvis vi gerne vil ændre det resultat, vi har i dag, er vi nødt til at tænke anderledes.
For det virker. Men det kræver, at du er klar til at ændre dine tanker
 
◆ TIL OPTAGELSEN: Lektion 1.5 optages i TO versioner: SD-versionen nedenfor er færdig. TTS-versionen har samme opbygning, men eksemplerne skiftes til selvstændige/kreatører — “din hjemmeside har åbent 24/7, men det er ikke dér, kunderne opdager dig” + genbrugstallerken-videoen (fælles). Samme punchline: “Sociale medier er ikke nice men need. Det er din nye butiksrude.”$x$
where not exists (select 1 from video_opgaver where titel like $x$1.4 %$x$);
update video_opgaver set manus_tekst = $x$Jeg vil gerne vise dig en tegneserie der har fulgt mig i rigtig mange år.
Billede 2 – Godsejeren og stenhuggerne
Her ser du en godsejer. Han går ned ad vejen og på hans højre hånd, møder han en mand der sidder og hugger sten. Godsejeren spørger ham: Min brave mand hvad laver du?
Manden svarer opgivende: ”Jeg hugger sten.”
Godsejeren fortsatte lidt længere ned ad vejen og møder endnu en mand der sidder og hugger sten og spørger ham. ”Min brave mand hvad laver du?” Manden lyser op og svarer: ”Jeg er med til at bygge en katedral.”
Hvem af de her 2 tror I har det fedeste liv?
-
Hvis du minder mest om ham der hugger sten, hver gang du arbejder med de sociale medier, så bebrejder jeg dig ikke.
De færreste jeg kender, startede nemlig deres forretning for at være på de sociale medier. Og hvis du ser med her nu, så har du det måske på samme måde.
Du startede din forretning fordi du brænder for det du laver og fordi du kan noget særligt når mennesker træder ind ad døren hos dig.
Det er faktisk bare præcis den følelse vi skal have ud gennem skærmen på dine sociale medier, for at du i stedet bliver ham der er med til at bygge en katedral.
 
Det her handler ikke om at du skal gøre mere - men du skal lære at gøre det rigtige.
Og bare rolig. Du skal hverken være influencer, fransk klovn eller opfinde flere dybe tallerkener. Du skal bare være dig selv og det lover jeg at hjælpe dig med og blive tryg i.
 
Men hvad er det så der gør at den ene hugger sten mens den anden bygger en katedral?
Det er mindsettet.
Det liv vi lever er resultatet af det vi gør.
Alt vi gør – kommer ud af følelser.
Og alle følelser udspringer af vores tanker.
Så hvis vi gerne vil ændre det resultat, vi har i dag, er vi nødt til at tænke anderledes.
For det virker. Men det kræver, at du er klar til at ændre dine tanker
 
◆ TIL OPTAGELSEN: Lektion 1.5 optages i TO versioner: SD-versionen nedenfor er færdig. TTS-versionen har samme opbygning, men eksemplerne skiftes til selvstændige/kreatører — “din hjemmeside har åbent 24/7, men det er ikke dér, kunderne opdager dig” + genbrugstallerken-videoen (fælles). Samme punchline: “Sociale medier er ikke nice men need. Det er din nye butiksrude.”$x$ where titel like $x$1.4 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$1.5 · Købsadfærden i dag$x$, $x$Modul 1 · Mindset, motivation & retning$x$, $x$KLIPPE-BRIEF · Lektion 1.5 · Købsadfærden i dag
Modul: Modul 1 · Mindset, motivation & retning
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 1-5-koebsadfaerden-i-dag.mp4
Kernen: M1-L5-koebsadfaerden-i-dag-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M1-L5-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M1-L5-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Som jeg startede med at sige – så skal vi kigge på den virkelighed vi har lige nu inden vi går i gang med at bygge strategien.
Og det her er virkeligheden for danskernes købsadfærd lige nu:
Din fysiske forretning har åbent ca. 42 timer om ugen. Dine sociale medier har åbent 168.
Nu ved jeg ikke hvordan det er der hvor du bor. Men her i Ringkøbing der kan det cirka tælles på en hånd hvor mange man møder på en aftenvandring når man er ude i gågaden og kigge på butiksvinduer.
Men … der er godt nyt!
Din forretning fejler nemlig ikke en skid. Det gør dit brandmix, din beliggenhed eller din evne til at drive forretning heller ikke.
Men ligesom du og jeg har ændret os, har verden og kundernes adfærd også ændret sig.
Og for at forstå fremtidens kunde er vi nødt til at forstå fremtidens menneske. For din kunde er bare et helt almindeligt menneske.
Og vi er pressede.
Danskerne er mere pressede end nogensinde. Hver tredje voksne dansker scorer højt på stressskalaen. Vi bliver bombarderet med indtryk og bruger mere og mere tid online.
Det her er ikke et sundhedsafsnit. Men det er vigtigt at forstå, at når vi som mennesker er pressede og overstimulerede, søger vi det nære og det trygge.
Det har betydning for, hvordan du skal møde dine kunder og kommunikere med dem.
Lad mig lige vise dig en video, der har fået over én million visninger.
 
Video 1- Genbrugstallerkener
I videoen ser vi altså at man kan sætte en glastallerken fra genbrug under sine potteplanter. 1 million visninger venner. Det er der vi er.
I Danmark er der over 2,7 mio. aktive på Instagram… Hvor meget tror du vi i gennemsnit scroller i løbet af en dag?
= Over 90 meter.
Det svarer til en tur op ad Frihedsgudinden - inklusiv sokkel.
Nu tænker du måske: ”jamen så køber de jo bare det hele på boozt eller zalando!”
Men nææh - det gør de faktisk ikke.
81% køber i en fysisk forretning efter at have fundet produktet på de sociale medier først og 40% bruger de sociale medier inden de bruger Google til at finde ting de mangler.
Trafikken er ikke forsvundet. Tværtimod. Den har bare flyttet sig.
Så selvom rekordmange butikslokaler står tomme i Danmark lige nu. Så er købelysten ikke væk.
Frit efter Darwin: "Det er hverken de stærkeste eller de rigeste der overlever, men dem der er mest omstillingsparate."
Så hvis du oplever, at der ikke kommer lige så mange kunder ind ad din dør som du godt kunne tænke dig – så kan det være du ikke er synlig nok der hvor de er.
Hvis du bliver ved med at kæmpe imod den udvikling, dine kunder allerede er en del af, bliver det sværere og sværere at drive den forretning, du gerne vil have.
Men det fede ved det her, det er nemlig, at det er slet ikke så svært når du først har fået det lært. Og dét her, det er noget du kan tage kontrollen over og ændre det resultat du har i dag.
Og det er det vi skal sammen.
Sociale medier er ikke nice men need!
Det er din nye butiksrude. Der hvor du skaber behovet for produktet og relationen som afgør om kunden køber produktet i din forretning.$x$
where not exists (select 1 from video_opgaver where titel like $x$1.5 %$x$);
update video_opgaver set manus_tekst = $x$Som jeg startede med at sige – så skal vi kigge på den virkelighed vi har lige nu inden vi går i gang med at bygge strategien.
Og det her er virkeligheden for danskernes købsadfærd lige nu:
Din fysiske forretning har åbent ca. 42 timer om ugen. Dine sociale medier har åbent 168.
Nu ved jeg ikke hvordan det er der hvor du bor. Men her i Ringkøbing der kan det cirka tælles på en hånd hvor mange man møder på en aftenvandring når man er ude i gågaden og kigge på butiksvinduer.
Men … der er godt nyt!
Din forretning fejler nemlig ikke en skid. Det gør dit brandmix, din beliggenhed eller din evne til at drive forretning heller ikke.
Men ligesom du og jeg har ændret os, har verden og kundernes adfærd også ændret sig.
Og for at forstå fremtidens kunde er vi nødt til at forstå fremtidens menneske. For din kunde er bare et helt almindeligt menneske.
Og vi er pressede.
Danskerne er mere pressede end nogensinde. Hver tredje voksne dansker scorer højt på stressskalaen. Vi bliver bombarderet med indtryk og bruger mere og mere tid online.
Det her er ikke et sundhedsafsnit. Men det er vigtigt at forstå, at når vi som mennesker er pressede og overstimulerede, søger vi det nære og det trygge.
Det har betydning for, hvordan du skal møde dine kunder og kommunikere med dem.
Lad mig lige vise dig en video, der har fået over én million visninger.
 
Video 1- Genbrugstallerkener
I videoen ser vi altså at man kan sætte en glastallerken fra genbrug under sine potteplanter. 1 million visninger venner. Det er der vi er.
I Danmark er der over 2,7 mio. aktive på Instagram… Hvor meget tror du vi i gennemsnit scroller i løbet af en dag?
= Over 90 meter.
Det svarer til en tur op ad Frihedsgudinden - inklusiv sokkel.
Nu tænker du måske: ”jamen så køber de jo bare det hele på boozt eller zalando!”
Men nææh - det gør de faktisk ikke.
81% køber i en fysisk forretning efter at have fundet produktet på de sociale medier først og 40% bruger de sociale medier inden de bruger Google til at finde ting de mangler.
Trafikken er ikke forsvundet. Tværtimod. Den har bare flyttet sig.
Så selvom rekordmange butikslokaler står tomme i Danmark lige nu. Så er købelysten ikke væk.
Frit efter Darwin: "Det er hverken de stærkeste eller de rigeste der overlever, men dem der er mest omstillingsparate."
Så hvis du oplever, at der ikke kommer lige så mange kunder ind ad din dør som du godt kunne tænke dig – så kan det være du ikke er synlig nok der hvor de er.
Hvis du bliver ved med at kæmpe imod den udvikling, dine kunder allerede er en del af, bliver det sværere og sværere at drive den forretning, du gerne vil have.
Men det fede ved det her, det er nemlig, at det er slet ikke så svært når du først har fået det lært. Og dét her, det er noget du kan tage kontrollen over og ændre det resultat du har i dag.
Og det er det vi skal sammen.
Sociale medier er ikke nice men need!
Det er din nye butiksrude. Der hvor du skaber behovet for produktet og relationen som afgør om kunden køber produktet i din forretning.$x$ where titel like $x$1.5 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$1.6 · Tennisbanen$x$, $x$Modul 1 · Mindset, motivation & retning$x$, $x$KLIPPE-BRIEF · Lektion 1.6 · Tennisbanen
Modul: Modul 1 · Mindset, motivation & retning
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 1-6-tennisbanen.mp4
Kernen: M1-L6-tennisbanen-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M1-L6-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M1-L6-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Jeg vil gerne vise dig et billede som har ændret hele min forståelse for den følelse når man har alle ideerne man ved hvad man skal gøre og alligevel sker der bare ingenting.
BILLEDE 3 – Tennisbanen
Her kan du se 2 der spiller tennis. Og hvis du ikke ved det, så for at få point i en serv, så skal bolden ramme i det første diagonale felt på modstanderens bane.
Her har man altså alle forudsætningerne for og få en god tenniskamp med en vinder og en taber, man ved hvornår kampen er slut og du kan endda måle på samtlige serve og tjekke performance.
 
 
Forestil dig så, at nogen kommer og fjerner stregerne på banen…
Vi kan stadig godt spille tennis, men det bliver på lidt mere hygge niveau og svært at måle på.
Forestil dig så, at nogen kommer og fjerner nettet.
Så kan vi stå der… med vores bold og ketcher og bruge tiden på at snakke om hvor vi skal skyde bolden hen, og ofte så resulterer denne situation i at man overhovedet ikke får skudt den nogen steder hen.
Derfor - så er det så vigtigt at vi får skabt stregerne på banen og det gør vi lige om lidt når vi skal have bygget din strategi.
For er du overhovedet klar over, hvor dyrt det er at spille hyggetennis?
Altså når vi bare poster på de sociale medier uden retning og en rød tråd bare håber det bliver godt?…og måske i virkeligheden poster mere for vores samvittigheds skyld frem for rent faktisk interessere os for om vi får noget ud af den tid vi har brugt på det.
Hvis du driver en forretning i dag, så føler jeg mig ret overbevist om, at du faktisk har mange gode ideer.
Derfor er min mission at give dig redskaberne til at de også bliver til noget. Så vi ikke havner i statistikken der fortæller at 75 % af content creators oplever stress eller angst (kilden er på plads: Tasty Edits via Spiralytics, 2025 — står i kildelisten).
For det, der stresser os, er ofte alt det, vi går rundt og føler, vi burde, kunne, skulle.$x$
where not exists (select 1 from video_opgaver where titel like $x$1.6 %$x$);
update video_opgaver set manus_tekst = $x$Jeg vil gerne vise dig et billede som har ændret hele min forståelse for den følelse når man har alle ideerne man ved hvad man skal gøre og alligevel sker der bare ingenting.
BILLEDE 3 – Tennisbanen
Her kan du se 2 der spiller tennis. Og hvis du ikke ved det, så for at få point i en serv, så skal bolden ramme i det første diagonale felt på modstanderens bane.
Her har man altså alle forudsætningerne for og få en god tenniskamp med en vinder og en taber, man ved hvornår kampen er slut og du kan endda måle på samtlige serve og tjekke performance.
 
 
Forestil dig så, at nogen kommer og fjerner stregerne på banen…
Vi kan stadig godt spille tennis, men det bliver på lidt mere hygge niveau og svært at måle på.
Forestil dig så, at nogen kommer og fjerner nettet.
Så kan vi stå der… med vores bold og ketcher og bruge tiden på at snakke om hvor vi skal skyde bolden hen, og ofte så resulterer denne situation i at man overhovedet ikke får skudt den nogen steder hen.
Derfor - så er det så vigtigt at vi får skabt stregerne på banen og det gør vi lige om lidt når vi skal have bygget din strategi.
For er du overhovedet klar over, hvor dyrt det er at spille hyggetennis?
Altså når vi bare poster på de sociale medier uden retning og en rød tråd bare håber det bliver godt?…og måske i virkeligheden poster mere for vores samvittigheds skyld frem for rent faktisk interessere os for om vi får noget ud af den tid vi har brugt på det.
Hvis du driver en forretning i dag, så føler jeg mig ret overbevist om, at du faktisk har mange gode ideer.
Derfor er min mission at give dig redskaberne til at de også bliver til noget. Så vi ikke havner i statistikken der fortæller at 75 % af content creators oplever stress eller angst (kilden er på plads: Tasty Edits via Spiralytics, 2025 — står i kildelisten).
For det, der stresser os, er ofte alt det, vi går rundt og føler, vi burde, kunne, skulle.$x$ where titel like $x$1.6 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$1.7 · Opsummering$x$, $x$Modul 1 · Mindset, motivation & retning$x$, $x$KLIPPE-BRIEF · Lektion 1.7 · Opsummering
Modul: Modul 1 · Mindset, motivation & retning
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 1-7-opsummering.mp4
Kernen: M1-L7-opsummering-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M1-L7-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M1-L7-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Vi skal altså sikre os, at den strategi, vi bygger, stemmer overens med den, du er i dag.
Ikke den, du var engang.
Men den, du er nu.
På samme måde skal vi sikre os, at alt det, vi laver, er målrettet den kunde, du gerne vil have ind ad døren.
Ikke nødvendigvis kun den kunde, der handler hos dig i dag.
Men også den kunde, du gerne vil tiltrække fremover.
Og sidst, men ikke mindst, skal vi forstå de sociale medier, som de ser ud i dag.
Hvordan bruger din målgruppe dem?
Hvad reagerer de på?
Og hvordan ser danskernes købsadfærd ud lige nu?
For hvis vi bygger en strategi på en gammel version af dig, en gammel version af din kunde eller en gammel version af de sociale medier, så bygger vi på et fundament, der ikke længere passer.
Og vi kan ikke bygge fremtiden på en gammel version af virkeligheden.
Det er derfor, vi i de næste moduler skal arbejde med tre ting:
Dig.
Din forretning.
Og din energi.
Men før vi bygger strategien, skal vi starte med at forstå mennesket bag den.
Dig.$x$
where not exists (select 1 from video_opgaver where titel like $x$1.7 %$x$);
update video_opgaver set manus_tekst = $x$Vi skal altså sikre os, at den strategi, vi bygger, stemmer overens med den, du er i dag.
Ikke den, du var engang.
Men den, du er nu.
På samme måde skal vi sikre os, at alt det, vi laver, er målrettet den kunde, du gerne vil have ind ad døren.
Ikke nødvendigvis kun den kunde, der handler hos dig i dag.
Men også den kunde, du gerne vil tiltrække fremover.
Og sidst, men ikke mindst, skal vi forstå de sociale medier, som de ser ud i dag.
Hvordan bruger din målgruppe dem?
Hvad reagerer de på?
Og hvordan ser danskernes købsadfærd ud lige nu?
For hvis vi bygger en strategi på en gammel version af dig, en gammel version af din kunde eller en gammel version af de sociale medier, så bygger vi på et fundament, der ikke længere passer.
Og vi kan ikke bygge fremtiden på en gammel version af virkeligheden.
Det er derfor, vi i de næste moduler skal arbejde med tre ting:
Dig.
Din forretning.
Og din energi.
Men før vi bygger strategien, skal vi starte med at forstå mennesket bag den.
Dig.$x$ where titel like $x$1.7 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$2.1 · Mennesket bag forretningen$x$, $x$Modul 2 · Mennesket$x$, $x$KLIPPE-BRIEF · Lektion 2.1 · Mennesket bag forretningen
Modul: Modul 2 · Mennesket
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 2-1-mennesket-bag-forretningen.mp4
Kernen: M2-L1-mennesket-bag-forretningen-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M2-L1-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M2-L1-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Hvis du nogle gange oplever, at komme hjem med en to-do liste der er længere end da du startede - så er du ikke uduelig eller doven. Du er bare en helt almindelig dansker.
Næsten hver tredje dansker scorer højt på stressskalaen.
Og når vi er pressede, bliver det sværere at koncentrere sig, holde fokus og få gjort det, vi godt ved, vi burde gøre.
Så begynder det at regne med undskyldninger. Og ofte så bliver de ting vi synes er uoverskuelige skubbet bagerst i køen.
Og hvis du ikke har styr på de sociale medier – så kan du sikkert kende, at det er en af de opgaver der ikke bliver prioriteret.
Men det er ikke sikkert, at det er hele forklaringen.
Måske er der andre barrierer.
Derfor skal vi i dette modul lære mennesket bedre at kende.
Og vi starter med dig der er mennesket bag forretningen.
Før vi kan bygge en strategi, bliver vi nødt til at forstå mennesket bag den.
Dig.
Og hvis du ser med nu men ikke er mennesket der ejer eller driver virksomheden i dag – så er dette modul baseret på denne person.
Så hvis det ikke er dig – skal du se om du kan få personen til at deltage i dette modul – specielt opgaverne.$x$
where not exists (select 1 from video_opgaver where titel like $x$2.1 %$x$);
update video_opgaver set manus_tekst = $x$Hvis du nogle gange oplever, at komme hjem med en to-do liste der er længere end da du startede - så er du ikke uduelig eller doven. Du er bare en helt almindelig dansker.
Næsten hver tredje dansker scorer højt på stressskalaen.
Og når vi er pressede, bliver det sværere at koncentrere sig, holde fokus og få gjort det, vi godt ved, vi burde gøre.
Så begynder det at regne med undskyldninger. Og ofte så bliver de ting vi synes er uoverskuelige skubbet bagerst i køen.
Og hvis du ikke har styr på de sociale medier – så kan du sikkert kende, at det er en af de opgaver der ikke bliver prioriteret.
Men det er ikke sikkert, at det er hele forklaringen.
Måske er der andre barrierer.
Derfor skal vi i dette modul lære mennesket bedre at kende.
Og vi starter med dig der er mennesket bag forretningen.
Før vi kan bygge en strategi, bliver vi nødt til at forstå mennesket bag den.
Dig.
Og hvis du ser med nu men ikke er mennesket der ejer eller driver virksomheden i dag – så er dette modul baseret på denne person.
Så hvis det ikke er dig – skal du se om du kan få personen til at deltage i dette modul – specielt opgaverne.$x$ where titel like $x$2.1 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$2.2 · Hvem er du?$x$, $x$Modul 2 · Mennesket$x$, $x$KLIPPE-BRIEF · Lektion 2.2 · Hvem er du?
Modul: Modul 2 · Mennesket
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 2-2-hvem-er-du.mp4
Kernen: M2-L2-hvem-er-du-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M2-L2-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M2-L2-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Vi starter med et spørgsmål, der måske lyder meget simpelt:
Hvem er du?
Men jeg mener ikke:
• Hvad hedder du?
• Hvor gammel er du?
• Hvad arbejder du med?
• Hvor bor du?
• Eller hvem er du gift med og forælder til?
Jeg mener:
Hvem er du, når vi fjerner alle de titler og funktioner, du normalt bruger til at beskrive dig selv?
For mange af os er blevet virkelig gode til at fortælle, hvad vi laver.
Men det er ikke nødvendigvis det samme som at vide, hvem vi er.
Og hvis vi ikke selv er bevidste om, hvem vi er, bliver det svært at bygge en forretning og en strategi, der stemmer overens med os.
Så find øvelsen frem i appen – for dette er din første opgave.
Du skal beskrive hvem du er, uden at nævne:
• Dit navn.
• Din alder.
• Din funktion.
• Din uddannelse.
• Din civilstatus.
• Hvor du bor.
• Eller hvem du er forælder til.
Tænk i stedet over:
• Hvilke egenskaber kendetegner dig?
• Hvad betyder noget for dig?
• Hvad kommer naturligt til dig?
• Og hvordan ville de mennesker, der kender dig bedst, beskrive dig?
Det er ikke sikkert, at svaret kommer med det samme.
Men prøv.
Og hvis det stadig er svært, så prøv at tænke på hvordan dem du har tæt på, vil beskrive dig.
-Når du har beskrevet, hvem du er, skal du kigge på den udvikling, du selv og din forretning har været igennem.
For du er ikke nødvendigvis den samme person, som da du startede din forretning.
Du har fået flere erfaringer.
Du har lært noget undervejs.
Og måske ønsker du noget andet af din forretning i dag, end du gjorde dengang.
Derfor skal du i opgave 1.b skrive historien om dig og din forretning som et eventyr.
Fra den version af dig, der startede rejsen, til den version af dig, der står her i dag.$x$
where not exists (select 1 from video_opgaver where titel like $x$2.2 %$x$);
update video_opgaver set manus_tekst = $x$Vi starter med et spørgsmål, der måske lyder meget simpelt:
Hvem er du?
Men jeg mener ikke:
• Hvad hedder du?
• Hvor gammel er du?
• Hvad arbejder du med?
• Hvor bor du?
• Eller hvem er du gift med og forælder til?
Jeg mener:
Hvem er du, når vi fjerner alle de titler og funktioner, du normalt bruger til at beskrive dig selv?
For mange af os er blevet virkelig gode til at fortælle, hvad vi laver.
Men det er ikke nødvendigvis det samme som at vide, hvem vi er.
Og hvis vi ikke selv er bevidste om, hvem vi er, bliver det svært at bygge en forretning og en strategi, der stemmer overens med os.
Så find øvelsen frem i appen – for dette er din første opgave.
Du skal beskrive hvem du er, uden at nævne:
• Dit navn.
• Din alder.
• Din funktion.
• Din uddannelse.
• Din civilstatus.
• Hvor du bor.
• Eller hvem du er forælder til.
Tænk i stedet over:
• Hvilke egenskaber kendetegner dig?
• Hvad betyder noget for dig?
• Hvad kommer naturligt til dig?
• Og hvordan ville de mennesker, der kender dig bedst, beskrive dig?
Det er ikke sikkert, at svaret kommer med det samme.
Men prøv.
Og hvis det stadig er svært, så prøv at tænke på hvordan dem du har tæt på, vil beskrive dig.
-Når du har beskrevet, hvem du er, skal du kigge på den udvikling, du selv og din forretning har været igennem.
For du er ikke nødvendigvis den samme person, som da du startede din forretning.
Du har fået flere erfaringer.
Du har lært noget undervejs.
Og måske ønsker du noget andet af din forretning i dag, end du gjorde dengang.
Derfor skal du i opgave 1.b skrive historien om dig og din forretning som et eventyr.
Fra den version af dig, der startede rejsen, til den version af dig, der står her i dag.$x$ where titel like $x$2.2 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$2.3 · Hvad gør dig egentlig glad?$x$, $x$Modul 2 · Mennesket$x$, $x$KLIPPE-BRIEF · Lektion 2.3 · Hvad gør dig egentlig glad?
Modul: Modul 2 · Mennesket
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 2-3-hvad-goer-dig-egentlig-glad.mp4
Kernen: M2-L3-hvad-goer-dig-egentlig-glad-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M2-L3-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M2-L3-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Vi har lige arbejdet med, hvem du er.
Nu skal vi kigge på noget andet vigtigt og helt grundlæggende:
Hvad gør dig egentlig glad?
Det kan måske også lyde som et nemt spørgsmål.
Men mange af os er blevet så vant til at løse opgaver, tage ansvar og få hverdagen til at hænge sammen, at vi næsten har glemt at lægge mærke til, hvad der faktisk giver os energi.
Og hvis vi ikke ved, hvad der gør os glade, bliver det svært at gøre mere af det.
Nu skal du begynde at få øje på, hvad der løfter dig, hvor meget plads det får i din hverdag i dag, og hvad du gerne vil give mere plads fremover.
Gå videre til opgave 2 i appen, og find ud af, hvad der egentlig gør dig glad.$x$
where not exists (select 1 from video_opgaver where titel like $x$2.3 %$x$);
update video_opgaver set manus_tekst = $x$Vi har lige arbejdet med, hvem du er.
Nu skal vi kigge på noget andet vigtigt og helt grundlæggende:
Hvad gør dig egentlig glad?
Det kan måske også lyde som et nemt spørgsmål.
Men mange af os er blevet så vant til at løse opgaver, tage ansvar og få hverdagen til at hænge sammen, at vi næsten har glemt at lægge mærke til, hvad der faktisk giver os energi.
Og hvis vi ikke ved, hvad der gør os glade, bliver det svært at gøre mere af det.
Nu skal du begynde at få øje på, hvad der løfter dig, hvor meget plads det får i din hverdag i dag, og hvad du gerne vil give mere plads fremover.
Gå videre til opgave 2 i appen, og find ud af, hvad der egentlig gør dig glad.$x$ where titel like $x$2.3 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$2.4 · Shinebarometeret$x$, $x$Modul 2 · Mennesket$x$, $x$KLIPPE-BRIEF · Lektion 2.4 · Shinebarometeret
Modul: Modul 2 · Mennesket
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 2-4-shinebarometeret.mp4
Kernen: M2-L4-shinebarometeret-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M2-L4-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M2-L4-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Nu ved du forhåbentlig lidt mere om, hvad der gør dig glad, og hvad du godt kunne tænke dig, der fyldte mere i din hverdag.
Men måske tænker du allerede:
“Det er alt sammen meget fint, Ida. Men hvornår skulle jeg have tid til det?”
Det kan nemt føles, som om tiden er problemet.
Men ofte handler det ikke kun om tid.
Det handler også om energi og overskud.
Eller mangel på samme.
For du kan godt have en ledig time og stadig ikke have energien til at bruge den på noget af det, der står på din liste.
Lad mig give dig et eksempel fra mit eget liv.
Da jeg boede i Aarhus, var jeg instruktør i et fitnesscenter, og hver lørdag klokken 9 havde jeg mit faste HIIT-hold.
For dig, der ikke ved, hvad det er, så er det 60 minutters intensiv træning i en kælder med høj musik og mig, der går rundt med en mikrofon og pacer eller råber af folk.
Jeg ELSKEDE det.
Men på den ene time fik jeg fyret mere energi af, end jeg havde til en hel weekend.
Og her kom udfordringen.
Når jeg nu alligevel var nede i fitnesscenteret, kunne jeg jo lige så godt selv få trænet bagefter.
Men efter den afsluttede HIIT-time, altså efter min performance, sad jeg der i sofaen og kæmpede for overhovedet at gå i gang.
Lørdag efter lørdag endte jeg med at cykle hjem uden at have fået trænet.
Og jeg følte mig uduelig.
Som straf gik jeg over og købte bland selv-slik og brugte resten af dagen på at slå mig selv oven i hovedet.
Indtil jeg blev bevidst om noget ret vigtigt.
Efter en arbejdsuge på over 60 timer havde jeg brugt den sidste energi på HIIT-holdet og skudt den afsted med konfetti.
Hvordan skulle jeg så kunne forvente, at jeg også kunne træne bagefter?
Og selv hvis jeg havde tvunget mig selv igennem det, havde jeg sandsynligvis ikke fået ret meget ud af træningen.
Da jeg blev bevidst om, at min forventning til mig selv var fuldstændig urealistisk, kunne jeg ændre planen.
Jeg kunne enten træne inden mit hold.
Eller vælge en anden dag.
Det var ikke disciplin, jeg manglede.
Min forventning passede bare ikke til den energi, jeg havde til rådighed.
For at hjælpe dig med at blive mere bevidst om din egen energi vil jeg nu præsentere dig for et redskab, jeg kalder Shinebarometeret.
Shinebarometeret skal hjælpe dig med at blive mere realistisk omkring, hvad du forventer af dig selv og din to-do-liste.
For vores forventninger til os selv er ofte baseret på den version af os, der ligger på en 10’er på Shinebarometeret.
Men hvis vi i virkeligheden ligger på en 3’er på grund af alt muligt i livet, er det ikke særlig fair at forvente det samme af os selv.
Så ender vi med at bruge energi, vi slet ikke har, på at slå os selv endnu mere oven i hovedet.
Shinebarometeret er et redskab, der hjælper dig med at blive bevidst om sammenhængen mellem din energi og din adfærd.
Det handler ikke om, at vi altid skal ligge på en 10’er.
Det handler om, at vi skal lære vores energi at kende, så vi kan tilpasse vores dag, vores gøremål og vores forventninger til det sted, vi faktisk befinder os.
Din energi påvirker blandt andet:
• Hvilket tøj du har lyst til at tage på• Hvilken mad du spiser• Måden, du taler til dig selv på• Hvordan du sover• Om du holder pauser• Hvor meget du har lyst til at være sammen med andre• Om du har adgang til din kreativitet og kan fordybe dig• Hvordan du arbejder• Hvordan du møder din arbejdsdag
Nogle dage har du energi, idéer og lyst til at bidrage.
Andre dage har du mest lyst til at gemme dig og bare komme igennem det nødvendige.
Det betyder ikke, at der er noget galt med dig.
Det betyder bare, at din energi ændrer sig — og at den kan genkendes i din adfærd.
Derfor skal du nu lave dit eget Shinebarometer.
En skala fra 1 til 10, hvor:
1 er den version af dig, der helst vil blive under dynen.
Og 10 er den version af dig, der overvejer at lave en Reel, mens du synger og danser.
Din opgave er ikke kun at beskrive, hvordan du har det på 1 og 10.
Du skal beskrive, hvordan du genkender din egen adfærd.
• Hvordan ser du ud?
• Hvordan tænker du?
• Hvordan taler du til dig selv?
• Hvad gør du?
• Hvad undgår du?
• Hvordan arbejder du?
• Hvordan er du sammen med andre?
• Hvordan er din søvn, din mad, dine pauser og din lyst til at skabe noget?
Målet er ikke, at du skal være på 10 hele tiden.
Shinebarometeret er ikke en præstationsskala.
Det måler ikke din værdi.
Og tallet er ikke din identitet.
Men det er et øjebliksbillede af, hvor du befinder dig lige nu.
Og her er noget vigtigt: 10 er ikke målet. 10 er bare den ene ende af dit eget barometer.
Du kan sagtens træffe en bedre beslutning på en 4’er end på en 10’er.
Vi bruger ikke barometeret til at jagte et tal. Vi bruger det til at genkende os selv.
Så du skal ikke bruge Shinebarometeret til at ændre, hvor du er. Du skal først bruge det til at opdage, hvor du er.
-
Målet er, at du bliver bedre til at genkende dine egne signaler.
For ofte opdager vi først, at energien er lav, når vi allerede er i underskud.
-
Men vores adfærd begynder ofte at ændre sig langt tidligere.
Og jo tidligere du opdager det, jo bedre kan du vurdere, hvad du har brug for, og hvad der er realistisk at kræve af dig selv den dag.
•
Gå videre til opgave 3 i appen, og lav dit eget Shinebarometer.
Senere i forløbet introducerer jeg dig for Energibanken. Men først skal vi i næste modul forstå, hvorfor du er, som du er.
Shinebarometeret hjælper dig med at se, hvor du befinder dig.
Energibanken skal hjælpe dig med at forstå, hvad der har bragt dig derhen, hvad der tager din energi, og hvad der giver den tilbage.$x$
where not exists (select 1 from video_opgaver where titel like $x$2.4 %$x$);
update video_opgaver set manus_tekst = $x$Nu ved du forhåbentlig lidt mere om, hvad der gør dig glad, og hvad du godt kunne tænke dig, der fyldte mere i din hverdag.
Men måske tænker du allerede:
“Det er alt sammen meget fint, Ida. Men hvornår skulle jeg have tid til det?”
Det kan nemt føles, som om tiden er problemet.
Men ofte handler det ikke kun om tid.
Det handler også om energi og overskud.
Eller mangel på samme.
For du kan godt have en ledig time og stadig ikke have energien til at bruge den på noget af det, der står på din liste.
Lad mig give dig et eksempel fra mit eget liv.
Da jeg boede i Aarhus, var jeg instruktør i et fitnesscenter, og hver lørdag klokken 9 havde jeg mit faste HIIT-hold.
For dig, der ikke ved, hvad det er, så er det 60 minutters intensiv træning i en kælder med høj musik og mig, der går rundt med en mikrofon og pacer eller råber af folk.
Jeg ELSKEDE det.
Men på den ene time fik jeg fyret mere energi af, end jeg havde til en hel weekend.
Og her kom udfordringen.
Når jeg nu alligevel var nede i fitnesscenteret, kunne jeg jo lige så godt selv få trænet bagefter.
Men efter den afsluttede HIIT-time, altså efter min performance, sad jeg der i sofaen og kæmpede for overhovedet at gå i gang.
Lørdag efter lørdag endte jeg med at cykle hjem uden at have fået trænet.
Og jeg følte mig uduelig.
Som straf gik jeg over og købte bland selv-slik og brugte resten af dagen på at slå mig selv oven i hovedet.
Indtil jeg blev bevidst om noget ret vigtigt.
Efter en arbejdsuge på over 60 timer havde jeg brugt den sidste energi på HIIT-holdet og skudt den afsted med konfetti.
Hvordan skulle jeg så kunne forvente, at jeg også kunne træne bagefter?
Og selv hvis jeg havde tvunget mig selv igennem det, havde jeg sandsynligvis ikke fået ret meget ud af træningen.
Da jeg blev bevidst om, at min forventning til mig selv var fuldstændig urealistisk, kunne jeg ændre planen.
Jeg kunne enten træne inden mit hold.
Eller vælge en anden dag.
Det var ikke disciplin, jeg manglede.
Min forventning passede bare ikke til den energi, jeg havde til rådighed.
For at hjælpe dig med at blive mere bevidst om din egen energi vil jeg nu præsentere dig for et redskab, jeg kalder Shinebarometeret.
Shinebarometeret skal hjælpe dig med at blive mere realistisk omkring, hvad du forventer af dig selv og din to-do-liste.
For vores forventninger til os selv er ofte baseret på den version af os, der ligger på en 10’er på Shinebarometeret.
Men hvis vi i virkeligheden ligger på en 3’er på grund af alt muligt i livet, er det ikke særlig fair at forvente det samme af os selv.
Så ender vi med at bruge energi, vi slet ikke har, på at slå os selv endnu mere oven i hovedet.
Shinebarometeret er et redskab, der hjælper dig med at blive bevidst om sammenhængen mellem din energi og din adfærd.
Det handler ikke om, at vi altid skal ligge på en 10’er.
Det handler om, at vi skal lære vores energi at kende, så vi kan tilpasse vores dag, vores gøremål og vores forventninger til det sted, vi faktisk befinder os.
Din energi påvirker blandt andet:
• Hvilket tøj du har lyst til at tage på• Hvilken mad du spiser• Måden, du taler til dig selv på• Hvordan du sover• Om du holder pauser• Hvor meget du har lyst til at være sammen med andre• Om du har adgang til din kreativitet og kan fordybe dig• Hvordan du arbejder• Hvordan du møder din arbejdsdag
Nogle dage har du energi, idéer og lyst til at bidrage.
Andre dage har du mest lyst til at gemme dig og bare komme igennem det nødvendige.
Det betyder ikke, at der er noget galt med dig.
Det betyder bare, at din energi ændrer sig — og at den kan genkendes i din adfærd.
Derfor skal du nu lave dit eget Shinebarometer.
En skala fra 1 til 10, hvor:
1 er den version af dig, der helst vil blive under dynen.
Og 10 er den version af dig, der overvejer at lave en Reel, mens du synger og danser.
Din opgave er ikke kun at beskrive, hvordan du har det på 1 og 10.
Du skal beskrive, hvordan du genkender din egen adfærd.
• Hvordan ser du ud?
• Hvordan tænker du?
• Hvordan taler du til dig selv?
• Hvad gør du?
• Hvad undgår du?
• Hvordan arbejder du?
• Hvordan er du sammen med andre?
• Hvordan er din søvn, din mad, dine pauser og din lyst til at skabe noget?
Målet er ikke, at du skal være på 10 hele tiden.
Shinebarometeret er ikke en præstationsskala.
Det måler ikke din værdi.
Og tallet er ikke din identitet.
Men det er et øjebliksbillede af, hvor du befinder dig lige nu.
Og her er noget vigtigt: 10 er ikke målet. 10 er bare den ene ende af dit eget barometer.
Du kan sagtens træffe en bedre beslutning på en 4’er end på en 10’er.
Vi bruger ikke barometeret til at jagte et tal. Vi bruger det til at genkende os selv.
Så du skal ikke bruge Shinebarometeret til at ændre, hvor du er. Du skal først bruge det til at opdage, hvor du er.
-
Målet er, at du bliver bedre til at genkende dine egne signaler.
For ofte opdager vi først, at energien er lav, når vi allerede er i underskud.
-
Men vores adfærd begynder ofte at ændre sig langt tidligere.
Og jo tidligere du opdager det, jo bedre kan du vurdere, hvad du har brug for, og hvad der er realistisk at kræve af dig selv den dag.
•
Gå videre til opgave 3 i appen, og lav dit eget Shinebarometer.
Senere i forløbet introducerer jeg dig for Energibanken. Men først skal vi i næste modul forstå, hvorfor du er, som du er.
Shinebarometeret hjælper dig med at se, hvor du befinder dig.
Energibanken skal hjælpe dig med at forstå, hvad der har bragt dig derhen, hvad der tager din energi, og hvad der giver den tilbage.$x$ where titel like $x$2.4 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$3.1 · Intet er tilfældigt$x$, $x$Modul 3 · Hvorfor er du, som du er$x$, $x$KLIPPE-BRIEF · Lektion 3.1 · Intet er tilfældigt
Modul: Modul 3 · Hvorfor er du, som du er
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 3-1-intet-er-tilfaeldigt.mp4
Kernen: M3-L1-intet-er-tilfaeldigt-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M3-L1-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M3-L1-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Nu har du arbejdet med, hvem du er.
Du har kigget på din historie.
På det, der gør dig glad.
Og på hvordan din energi kommer til udtryk gennem din adfærd på Shinebarometeret.
Nu skal vi et lag dybere.
-
For måske ved du nogle gange godt, at du burde sige fra.
Lægge telefonen, få postet mere på sociale medier eller bede om hjælp.
Men alligevel så sker det ikke.
-
Så kan vi bruge en masse energi på at gå og tænke “Hvorfor kan jeg ikke bare tage mig sammen?” For jeg ved jo udmærket hvad jeg skal gøre.
-
Det er dét du lærer at ændre i dette modul.
At stoppe med at bruge energi på at slå dig selv oven i hovedet – fordi du bliver bevidst om hvorfor du ikke får tingene gjort.
-
Det resultat du har i dag, er nemlig resultatet af det du gør.
Alt vi gør, gør vi på baggrund af følelser
Og alle vores følelser opstår af tanker.
Derfor skal vi forstå hvor de tanker du har kommer fra.$x$
where not exists (select 1 from video_opgaver where titel like $x$3.1 %$x$);
update video_opgaver set manus_tekst = $x$Nu har du arbejdet med, hvem du er.
Du har kigget på din historie.
På det, der gør dig glad.
Og på hvordan din energi kommer til udtryk gennem din adfærd på Shinebarometeret.
Nu skal vi et lag dybere.
-
For måske ved du nogle gange godt, at du burde sige fra.
Lægge telefonen, få postet mere på sociale medier eller bede om hjælp.
Men alligevel så sker det ikke.
-
Så kan vi bruge en masse energi på at gå og tænke “Hvorfor kan jeg ikke bare tage mig sammen?” For jeg ved jo udmærket hvad jeg skal gøre.
-
Det er dét du lærer at ændre i dette modul.
At stoppe med at bruge energi på at slå dig selv oven i hovedet – fordi du bliver bevidst om hvorfor du ikke får tingene gjort.
-
Det resultat du har i dag, er nemlig resultatet af det du gør.
Alt vi gør, gør vi på baggrund af følelser
Og alle vores følelser opstår af tanker.
Derfor skal vi forstå hvor de tanker du har kommer fra.$x$ where titel like $x$3.1 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$3.2 · Vaner og autopilot$x$, $x$Modul 3 · Hvorfor er du, som du er$x$, $x$KLIPPE-BRIEF · Lektion 3.2 · Vaner og autopilot
Modul: Modul 3 · Hvorfor er du, som du er
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 3-2-vaner-og-autopilot.mp4
Kernen: M3-L2-vaner-og-autopilot-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M3-L2-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M3-L2-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Forestil dig, at du hver morgen skulle lære hvordan man børster tænder.
Eller hvis du, hver gang du satte dig ind i bilen, skulle tænke:
Hvordan starter jeg den?
Det ville kræve enormt meget energi.
-
Derfor automatiserer kroppen og hjernen det, vi gentager.
Det gør hverdagen lettere og frigiver kapacitet og energi til alt det andet, vi skal forholde os til.
Forskere har forsøgt at sætte tal på, hvor mange beslutninger vi træffer på en dag. Tallene svinger — men én ting er de enige om: Det er MANGE. Tusindvis. Hver eneste dag.
-
Men vaner er ikke kun konkrete handlinger som at børste tænder, drikke kaffe eller oprette varer.
Det er også den måde vi tænker på og den måde, vi taler til os selv på.
 
Hvorfor bliver en vane ved?
En vane giver ofte en form for belønning, tryghed eller lettelse her og nu og derfor bliver man ved med at gøre det.
Hvis du spiser slik på sofaen om aftenen fordi du keder dig, smager det godt og fjerner måske kedsomheden kortvarigt.
Vanen kan så koste dig noget på længere sigt og samtidig give dig noget på kort sigt.
Det er en vigtig forskel.
For ellers kommer vi nemt til at tænke:
“Det giver jo ingen mening, at jeg bliver ved.”
Men måske giver det mening, når du ser på, hvad vanen hjælper dig med at undgå, opnå eller kontrollere i øjeblikket.
-
En vane er ikke nødvendigvis god eller dårlig i sig selv. Det afhænger igen fra person til person. Måske er sukkeret på sofaen et bedre valg end alternativet.
Det afhænger af, hvordan den påvirker dit liv over tid.
-
Mange af vores vaner begyndte som løsninger.
Hvis du som barn græd og dine forældre gav dig sukker for at få dig til at holde op med at græde.
Så lærte du, at sukkeret var løsningen, når du var ked af det.
Så lærte du ubevidst, at sukker var trøst — og det kan måske være en del af forklaringen på overvægt.
-
Vanen var ikke nødvendigvis forkert, da den opstod.
Den passede måske godt til den situation, du stod i.
Men den kan være fortsat længe efter, at situationen har ændret sig.
Det er lidt som at have et gammelt styresystem kørende på en ny computer.
Det virker stadig.
-
Men det betyder ikke at den vane fungerer super godt ind i det liv du gerne vil leve i dag.
-
Du kan vide alt om sukker og hvordan det påvirker dig negativt, og stadig ligge og spise slik hver aften.
-
Når slikket kun er den synlige adfærd, hjælper det ikke nødvendigvis kun at vide mere om sukker.
Det bliver lettere at ændre vanen, når du forstår, hvad der udløser den, og i hvilke situationer den opstår.
Mere viden alene er altså ikke nødvendigvis nok til at ændre en indarbejdet vane.
-
Præcis som hvis du ligger om aftenen og gemmer reels med algoritme hacks. Du lærer en masse gode ting. Men hvad hjælper det – hvis de aldrig bliver til noget fordi du måske fortæller dig selv du ikke kan finde ud af sociale medier.
 
 
Derfor så er det ikke nok at spørge:
“Hvad burde jeg gøre?”
Vi er også nødt til at spørge:
“Hvad sker der lige før, jeg gør det, jeg plejer?”
”Hvilken følelse har jeg”
“Hvad er den belønning det jeg skal til at gøre for mig lige nu og her?”
 
Vane-loopet
Du kan se en vane som et lille loop med tre dele:
• En udløser.
• En handling.
• Og en belønning eller lettelse.
-
Udløseren kan være, at du skal poste en video.
Handlingen er, at du begynder at lave overspringshandlinger i stedet.
Belønningen er, at du midlertidigt slipper for ubehaget ved at lægge videoen ud – hvis det er noget der er ubehageligt for dig.
-
Målet er ikke, at du skal stoppe alle vaner, du ikke bryder dig om.
Men du skal blive bevidst om dem.
For når du bliver det – kan der mellem udløser og en automatisk handling opstå et lille mellemrum hvor du tænker: ”åå åååå – nu er jeg ved at gøre det, jeg plejer”.
For det er dér, du begynder at få muligheden for at ændre vanen.
-
Du spiser måske stadig slik. (hvilket man gerne må)
Men du bliver bevidst om hvilke situationer der udløser behovet.
Og når vi er bevidste om årsagen – så kan vi ændre det.
Dermed ikke sagt at det er let.
Rom blev ikke bygget på én dag.
 
 
Din opgave
Læg mærke til nogle af de vaner, du selv vurderer ikke længere er hensigtsmæssige for dig.
Det kan være konkrete handlinger.
Men det kan også være måder, du tænker, reagerer eller taler til dig selv på.
Vælg én vane, og undersøg:
Hvad udløser den?
Hvad gør du automatisk?
Hvilken lettelse, tryghed eller belønning får du i øjeblikket?
Og hvad koster vanen dig på længere sigt?
Du skal ikke nødvendigvis ændre den endnu.
Du skal forstå den.
For vaner opstår ikke i et tomrum.
De bliver formet af det, du har oplevet, og det, du har lært om, hvordan verden fungerer.
 
Langt det meste af det, vi gør, gør vi efter et gammelt program.
 
I næste lektion skal vi derfor kigge på de briller, du ser verden igennem.
Din perception.$x$
where not exists (select 1 from video_opgaver where titel like $x$3.2 %$x$);
update video_opgaver set manus_tekst = $x$Forestil dig, at du hver morgen skulle lære hvordan man børster tænder.
Eller hvis du, hver gang du satte dig ind i bilen, skulle tænke:
Hvordan starter jeg den?
Det ville kræve enormt meget energi.
-
Derfor automatiserer kroppen og hjernen det, vi gentager.
Det gør hverdagen lettere og frigiver kapacitet og energi til alt det andet, vi skal forholde os til.
Forskere har forsøgt at sætte tal på, hvor mange beslutninger vi træffer på en dag. Tallene svinger — men én ting er de enige om: Det er MANGE. Tusindvis. Hver eneste dag.
-
Men vaner er ikke kun konkrete handlinger som at børste tænder, drikke kaffe eller oprette varer.
Det er også den måde vi tænker på og den måde, vi taler til os selv på.
 
Hvorfor bliver en vane ved?
En vane giver ofte en form for belønning, tryghed eller lettelse her og nu og derfor bliver man ved med at gøre det.
Hvis du spiser slik på sofaen om aftenen fordi du keder dig, smager det godt og fjerner måske kedsomheden kortvarigt.
Vanen kan så koste dig noget på længere sigt og samtidig give dig noget på kort sigt.
Det er en vigtig forskel.
For ellers kommer vi nemt til at tænke:
“Det giver jo ingen mening, at jeg bliver ved.”
Men måske giver det mening, når du ser på, hvad vanen hjælper dig med at undgå, opnå eller kontrollere i øjeblikket.
-
En vane er ikke nødvendigvis god eller dårlig i sig selv. Det afhænger igen fra person til person. Måske er sukkeret på sofaen et bedre valg end alternativet.
Det afhænger af, hvordan den påvirker dit liv over tid.
-
Mange af vores vaner begyndte som løsninger.
Hvis du som barn græd og dine forældre gav dig sukker for at få dig til at holde op med at græde.
Så lærte du, at sukkeret var løsningen, når du var ked af det.
Så lærte du ubevidst, at sukker var trøst — og det kan måske være en del af forklaringen på overvægt.
-
Vanen var ikke nødvendigvis forkert, da den opstod.
Den passede måske godt til den situation, du stod i.
Men den kan være fortsat længe efter, at situationen har ændret sig.
Det er lidt som at have et gammelt styresystem kørende på en ny computer.
Det virker stadig.
-
Men det betyder ikke at den vane fungerer super godt ind i det liv du gerne vil leve i dag.
-
Du kan vide alt om sukker og hvordan det påvirker dig negativt, og stadig ligge og spise slik hver aften.
-
Når slikket kun er den synlige adfærd, hjælper det ikke nødvendigvis kun at vide mere om sukker.
Det bliver lettere at ændre vanen, når du forstår, hvad der udløser den, og i hvilke situationer den opstår.
Mere viden alene er altså ikke nødvendigvis nok til at ændre en indarbejdet vane.
-
Præcis som hvis du ligger om aftenen og gemmer reels med algoritme hacks. Du lærer en masse gode ting. Men hvad hjælper det – hvis de aldrig bliver til noget fordi du måske fortæller dig selv du ikke kan finde ud af sociale medier.
 
 
Derfor så er det ikke nok at spørge:
“Hvad burde jeg gøre?”
Vi er også nødt til at spørge:
“Hvad sker der lige før, jeg gør det, jeg plejer?”
”Hvilken følelse har jeg”
“Hvad er den belønning det jeg skal til at gøre for mig lige nu og her?”
 
Vane-loopet
Du kan se en vane som et lille loop med tre dele:
• En udløser.
• En handling.
• Og en belønning eller lettelse.
-
Udløseren kan være, at du skal poste en video.
Handlingen er, at du begynder at lave overspringshandlinger i stedet.
Belønningen er, at du midlertidigt slipper for ubehaget ved at lægge videoen ud – hvis det er noget der er ubehageligt for dig.
-
Målet er ikke, at du skal stoppe alle vaner, du ikke bryder dig om.
Men du skal blive bevidst om dem.
For når du bliver det – kan der mellem udløser og en automatisk handling opstå et lille mellemrum hvor du tænker: ”åå åååå – nu er jeg ved at gøre det, jeg plejer”.
For det er dér, du begynder at få muligheden for at ændre vanen.
-
Du spiser måske stadig slik. (hvilket man gerne må)
Men du bliver bevidst om hvilke situationer der udløser behovet.
Og når vi er bevidste om årsagen – så kan vi ændre det.
Dermed ikke sagt at det er let.
Rom blev ikke bygget på én dag.
 
 
Din opgave
Læg mærke til nogle af de vaner, du selv vurderer ikke længere er hensigtsmæssige for dig.
Det kan være konkrete handlinger.
Men det kan også være måder, du tænker, reagerer eller taler til dig selv på.
Vælg én vane, og undersøg:
Hvad udløser den?
Hvad gør du automatisk?
Hvilken lettelse, tryghed eller belønning får du i øjeblikket?
Og hvad koster vanen dig på længere sigt?
Du skal ikke nødvendigvis ændre den endnu.
Du skal forstå den.
For vaner opstår ikke i et tomrum.
De bliver formet af det, du har oplevet, og det, du har lært om, hvordan verden fungerer.
 
Langt det meste af det, vi gør, gør vi efter et gammelt program.
 
I næste lektion skal vi derfor kigge på de briller, du ser verden igennem.
Din perception.$x$ where titel like $x$3.2 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$3.3 · De briller, du ser verden med$x$, $x$Modul 3 · Hvorfor er du, som du er$x$, $x$KLIPPE-BRIEF · Lektion 3.3 · De briller, du ser verden med
Modul: Modul 3 · Hvorfor er du, som du er
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 3-3-de-briller-du-ser-verden-med.mp4
Kernen: M3-L3-de-briller-du-ser-verden-med-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M3-L3-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M3-L3-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$I sidste lektion talte vi om, hvordan handlinger kan blive automatiske vaner.
Nu skal vi kigge på noget af det, der er med til at forme dem.
Nemlig vores perception.
-
 
 
Hele mit voksenliv har jeg løbet virkelig stærkt.
-
Hvis jeg skulle have gæster om 30 minutter, men hverken havde lavet mad, gjort rent eller selv var klar, hvad tror du så, jeg brugte tiden på?
• Jeg strøg mit sengetøj.
Fuldstændig uanfægtet af, om mine gæster nogensinde skulle se mit soveværelse eller ej.
-
Så kunne jeg stå der med mascara på det ene øje.
Mad der ikke var klar.
Fnullermænd ovre i hjørnerne.
Men mit sengetøj – det var strøget.
-
Hvorfor gjorde jeg det?
-
Fordi min mormor engang havde fortalt mig, at en ordentlig kvinde stryger sit sengetøj.
-
Så der kunne jeg altså stå – hvor andre ville opfatte mig som fuldstændig kaos og uorganiseret.
Mens jeg følte mig som en ordentlig kvinde – der med mascara på det ene øje og sved ned ad ryggen.
Er I overhovedet klar over - hvor lang tid det tager at stryge sengetøj?
-
Sådan kan vores perception komme til at styre den måde, vi prioriterer vores tid og energi på.
-
Det betyder ikke, at det er forkert at stryge sit sengetøj.
Hallå – det er jo sygt lækkert.
-
Jeg elsker stadig at sove i strøget sengetøj.
Men i dag gør jeg det, når det giver mening.
-
Perception er de briller, vi ser verden med.
De bliver formet af opvæksten og de erfaringer vi har fået gennem livet.
Det betyder også, at du og jeg godt kan stå i præcis den samme situation og opleve den helt forskelligt.
Det, der er vigtigt for dig, er ikke nødvendigvis vigtigt for mig.
Og det, der føles rigtigt for dig, føles ikke nødvendigvis rigtigt for mig.
-
Det er også en af de største årsager til konflikter.
Så når du går og tænker at nogen gør noget forkert.
Så se om du kan ændre dine frustrationer og negative tanker til en nysgerrighed og spørg dig selv ”Gad vide hvorfor personen gør det på den måde”.
Eller spørg dig selv ”Hvorfor er min måde egentlig den rigtige for mig”?
-
Og her sker der noget vigtigt.
For bevidsthed går nemlig to veje.
I takt med at du bliver klogere på dig selv, bliver du også klogere på dine medmennesker.
Din partner. Dine kolleger. Dine kunder.
Når du forstår, hvorfor du gør, som du gør, bliver det pludselig meget lettere at forstå, hvorfor andre gør, som de gør.
Og det giver en helt anden fælles forståelse for hinanden.
Både derhjemme og på arbejdet.
-
Og når du bliver nysgerrig på din egen adfærd.
Nysgerrig for hvorfor du skriver de ting på din to-do som du gør.
Så vil du finde ud af hvor meget tid og energi du bruger på at leve op til regler, du aldrig selv har valgt.
Men regler vi har samlet op gennem livet.
Gode som dårlige.
Og når du kommer til årsagen af dine vaner, bliver det lettere at vurdere, om de stadig hjælper dig.
Eller om det er tid til at ryst æ’ pose og se situationen på en ny måde.
-
I næste lektion skal vi kigge på, hvem du har lært, at du skal være for at føle dig tryg, accepteret og som en del af flokken.$x$
where not exists (select 1 from video_opgaver where titel like $x$3.3 %$x$);
update video_opgaver set manus_tekst = $x$I sidste lektion talte vi om, hvordan handlinger kan blive automatiske vaner.
Nu skal vi kigge på noget af det, der er med til at forme dem.
Nemlig vores perception.
-
 
 
Hele mit voksenliv har jeg løbet virkelig stærkt.
-
Hvis jeg skulle have gæster om 30 minutter, men hverken havde lavet mad, gjort rent eller selv var klar, hvad tror du så, jeg brugte tiden på?
• Jeg strøg mit sengetøj.
Fuldstændig uanfægtet af, om mine gæster nogensinde skulle se mit soveværelse eller ej.
-
Så kunne jeg stå der med mascara på det ene øje.
Mad der ikke var klar.
Fnullermænd ovre i hjørnerne.
Men mit sengetøj – det var strøget.
-
Hvorfor gjorde jeg det?
-
Fordi min mormor engang havde fortalt mig, at en ordentlig kvinde stryger sit sengetøj.
-
Så der kunne jeg altså stå – hvor andre ville opfatte mig som fuldstændig kaos og uorganiseret.
Mens jeg følte mig som en ordentlig kvinde – der med mascara på det ene øje og sved ned ad ryggen.
Er I overhovedet klar over - hvor lang tid det tager at stryge sengetøj?
-
Sådan kan vores perception komme til at styre den måde, vi prioriterer vores tid og energi på.
-
Det betyder ikke, at det er forkert at stryge sit sengetøj.
Hallå – det er jo sygt lækkert.
-
Jeg elsker stadig at sove i strøget sengetøj.
Men i dag gør jeg det, når det giver mening.
-
Perception er de briller, vi ser verden med.
De bliver formet af opvæksten og de erfaringer vi har fået gennem livet.
Det betyder også, at du og jeg godt kan stå i præcis den samme situation og opleve den helt forskelligt.
Det, der er vigtigt for dig, er ikke nødvendigvis vigtigt for mig.
Og det, der føles rigtigt for dig, føles ikke nødvendigvis rigtigt for mig.
-
Det er også en af de største årsager til konflikter.
Så når du går og tænker at nogen gør noget forkert.
Så se om du kan ændre dine frustrationer og negative tanker til en nysgerrighed og spørg dig selv ”Gad vide hvorfor personen gør det på den måde”.
Eller spørg dig selv ”Hvorfor er min måde egentlig den rigtige for mig”?
-
Og her sker der noget vigtigt.
For bevidsthed går nemlig to veje.
I takt med at du bliver klogere på dig selv, bliver du også klogere på dine medmennesker.
Din partner. Dine kolleger. Dine kunder.
Når du forstår, hvorfor du gør, som du gør, bliver det pludselig meget lettere at forstå, hvorfor andre gør, som de gør.
Og det giver en helt anden fælles forståelse for hinanden.
Både derhjemme og på arbejdet.
-
Og når du bliver nysgerrig på din egen adfærd.
Nysgerrig for hvorfor du skriver de ting på din to-do som du gør.
Så vil du finde ud af hvor meget tid og energi du bruger på at leve op til regler, du aldrig selv har valgt.
Men regler vi har samlet op gennem livet.
Gode som dårlige.
Og når du kommer til årsagen af dine vaner, bliver det lettere at vurdere, om de stadig hjælper dig.
Eller om det er tid til at ryst æ’ pose og se situationen på en ny måde.
-
I næste lektion skal vi kigge på, hvem du har lært, at du skal være for at føle dig tryg, accepteret og som en del af flokken.$x$ where titel like $x$3.3 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$3.4 · Hvem lærte du, at du skulle være?$x$, $x$Modul 3 · Hvorfor er du, som du er$x$, $x$KLIPPE-BRIEF · Lektion 3.4 · Hvem lærte du, at du skulle være?
Modul: Modul 3 · Hvorfor er du, som du er
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 3-4-hvem-laerte-du-at-du-skulle-vaere.mp4
Kernen: M3-L4-hvem-laerte-du-at-du-skulle-vaere-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M3-L4-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M3-L4-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$I sidste lektion talte vi om de briller, du ser verden igennem.
Nu skal vi kigge på noget, der ligger endnu dybere:
-
Hvem har du lært, at du skal være - for at føle dig tryg, accepteret og som en del af flokken?
-
For vi mennesker har brug for at høre til.
Helt fra vi er små, begynder vi at registrere, hvad der giver os kontakt med andre mennesker.
Hvad bliver der smilet af?
Hvornår får vi opmærksomhed?
Og hvornår oplever vi afstand, kritik eller afvisning?
-
På den måde lærer vi ikke kun noget om verden.
Vi lærer også noget om, hvem vi tror, vi skal være i den.
-
Måske lærte du, at du blev værdsat, når du var dygtig.
Når du hjalp andre.
Når du var nem.
Når du klarede dig selv.
Når du præsterede.
Eller når du ikke fyldte for meget.
-
Det betyder ikke nødvendigvis, at nogen bevidst har forsøgt at lære dig, at du ikke måtte være dig selv.
Men som mennesker er vi enormt gode til at tilpasse os det miljø, vi befinder os i.
-
 
Det har jeg selv været virkelig god til.
-
Mobning i de tidlige skoleår gav mig en dyb følelse af ikke at være god nok der har fulgt mig hele livet.
Derfor har jeg ubevidst specialtrænet mig selv i at aflæse rum og mennesker.
For at finde ud af - hvordan skal jeg opføre mig her, for at de kan lide mig?
-
Jeg blev en social kamæleon.
-
En kamæleon skifter farve, så den passer ind i sine omgivelser.
Så hvis den sidder på en brun gren bliver den brun og hvis den sidder på en grøn gren bliver den grøn.
Det gør den for ikke at blive opdaget og dermed overleve.
Og det er jo egentlig ret smart.
-
Hvis du er god til at aflæse andre mennesker, kan du blive god til at skabe relationer.
God til at sælge.
God til at få andre til at føle sig set.
Men evnen kan også have en pris.
-
For hvis du hele tiden tilpasser dig efter omgivelserne, kan det blive svært at finde ud af, hvem man egentlig selv er og hvad man selv har lyst til og ikke mindst mærke hvad man har brug for.
-
 
 
Jeg arbejder med to former for kærlighed:
• Ubetinget kærlighed.
• Og betinget kærlighed.
 
Ubetinget kærlighed er oplevelsen af at føle sig elsket – præcis for den man er. Ikke for noget man siger eller gør eller har.
-
-
Betinget kærlighed har et “fordi” hængende bagefter:
Jeg er værdifuld, fordi jeg er dygtig.
Jeg er værd at være sammen med, fordi jeg er sjov.
Jeg er god nok, fordi jeg hjælper.
Jeg fortjener anerkendelse, fordi jeg arbejder hårdt.
-
Vi har alle brug for anerkendelse for noget af det, vi gør.
Problemet opstår, hvis vores oplevelse af værdi primært bliver bundet op på vores præstationer, vores udseende eller vores evne til at gøre andre tilfredse.
Så kan vi begynde at leve efter det, vi tror, andre ønsker af os.
-
Vi siger ja, selvom vi mener nej.
Vi forsøger at være perfekte, før vi tør vise noget frem.
Vi arbejder mere, end vi har energi til.
Vi gør os mindre.
Eller vi ændrer os alt efter, hvem vi er sammen med.
Ikke nødvendigvis fordi vi aktivt vælger det.
Men fordi det engang har hjulpet os med at føle os trygge og accepterede.
Det handler ikke om at placere skyld hos dine forældre, din partner, en tidligere chef eller andre mennesker i dit liv.
Det handler om at blive bevidst om, hvad der har formet dig og stoppe op og spørge dig selv om det stadig er hensigtsmæssigt.
-
Din opgave er at spørge dig selv:
Hvornår føler du dig mest fri til at være dig selv?
Hvem kan du være sammen med uden at skulle præstere?
Hvornår ændrer du dig for at passe ind?
Og hvad tror du, der ville ske, hvis du viste lidt mere af den, du faktisk er?
-
I næste modul skal vi se på, hvad alle de valg gør ved din energi.
Her introducerer jeg dig for Energibanken.
Et redskab, der skal hjælpe dig med at forstå, hvad der kræver energi, hvad der skaber energi, og hvordan du kan begynde at tage energien tilbage.$x$
where not exists (select 1 from video_opgaver where titel like $x$3.4 %$x$);
update video_opgaver set manus_tekst = $x$I sidste lektion talte vi om de briller, du ser verden igennem.
Nu skal vi kigge på noget, der ligger endnu dybere:
-
Hvem har du lært, at du skal være - for at føle dig tryg, accepteret og som en del af flokken?
-
For vi mennesker har brug for at høre til.
Helt fra vi er små, begynder vi at registrere, hvad der giver os kontakt med andre mennesker.
Hvad bliver der smilet af?
Hvornår får vi opmærksomhed?
Og hvornår oplever vi afstand, kritik eller afvisning?
-
På den måde lærer vi ikke kun noget om verden.
Vi lærer også noget om, hvem vi tror, vi skal være i den.
-
Måske lærte du, at du blev værdsat, når du var dygtig.
Når du hjalp andre.
Når du var nem.
Når du klarede dig selv.
Når du præsterede.
Eller når du ikke fyldte for meget.
-
Det betyder ikke nødvendigvis, at nogen bevidst har forsøgt at lære dig, at du ikke måtte være dig selv.
Men som mennesker er vi enormt gode til at tilpasse os det miljø, vi befinder os i.
-
 
Det har jeg selv været virkelig god til.
-
Mobning i de tidlige skoleår gav mig en dyb følelse af ikke at være god nok der har fulgt mig hele livet.
Derfor har jeg ubevidst specialtrænet mig selv i at aflæse rum og mennesker.
For at finde ud af - hvordan skal jeg opføre mig her, for at de kan lide mig?
-
Jeg blev en social kamæleon.
-
En kamæleon skifter farve, så den passer ind i sine omgivelser.
Så hvis den sidder på en brun gren bliver den brun og hvis den sidder på en grøn gren bliver den grøn.
Det gør den for ikke at blive opdaget og dermed overleve.
Og det er jo egentlig ret smart.
-
Hvis du er god til at aflæse andre mennesker, kan du blive god til at skabe relationer.
God til at sælge.
God til at få andre til at føle sig set.
Men evnen kan også have en pris.
-
For hvis du hele tiden tilpasser dig efter omgivelserne, kan det blive svært at finde ud af, hvem man egentlig selv er og hvad man selv har lyst til og ikke mindst mærke hvad man har brug for.
-
 
 
Jeg arbejder med to former for kærlighed:
• Ubetinget kærlighed.
• Og betinget kærlighed.
 
Ubetinget kærlighed er oplevelsen af at føle sig elsket – præcis for den man er. Ikke for noget man siger eller gør eller har.
-
-
Betinget kærlighed har et “fordi” hængende bagefter:
Jeg er værdifuld, fordi jeg er dygtig.
Jeg er værd at være sammen med, fordi jeg er sjov.
Jeg er god nok, fordi jeg hjælper.
Jeg fortjener anerkendelse, fordi jeg arbejder hårdt.
-
Vi har alle brug for anerkendelse for noget af det, vi gør.
Problemet opstår, hvis vores oplevelse af værdi primært bliver bundet op på vores præstationer, vores udseende eller vores evne til at gøre andre tilfredse.
Så kan vi begynde at leve efter det, vi tror, andre ønsker af os.
-
Vi siger ja, selvom vi mener nej.
Vi forsøger at være perfekte, før vi tør vise noget frem.
Vi arbejder mere, end vi har energi til.
Vi gør os mindre.
Eller vi ændrer os alt efter, hvem vi er sammen med.
Ikke nødvendigvis fordi vi aktivt vælger det.
Men fordi det engang har hjulpet os med at føle os trygge og accepterede.
Det handler ikke om at placere skyld hos dine forældre, din partner, en tidligere chef eller andre mennesker i dit liv.
Det handler om at blive bevidst om, hvad der har formet dig og stoppe op og spørge dig selv om det stadig er hensigtsmæssigt.
-
Din opgave er at spørge dig selv:
Hvornår føler du dig mest fri til at være dig selv?
Hvem kan du være sammen med uden at skulle præstere?
Hvornår ændrer du dig for at passe ind?
Og hvad tror du, der ville ske, hvis du viste lidt mere af den, du faktisk er?
-
I næste modul skal vi se på, hvad alle de valg gør ved din energi.
Her introducerer jeg dig for Energibanken.
Et redskab, der skal hjælpe dig med at forstå, hvad der kræver energi, hvad der skaber energi, og hvordan du kan begynde at tage energien tilbage.$x$ where titel like $x$3.4 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$4.1 · Forstå Energibanken$x$, $x$Modul 4 · Energibanken$x$, $x$KLIPPE-BRIEF · Lektion 4.1 · Forstå Energibanken
Modul: Modul 4 · Energibanken
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 4-1-forstaa-energibanken.mp4
Kernen: M4-L1-forstaa-energibanken-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M4-L1-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M4-L1-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Velkommen til mit yndlingsmodul:
Energibanken.
I det seneste modul har vi arbejdet med, hvorfor du gør, som du gør.
Nu skal vi kigge på, hvad alt det, du gør, tænker og håndterer, betyder for din energi.
For energi er ikke bare noget, du enten har eller ikke har.
Den bliver påvirket hele tiden.
Af det, du bruger din krop på.
Af det, du bruger dit hoved på.
Af den måde, du spiser og sover på.
Af de mennesker, du er sammen med.
Af de tanker, du gentager.
Og af hvor meget plads der er til ro, glæde og alt det, der giver dig energi tilbage.
Til at forstå det har jeg udviklet et redskab, jeg kalder Energibanken.
Energibanken skal give dig et overblik over:
Hvad der kræver energi af dig.
Hvad der skaber energi hos dig.
Og hvordan du kan skabe en bedre balance mellem de to.
For præcis som på en almindelig bankkonto kan du ikke blive ved med at hæve uden også at sætte noget ind.
Du kan godt låne i en periode.
Det gør vi alle sammen.
Måske har du en travl uge.
En stor opgave.
Et arrangement.
En deadline.
Eller en periode i dit privatliv, der kræver mere af dig end normalt.
Det er ikke nødvendigvis et problem.
Problemet opstår, hvis du bliver ved med at hæve fra kontoen uden at betale tilbage.
For så begynder overtrækket at koste.
Først mærker du måske bare, at du er lidt mere træt.
At du har kortere lunte.
At du har sværere ved at koncentrere dig.
Eller at du ikke føler dig helt som dig selv.
Men hvis du fortsætter med at bruge mere energi, end du skaber, begynder kroppen at skrue op for sine signaler.
Det kommer vi meget mere ind på senere i modulet.
Men først skal du forstå selve banken.
Energibanken består grundlæggende af to sider.
Den ene side er det, der kræver energi.
Den anden side er det, der skaber energi.
Det, der kræver energi, kan både være fysisk og mentalt.
Fysisk kan det være:
At arbejde.
At træne.
At køre langt.
At gøre rent.
At være syg.
At have smerter.
Eller bare at være i gang en hel dag uden reelle pauser.
Mentalt kan det være:
At tænke.
At planlægge.
At tage beslutninger.
At bekymre sig.
At overtænke.
At forsøge at kontrollere noget.
At tilpasse sig andre.
Eller at gå rundt med ting, du aldrig får sagt højt.
På den anden side har vi det, der skaber energi.
Det kan blandt andet være:
Kost og væske.
Ro og hvile.
Glæde.
Mening.
Bevægelse, der passer til dig.
Mennesker, du kan være dig selv sammen med.
Og muligheden for at udtrykke det, du går rundt med.
Det er de overordnede områder, vi skal arbejde med i Energibanken.
Men her er noget vigtigt:
Der findes ikke én standardenergibank.
Det, der skaber energi hos mig, skaber ikke nødvendigvis energi hos dig.
Og det, der kræver energi hos dig, er ikke nødvendigvis belastende for alle andre.
En løbetur kan give ét menneske energi.
Og tømme et andet menneskes konto.
En aften med mange mennesker kan føles fantastisk for én.
Og kræve flere dages restitution for en anden.
At være foran kameraet kan give én person energi.
Mens en anden bruger hele dagen på at tage sig sammen og gennemgå alt det, der kan gå galt.
Derfor skal du ikke bruge Energibanken til at finde ud af, hvad der generelt er sundt, rigtigt eller forkert.
Du skal bruge den til at forstå, hvad noget gør ved dig.
Og det er heller ikke altid sort eller hvidt.
Noget kan både kræve og skabe energi.
Træning kræver eksempelvis fysisk energi, mens du gør det.
Men den kan samtidig give glæde, ro og mere energi bagefter.
En arbejdsopgave kan være krævende.
Men hvis den føles meningsfuld, kan den stadig give mere tilbage, end den tager.
Og noget kan være sjovt i øjeblikket, men koste bagefter.
Derfor er spørgsmålet ikke kun:
“Kan jeg lide det?”
Spørgsmålet er:
“Hvad gør det samlet set ved min energi?”
Dit Shinebarometer hjælper dig med at få øje på, hvor du befinder dig.
Det er displayet på kontoen.
Det viser sig gennem din adfærd.
Om du har lyst til at være sammen med andre.
Om du kan fordybe dig.
Om du er kreativ.
Om du bliver irritabel.
Om du trækker dig.
Og om du føler dig som dig selv.
Energibanken skal hjælpe dig med at forstå, hvorfor du befinder dig dér.
Hvad har du brugt energi på?
Hvad har du ikke fået sat ind?
Og er der noget, du kan ændre?
Så når du opdager, at du falder på dit Shinebarometer, skal du ikke automatisk tænke:
“Hvad er der galt med mig?”
Du skal begynde at spørge:
“Hvad er der sket på min konto?”
“Har jeg hævet mere, end jeg har sat ind?”
“Er der noget, jeg kan skrue ned for?”
“Eller er der noget, jeg aktivt skal gøre for at skabe mere energi?”
Det er sådan, du begynder at tage energien tilbage.
Ikke ved at kontrollere alt.
Ikke ved at forsøge at være på en 10’er hele tiden.
Men ved at forstå din egen konto og tage mere bevidste beslutninger ud fra den.
I næste lektion skal vi på rundtur i Energibanken.
Her skal du se de to sider samlet og forstå forskellen på det, der kræver energi, og det, der skaber den.$x$
where not exists (select 1 from video_opgaver where titel like $x$4.1 %$x$);
update video_opgaver set manus_tekst = $x$Velkommen til mit yndlingsmodul:
Energibanken.
I det seneste modul har vi arbejdet med, hvorfor du gør, som du gør.
Nu skal vi kigge på, hvad alt det, du gør, tænker og håndterer, betyder for din energi.
For energi er ikke bare noget, du enten har eller ikke har.
Den bliver påvirket hele tiden.
Af det, du bruger din krop på.
Af det, du bruger dit hoved på.
Af den måde, du spiser og sover på.
Af de mennesker, du er sammen med.
Af de tanker, du gentager.
Og af hvor meget plads der er til ro, glæde og alt det, der giver dig energi tilbage.
Til at forstå det har jeg udviklet et redskab, jeg kalder Energibanken.
Energibanken skal give dig et overblik over:
Hvad der kræver energi af dig.
Hvad der skaber energi hos dig.
Og hvordan du kan skabe en bedre balance mellem de to.
For præcis som på en almindelig bankkonto kan du ikke blive ved med at hæve uden også at sætte noget ind.
Du kan godt låne i en periode.
Det gør vi alle sammen.
Måske har du en travl uge.
En stor opgave.
Et arrangement.
En deadline.
Eller en periode i dit privatliv, der kræver mere af dig end normalt.
Det er ikke nødvendigvis et problem.
Problemet opstår, hvis du bliver ved med at hæve fra kontoen uden at betale tilbage.
For så begynder overtrækket at koste.
Først mærker du måske bare, at du er lidt mere træt.
At du har kortere lunte.
At du har sværere ved at koncentrere dig.
Eller at du ikke føler dig helt som dig selv.
Men hvis du fortsætter med at bruge mere energi, end du skaber, begynder kroppen at skrue op for sine signaler.
Det kommer vi meget mere ind på senere i modulet.
Men først skal du forstå selve banken.
Energibanken består grundlæggende af to sider.
Den ene side er det, der kræver energi.
Den anden side er det, der skaber energi.
Det, der kræver energi, kan både være fysisk og mentalt.
Fysisk kan det være:
At arbejde.
At træne.
At køre langt.
At gøre rent.
At være syg.
At have smerter.
Eller bare at være i gang en hel dag uden reelle pauser.
Mentalt kan det være:
At tænke.
At planlægge.
At tage beslutninger.
At bekymre sig.
At overtænke.
At forsøge at kontrollere noget.
At tilpasse sig andre.
Eller at gå rundt med ting, du aldrig får sagt højt.
På den anden side har vi det, der skaber energi.
Det kan blandt andet være:
Kost og væske.
Ro og hvile.
Glæde.
Mening.
Bevægelse, der passer til dig.
Mennesker, du kan være dig selv sammen med.
Og muligheden for at udtrykke det, du går rundt med.
Det er de overordnede områder, vi skal arbejde med i Energibanken.
Men her er noget vigtigt:
Der findes ikke én standardenergibank.
Det, der skaber energi hos mig, skaber ikke nødvendigvis energi hos dig.
Og det, der kræver energi hos dig, er ikke nødvendigvis belastende for alle andre.
En løbetur kan give ét menneske energi.
Og tømme et andet menneskes konto.
En aften med mange mennesker kan føles fantastisk for én.
Og kræve flere dages restitution for en anden.
At være foran kameraet kan give én person energi.
Mens en anden bruger hele dagen på at tage sig sammen og gennemgå alt det, der kan gå galt.
Derfor skal du ikke bruge Energibanken til at finde ud af, hvad der generelt er sundt, rigtigt eller forkert.
Du skal bruge den til at forstå, hvad noget gør ved dig.
Og det er heller ikke altid sort eller hvidt.
Noget kan både kræve og skabe energi.
Træning kræver eksempelvis fysisk energi, mens du gør det.
Men den kan samtidig give glæde, ro og mere energi bagefter.
En arbejdsopgave kan være krævende.
Men hvis den føles meningsfuld, kan den stadig give mere tilbage, end den tager.
Og noget kan være sjovt i øjeblikket, men koste bagefter.
Derfor er spørgsmålet ikke kun:
“Kan jeg lide det?”
Spørgsmålet er:
“Hvad gør det samlet set ved min energi?”
Dit Shinebarometer hjælper dig med at få øje på, hvor du befinder dig.
Det er displayet på kontoen.
Det viser sig gennem din adfærd.
Om du har lyst til at være sammen med andre.
Om du kan fordybe dig.
Om du er kreativ.
Om du bliver irritabel.
Om du trækker dig.
Og om du føler dig som dig selv.
Energibanken skal hjælpe dig med at forstå, hvorfor du befinder dig dér.
Hvad har du brugt energi på?
Hvad har du ikke fået sat ind?
Og er der noget, du kan ændre?
Så når du opdager, at du falder på dit Shinebarometer, skal du ikke automatisk tænke:
“Hvad er der galt med mig?”
Du skal begynde at spørge:
“Hvad er der sket på min konto?”
“Har jeg hævet mere, end jeg har sat ind?”
“Er der noget, jeg kan skrue ned for?”
“Eller er der noget, jeg aktivt skal gøre for at skabe mere energi?”
Det er sådan, du begynder at tage energien tilbage.
Ikke ved at kontrollere alt.
Ikke ved at forsøge at være på en 10’er hele tiden.
Men ved at forstå din egen konto og tage mere bevidste beslutninger ud fra den.
I næste lektion skal vi på rundtur i Energibanken.
Her skal du se de to sider samlet og forstå forskellen på det, der kræver energi, og det, der skaber den.$x$ where titel like $x$4.1 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$4.2 · Rundvisning i Energibanken$x$, $x$Modul 4 · Energibanken$x$, $x$KLIPPE-BRIEF · Lektion 4.2 · Rundvisning i Energibanken
Modul: Modul 4 · Energibanken
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 4-2-rundvisning-i-energibanken.mp4
Kernen: M4-L2-rundvisning-i-energibanken-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M4-L2-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M4-L2-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$I sidste lektion blev du introduceret til Energibanken.
Nu skal vi kigge nærmere på, hvordan banken er bygget op.
[Vis Energibanken]
Energibanken består grundlæggende af to sider:
Det, der kræver energi.
Og det, der skaber energi.
Du kan også tænke på det som udgifter og indtægter.
På udgiftssiden ligger alt det, du bruger energi på.
På indtægtssiden ligger det, der tilfører energi, hjælper dig med at genopbygge den eller gør det lettere for kroppen at håndtere det, du kræver af den.
Det lyder måske simpelt.
Men det er vigtigt, at vi skelner mellem de to sider.
For mange af os er virkelig gode til at holde øje med vores økonomiske konto.
Vi ved nogenlunde, hvad der går ind.
Vi ved, hvad der går ud.
Og hvis kontoen nærmer sig nul, begynder vi at justere.
Men vi kan bruge energi fra morgen til aften uden nogensinde at stoppe op og undersøge, hvad der egentlig sker på energikontoen.
Vi fortsætter bare.
Indtil kroppen begynder at protestere.
Det, der kræver energi
Vi begynder på den side af banken, hvor energien bliver brugt.
Her deler vi det op i to hovedområder:
Fysisk bevægelse.
Og mental bevægelse.
Når jeg siger bevægelse, mener jeg ikke kun motion.
Jeg mener alt det, der sætter din krop, din hjerne eller dit nervesystem i arbejde.
Fysisk bevægelse
Fysisk bevægelse er alt det, kroppen bruger energi på fysisk.
Det kan være:
At arbejde.
At gå.
At stå.
At løfte.
At træne.
At gøre rent.
At køre bil i mange timer.
At passe børn.
At være syg.
At have smerter.
At restituere efter sygdom eller træning.
Og alle de praktiske ting, du bruger kroppen på i løbet af en dag.
Noget af det er nemt at få øje på.
Du ved sandsynligvis godt, at en lang arbejdsdag eller en hård træning kræver energi.
Men noget fysisk energiforbrug er mindre synligt.
Det kræver også energi at have smerter.
At spænde i kroppen.
At være i støjende omgivelser.
At blive afbrudt hele tiden.
Eller at være fysisk på, uden at du reelt holder pause.
Fysisk bevægelse er ikke forkert.
Vi har brug for at bevæge os.
Vi har brug for at arbejde, bruge kroppen og gøre ting.
Men al bevægelse kræver energi.
Derfor er spørgsmålet ikke:
“Er fysisk bevægelse godt eller dårligt?”
Spørgsmålet er:
“Har jeg energi til det, jeg kræver af kroppen lige nu?”
Og:
“Får jeg mulighed for at genopbygge energien bagefter?”
Mental bevægelse
Den anden del af udgiftssiden er mental bevægelse.
Og den bliver meget ofte overset.
Mental bevægelse er alt det, du bruger hovedet og nervesystemet på.
Det kan være:
At tænke.
At planlægge.
At tage beslutninger.
At løse problemer.
At skifte mellem mange opgaver.
At bekymre sig.
At overtænke.
At forsøge at forudsige, hvad der kan gå galt.
At holde styr på andre mennesker.
At tilpasse sig.
At holde følelser eller meninger tilbage.
Eller at gå rundt med løse ender, du aldrig får lukket.
Du kan altså godt sidde helt stille på en stol og samtidig bruge enormt meget energi.
Din kalender kan se tom ud.
Men dit hoved kan være på overarbejde.
Det er derfor, tid og energi ikke er det samme.
Du kan godt have en ledig time uden at have den mentale kapacitet til at læse, være kreativ, tage en vigtig beslutning eller optage en video.
For selvom tiden er ledig, er energien måske allerede brugt.
Mental bevægelse kræver lige så reel energi som fysisk bevægelse.
Den er bare sværere at se.
Det er også her, mange af de energityve, vi senere skal arbejde med, befinder sig.
Overtænkeren.
Antageren.
Pleaseren.
Kontrolløren.
Den indre kritiker.
Og alle de tanker, vi bruger på ting, vi ikke selv kan styre.
Det, der skaber energi
Nu går vi over på den anden side af banken.
Det, der skaber energi.
Her arbejder vi med fire overordnede områder:
Kost og væske.
Ro og hvile.
Glæde.
Udtryk.
Kost og væske
Din krop skal have noget at skabe energi af.
Derfor er kost og væske en grundlæggende del af Energibanken.
Det handler ikke om en perfekt kostplan.
Det handler om, hvorvidt du giver kroppen stabil adgang til det, den har brug for.
Får du spist?
Får du spist nok?
Får du væske?
Og giver det, du spiser og drikker, dig stabil energi?
Eller forsøger du at holde dig kørende på kaffe, sukker og hurtige løsninger, fordi kontoen allerede er ved at være tom?
Mad og væske er ikke hele løsningen.
Men kroppen kan ikke skabe energi ud af ingenting.
Ro og hvile
Ro og hvile er ikke bare fraværet af arbejde.
Du kan godt ligge på sofaen og stadig være i fuld mental bevægelse.
Du kan scrolle.
Planlægge.
Bekymre dig.
Besvare beskeder.
Eller gennemgå dagen inde i hovedet.
Fysisk ro betyder, at kroppen får mulighed for at sænke belastningen.
Mental ro betyder, at hjernen ikke hele tiden skal løse, registrere eller reagere på noget.
Begge dele er nødvendige.
Men ro ser ikke ens ud for alle.
For nogle kan stilhed og meditation skabe ro.
For andre kan det være en gåtur, dans, styrketræning, sang eller kreativitet, fordi kroppen først har brug for at få afløb for noget af den energi, der er fanget.
Glæde og mening
Det, der gør dig glad, er ikke bare pynt på livet.
Det er en del af det, der skaber energi.
Musik.
Natur.
Kreativitet.
Humor.
Fordybelse.
Mennesker, du kan være dig selv sammen med.
Eller oplevelsen af, at det, du bruger dit liv på, giver mening.
Derfor arbejdede du allerede i Modul 2 med, hvad der gør dig glad.
For hvis alt i din hverdag kræver noget af dig, men næsten intet giver noget tilbage, bliver balancen svær at opretholde.
Du skal ikke leve et liv, hvor alt er sjovt.
Men der skal være noget i dit liv, der føles værd at bruge energien på.
Udtryk
Vi mennesker tager hele tiden indtryk ind.
Vi ser.
Hører.
Registrerer.
Tænker.
Mærker.
Og reagerer.
Men vi har også brug for at få noget ud.
Det kan være gennem samtaler.
Sang.
Dans.
Musik.
Kreativitet.
Bevægelse.
Skrift.
Gråd.
Humor.
At sige sin mening.
Eller at fortælle nogen, hvordan man faktisk har det.
Hvis vi bliver ved med at tage indtryk ind uden at få lov til at udtrykke noget, kan der opstå et pres.
Derfor er udtryk ikke bare noget kreativt eller kunstnerisk.
Det er en måde at regulere og skabe bevægelse i det, vi går rundt med.
Det er ikke sort eller hvidt
Det er vigtigt, at du ikke begynder at placere alle aktiviteter i faste kasser.
Noget er ikke altid en udgift.
Og noget er ikke altid en indtægt.
En løbetur kan kræve fysisk energi.
Men den kan samtidig skabe glæde, ro og mentalt overskud.
Et socialt arrangement kan give energi, hvis du er sammen med mennesker, du føler dig tryg ved.
Det samme arrangement kan kræve enormt meget, hvis du allerede er træt, eller hvis du føler, at du skal præstere hele aftenen.
At arbejde kan være krævende.
Men meningsfuldt arbejde kan også give energi.
Og hvile kan være nødvendigt.
Men hvis du bruger hele dagen på sofaen og samtidig slår dig selv oven i hovedet, er det ikke sikkert, at du oplever den som genopbyggende.
Der er altså ikke noget, der automatisk er grønt eller rødt.
Det afgørende spørgsmål er:
Hvad gør det ved dig?
Hvad kræver det?
Hvad giver det tilbage?
Og passer det til den mængde energi, du har til rådighed lige nu?
Det er præcis derfor, der ikke findes en standardenergibank.
Din Energibank er personlig.
Lån, buffer og renter
Du kan godt bruge mere energi, end du skaber, i en periode.
Det kan være nødvendigt.
Du kan have en travl arbejdsuge.
En stor lancering.
En flytning.
Sygdom i familien.
Eller en periode, hvor livet ganske enkelt kræver mere.
Det svarer til at låne fra banken.
Et lån i ny og næ er ikke nødvendigvis et problem.
Problemet opstår, hvis du fortsætter med at låne uden at betale tilbage.
Så kommer renterne.
Du bliver måske mere træt.
Mere irritabel.
Mindre kreativ.
Du mister overblikket.
Søvnen bliver dårligere.
Og de ting, du normalt kan håndtere, begynder at føles større.
Hvis du omvendt over tid sørger for at skabe mere energi, end du bruger, opbygger du en buffer.
En buffer betyder ikke, at du aldrig bliver presset.
Men det betyder, at du bedre kan håndtere en travl uge eller en uventet udfordring uden at kontoen straks går i minus.
Din første opgave er ikke at ændre alt
Efter denne rundtur kan du måske allerede se flere ting, du gerne vil ændre.
Men du skal ikke begynde at optimere hele dit liv endnu.
Først skal du lære at observere.
Hvornår bruger du energi?
Hvornår skaber du energi?
Hvad giver mere tilbage, end du forventede?
Og hvad koster mere, end du havde regnet med?
For før du kan forvalte din energi anderledes, skal du først forstå, hvor den bevæger sig hen.
I næste lektion skal vi kigge på kroppens sprog.
For når du gennem længere tid bruger mere energi, end du skaber, begynder kroppen at sende beskeder.
Først stille.
Så tydeligere.
Og hvis du fortsat ikke lytter, kan den til sidst blive nødt til at råbe.
Det er det, jeg kalder:
Rykker 1.
Rykker 2.
Og inkasso.$x$
where not exists (select 1 from video_opgaver where titel like $x$4.2 %$x$);
update video_opgaver set manus_tekst = $x$I sidste lektion blev du introduceret til Energibanken.
Nu skal vi kigge nærmere på, hvordan banken er bygget op.
[Vis Energibanken]
Energibanken består grundlæggende af to sider:
Det, der kræver energi.
Og det, der skaber energi.
Du kan også tænke på det som udgifter og indtægter.
På udgiftssiden ligger alt det, du bruger energi på.
På indtægtssiden ligger det, der tilfører energi, hjælper dig med at genopbygge den eller gør det lettere for kroppen at håndtere det, du kræver af den.
Det lyder måske simpelt.
Men det er vigtigt, at vi skelner mellem de to sider.
For mange af os er virkelig gode til at holde øje med vores økonomiske konto.
Vi ved nogenlunde, hvad der går ind.
Vi ved, hvad der går ud.
Og hvis kontoen nærmer sig nul, begynder vi at justere.
Men vi kan bruge energi fra morgen til aften uden nogensinde at stoppe op og undersøge, hvad der egentlig sker på energikontoen.
Vi fortsætter bare.
Indtil kroppen begynder at protestere.
Det, der kræver energi
Vi begynder på den side af banken, hvor energien bliver brugt.
Her deler vi det op i to hovedområder:
Fysisk bevægelse.
Og mental bevægelse.
Når jeg siger bevægelse, mener jeg ikke kun motion.
Jeg mener alt det, der sætter din krop, din hjerne eller dit nervesystem i arbejde.
Fysisk bevægelse
Fysisk bevægelse er alt det, kroppen bruger energi på fysisk.
Det kan være:
At arbejde.
At gå.
At stå.
At løfte.
At træne.
At gøre rent.
At køre bil i mange timer.
At passe børn.
At være syg.
At have smerter.
At restituere efter sygdom eller træning.
Og alle de praktiske ting, du bruger kroppen på i løbet af en dag.
Noget af det er nemt at få øje på.
Du ved sandsynligvis godt, at en lang arbejdsdag eller en hård træning kræver energi.
Men noget fysisk energiforbrug er mindre synligt.
Det kræver også energi at have smerter.
At spænde i kroppen.
At være i støjende omgivelser.
At blive afbrudt hele tiden.
Eller at være fysisk på, uden at du reelt holder pause.
Fysisk bevægelse er ikke forkert.
Vi har brug for at bevæge os.
Vi har brug for at arbejde, bruge kroppen og gøre ting.
Men al bevægelse kræver energi.
Derfor er spørgsmålet ikke:
“Er fysisk bevægelse godt eller dårligt?”
Spørgsmålet er:
“Har jeg energi til det, jeg kræver af kroppen lige nu?”
Og:
“Får jeg mulighed for at genopbygge energien bagefter?”
Mental bevægelse
Den anden del af udgiftssiden er mental bevægelse.
Og den bliver meget ofte overset.
Mental bevægelse er alt det, du bruger hovedet og nervesystemet på.
Det kan være:
At tænke.
At planlægge.
At tage beslutninger.
At løse problemer.
At skifte mellem mange opgaver.
At bekymre sig.
At overtænke.
At forsøge at forudsige, hvad der kan gå galt.
At holde styr på andre mennesker.
At tilpasse sig.
At holde følelser eller meninger tilbage.
Eller at gå rundt med løse ender, du aldrig får lukket.
Du kan altså godt sidde helt stille på en stol og samtidig bruge enormt meget energi.
Din kalender kan se tom ud.
Men dit hoved kan være på overarbejde.
Det er derfor, tid og energi ikke er det samme.
Du kan godt have en ledig time uden at have den mentale kapacitet til at læse, være kreativ, tage en vigtig beslutning eller optage en video.
For selvom tiden er ledig, er energien måske allerede brugt.
Mental bevægelse kræver lige så reel energi som fysisk bevægelse.
Den er bare sværere at se.
Det er også her, mange af de energityve, vi senere skal arbejde med, befinder sig.
Overtænkeren.
Antageren.
Pleaseren.
Kontrolløren.
Den indre kritiker.
Og alle de tanker, vi bruger på ting, vi ikke selv kan styre.
Det, der skaber energi
Nu går vi over på den anden side af banken.
Det, der skaber energi.
Her arbejder vi med fire overordnede områder:
Kost og væske.
Ro og hvile.
Glæde.
Udtryk.
Kost og væske
Din krop skal have noget at skabe energi af.
Derfor er kost og væske en grundlæggende del af Energibanken.
Det handler ikke om en perfekt kostplan.
Det handler om, hvorvidt du giver kroppen stabil adgang til det, den har brug for.
Får du spist?
Får du spist nok?
Får du væske?
Og giver det, du spiser og drikker, dig stabil energi?
Eller forsøger du at holde dig kørende på kaffe, sukker og hurtige løsninger, fordi kontoen allerede er ved at være tom?
Mad og væske er ikke hele løsningen.
Men kroppen kan ikke skabe energi ud af ingenting.
Ro og hvile
Ro og hvile er ikke bare fraværet af arbejde.
Du kan godt ligge på sofaen og stadig være i fuld mental bevægelse.
Du kan scrolle.
Planlægge.
Bekymre dig.
Besvare beskeder.
Eller gennemgå dagen inde i hovedet.
Fysisk ro betyder, at kroppen får mulighed for at sænke belastningen.
Mental ro betyder, at hjernen ikke hele tiden skal løse, registrere eller reagere på noget.
Begge dele er nødvendige.
Men ro ser ikke ens ud for alle.
For nogle kan stilhed og meditation skabe ro.
For andre kan det være en gåtur, dans, styrketræning, sang eller kreativitet, fordi kroppen først har brug for at få afløb for noget af den energi, der er fanget.
Glæde og mening
Det, der gør dig glad, er ikke bare pynt på livet.
Det er en del af det, der skaber energi.
Musik.
Natur.
Kreativitet.
Humor.
Fordybelse.
Mennesker, du kan være dig selv sammen med.
Eller oplevelsen af, at det, du bruger dit liv på, giver mening.
Derfor arbejdede du allerede i Modul 2 med, hvad der gør dig glad.
For hvis alt i din hverdag kræver noget af dig, men næsten intet giver noget tilbage, bliver balancen svær at opretholde.
Du skal ikke leve et liv, hvor alt er sjovt.
Men der skal være noget i dit liv, der føles værd at bruge energien på.
Udtryk
Vi mennesker tager hele tiden indtryk ind.
Vi ser.
Hører.
Registrerer.
Tænker.
Mærker.
Og reagerer.
Men vi har også brug for at få noget ud.
Det kan være gennem samtaler.
Sang.
Dans.
Musik.
Kreativitet.
Bevægelse.
Skrift.
Gråd.
Humor.
At sige sin mening.
Eller at fortælle nogen, hvordan man faktisk har det.
Hvis vi bliver ved med at tage indtryk ind uden at få lov til at udtrykke noget, kan der opstå et pres.
Derfor er udtryk ikke bare noget kreativt eller kunstnerisk.
Det er en måde at regulere og skabe bevægelse i det, vi går rundt med.
Det er ikke sort eller hvidt
Det er vigtigt, at du ikke begynder at placere alle aktiviteter i faste kasser.
Noget er ikke altid en udgift.
Og noget er ikke altid en indtægt.
En løbetur kan kræve fysisk energi.
Men den kan samtidig skabe glæde, ro og mentalt overskud.
Et socialt arrangement kan give energi, hvis du er sammen med mennesker, du føler dig tryg ved.
Det samme arrangement kan kræve enormt meget, hvis du allerede er træt, eller hvis du føler, at du skal præstere hele aftenen.
At arbejde kan være krævende.
Men meningsfuldt arbejde kan også give energi.
Og hvile kan være nødvendigt.
Men hvis du bruger hele dagen på sofaen og samtidig slår dig selv oven i hovedet, er det ikke sikkert, at du oplever den som genopbyggende.
Der er altså ikke noget, der automatisk er grønt eller rødt.
Det afgørende spørgsmål er:
Hvad gør det ved dig?
Hvad kræver det?
Hvad giver det tilbage?
Og passer det til den mængde energi, du har til rådighed lige nu?
Det er præcis derfor, der ikke findes en standardenergibank.
Din Energibank er personlig.
Lån, buffer og renter
Du kan godt bruge mere energi, end du skaber, i en periode.
Det kan være nødvendigt.
Du kan have en travl arbejdsuge.
En stor lancering.
En flytning.
Sygdom i familien.
Eller en periode, hvor livet ganske enkelt kræver mere.
Det svarer til at låne fra banken.
Et lån i ny og næ er ikke nødvendigvis et problem.
Problemet opstår, hvis du fortsætter med at låne uden at betale tilbage.
Så kommer renterne.
Du bliver måske mere træt.
Mere irritabel.
Mindre kreativ.
Du mister overblikket.
Søvnen bliver dårligere.
Og de ting, du normalt kan håndtere, begynder at føles større.
Hvis du omvendt over tid sørger for at skabe mere energi, end du bruger, opbygger du en buffer.
En buffer betyder ikke, at du aldrig bliver presset.
Men det betyder, at du bedre kan håndtere en travl uge eller en uventet udfordring uden at kontoen straks går i minus.
Din første opgave er ikke at ændre alt
Efter denne rundtur kan du måske allerede se flere ting, du gerne vil ændre.
Men du skal ikke begynde at optimere hele dit liv endnu.
Først skal du lære at observere.
Hvornår bruger du energi?
Hvornår skaber du energi?
Hvad giver mere tilbage, end du forventede?
Og hvad koster mere, end du havde regnet med?
For før du kan forvalte din energi anderledes, skal du først forstå, hvor den bevæger sig hen.
I næste lektion skal vi kigge på kroppens sprog.
For når du gennem længere tid bruger mere energi, end du skaber, begynder kroppen at sende beskeder.
Først stille.
Så tydeligere.
Og hvis du fortsat ikke lytter, kan den til sidst blive nødt til at råbe.
Det er det, jeg kalder:
Rykker 1.
Rykker 2.
Og inkasso.$x$ where titel like $x$4.2 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$4.3 · Kroppens sprog: Rykker 1, Rykker 2 & inkasso$x$, $x$Modul 4 · Energibanken$x$, $x$KLIPPE-BRIEF · Lektion 4.3 · Kroppens sprog: Rykker 1, Rykker 2 & inkasso
Modul: Modul 4 · Energibanken
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 4-3-kroppens-sprog-rykker-1-rykker-2-inkasso.mp4
Kernen: M4-L3-kroppens-sprog-rykker-1-rykker-2-inkasso-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M4-L3-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M4-L3-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$I sidste lektion tog vi en rundtur i Energibanken.
Du så, at kontoen hele tiden bliver påvirket af det, der kræver energi, og det, der skaber energi.
Men hvordan ved du egentlig, at du over tid har brugt mere, end du har sat ind?
Det fortæller kroppen dig.
Kroppen arbejder 24 timer i døgnet for at passe på dig.
Den regulerer.
Kompenserer.
Tilpasser sig.
Og forsøger hele tiden at skabe balance med de ressourcer, den har til rådighed.
Men kroppen taler ikke dansk.
Den sender ikke en besked i e-Boks med teksten:
“Hej. Du har brugt lidt for meget energi de sidste tre uger. Vil du være sød at ændre noget?”
Den kommunikerer gennem signaler.
Det kan være træthed.
Uro.
Irritation.
Sult og trang til hurtig energi.
Søvnproblemer.
Spændinger.
Smerter.
Fordøjelsesproblemer.
Koncentrationsbesvær.
Eller en oplevelse af, at du ikke længere kan overskue ting, du normalt godt kan håndtere.
Det betyder ikke, at alle symptomer altid skyldes, at din Energibank er tom.
Symptomer og sygdom skal naturligvis tages alvorligt og vurderes fagligt, når det er nødvendigt.
Men kroppens signaler er værdifuld information.
De fortæller dig, at der er noget, du skal stoppe op og undersøge.
For kroppen er ikke din modstander.
Den forsøger ikke at ødelægge din dag.
Den forsøger at få din opmærksomhed.
Det er derfor, jeg har valgt at kalde kroppens signaler for:
Rykker 1.
Rykker 2.
Og inkasso.
Ligesom med en økonomisk konto får du ikke nødvendigvis den største regning som det første.
Først kommer der ofte en lille besked.
Hvis du reagerer på den, kan du måske justere, før regningen vokser.
Men hvis du fortsætter med at bruge mere energi, end du har, kan kroppen blive nødt til at skrue op.
Shinebarometeret og rykkersystemet
Inden vi går videre, skal vi lige skelne mellem Shinebarometeret og rykkersystemet.
De er to forskellige aflæsninger af den samme konto.
Shinebarometeret viser din adfærd.
Hvordan møder du verden og menneskene omkring dig lige nu?
Når du ligger højt på Shinebarometeret, har du måske lettere ved at være nærværende, kreativ, tålmodig og handlekraftig.
Når du ligger lavt, trækker du dig måske.
Du bliver kortere for hovedet.
Mister lysten til andre mennesker.
Reagerer i stedet for at vælge.
Eller har sværere ved at gøre de ting, du egentlig gerne vil.
Rykkersystemet viser kroppens signaler.
Hvad mærker du indadtil, når kontoen er ved at være tom?
Shinebarometeret viser altså, hvordan din saldo påvirker din adfærd.
Rykkersystemet viser, hvordan kroppen forsøger at fortælle dig, at saldoen er lav.
Det ene er det, du og andre kan lægge mærke til i din adfærd.
Det andet er det, du mærker i din krop.
Og begge dele kan hjælpe dig med at opdage et underskud, før det vokser sig større.
Rykker 1
Rykker 1 er de første og ofte mildere signaler.
Det er her, kroppen forsøger at få din opmærksomhed, uden at du nødvendigvis er helt slået ud.
Det kan eksempelvis være:
Du vågner og føler dig ikke rigtig frisk.
Du har mere brug for kaffe end normalt.
Du får lyst til sukker eller hurtig energi.
Du mister lettere koncentrationen.
Du har sværere ved at holde fokus.
Du bliver mere irritabel.
Du taler hurtigere.
Du har kortere lunte.
Du føler dig mere usikker og får større behov for anerkendelse.
Du spænder i nakke eller kæbe.
Du kommer hjem og går direkte omkuld på sofaen.
Eller du oplever, at små ting pludselig fylder meget mere, end de plejer.
Nogle af signalerne kan være så almindelige, at vi næsten ikke lægger mærke til dem.
Vi siger måske:
“Sådan er jeg bare.”
“Jeg er bare ikke et morgenmenneske.”
“Jeg har bare en sød tand.”
“Jeg bliver altid lidt irritabel, når jeg har travlt.”
Men det kan være værd at undersøge, om signalet ændrer sig, alt efter hvor meget energi du har på kontoen.
Måske har du ikke bare en kort lunte.
Måske har du en lunte, der bliver kortere, når din konto er lav.
Måske har du ikke nødvendigvis brug for sukker, fordi du er født med en særlig sød tand.
Måske beder kroppen om hurtig energi, fordi du har glemt at give den reel energi tidligere på dagen.
Rykker 1 betyder ikke, at alt er ved at gå galt.
Tværtimod.
Det er en mulighed for at reagere tidligt.
At undersøge:
Hvad har jeg brugt energi på?
Hvad mangler jeg?
Er der noget, jeg kan skrue ned for?
Og hvad kan jeg sætte ind på kontoen nu?
Rykker 2
Hvis du fortsætter med at bruge mere, end du har, kan kroppen begynde at skrue op.
Det er det, jeg kalder Rykker 2.
Her bliver signalerne ofte tydeligere og sværere at ignorere.
Det kan eksempelvis være:
Vedvarende hovedpine.
Mavesmerter eller fordøjelsesproblemer.
Nakkespændinger, der udvikler sig.
Dårlig eller afbrudt søvn.
Mere udtalt træthed.
Svimmelhed.
Større følelsesmæssige udsving.
Hyppigere sygdom.
Migræne.
Forkølelsessår.
Eller en oplevelse af, at du ikke længere kan samle dig om selv almindelige opgaver.
Det kan også være her, bægeret flyder over i relationer.
En lille kommentar føles pludselig enorm.
Du bliver mere reaktiv.
Konflikterne opstår lettere.
Og du har sværere ved at finde den version af dig selv frem, som du egentlig gerne vil være.
Det er vigtigt, at du ikke bruger listen som en facitliste.
Vi er forskellige.
Kroppen kan sende meget forskellige signaler fra menneske til menneske.
Og de samme signaler kan have mange forskellige årsager.
Pointen er derfor ikke, at du skal diagnosticere dig selv.
Pointen er, at du skal lære dine egne mønstre at kende.
Hvilke tegn plejer at komme først hos dig?
Og hvad sker der, hvis du ignorerer dem?
Inkasso
Inkasso er, når kroppen ikke længere nøjes med at sende en besked.
Den tvinger dig til at stoppe.
Det kan være ved stress, udbrændthed, alvorlig sygdom, sammenbrud eller en længere sygemelding.
Det er her, hvor du ikke længere bare kan tage dig sammen og fortsætte.
Du kan ikke mere.
Inkasso opstår ikke nødvendigvis fra den ene dag til den anden.
Ofte har der været signaler længe.
Små beskeder.
Rykker 1.
Tydeligere signaler.
Rykker 2.
Men hvis vi ikke opdager signalerne, ikke forstår dem eller ikke oplever, at vi har mulighed for at ændre noget, kan belastningen fortsætte med at vokse.
Inkasso er ikke kroppens straf.
Det er ikke kroppen, der svigter dig.
Det er kroppen, der ikke længere kan opretholde den måde, du har levet på.
Din krop tvinger dig ikke i knæ, fordi den hader dig.
Den gør det, fordi den forsøger at beskytte dig.
Men målet er selvfølgelig, at vi ikke behøver at vente, til kroppen råber så højt.
Målet er, at du bliver bedre til at høre den, mens den stadig taler stille.
Kroppen er din bedste ven
Vi er ofte hurtige til at tale grimt om kroppen.
“Lortekrop.”
“Min ryg er svag.”
“Min mave virker aldrig.”
“Min krop modarbejder mig.”
Men hvad nu, hvis kroppen ikke modarbejder dig?
Hvad nu, hvis den forsøger at fortælle dig noget?
Hvis du hamrer din lilletå ind i et bordben, gør det ondt.
Smerten får din opmærksomhed.
Den får dig til at ændre adfærd.
Du løfter foden.
Beskytter tåen.
Og forsøger måske at undgå bordbenet næste gang.
Forestil dig, at du ikke kunne mærke smerten.
Så kunne du blive ved med at ramme tåen igen og igen uden at reagere.
Smerten er derfor ikke bare problemet.
Den er også budbringeren.
Den fortæller dig, at noget med fordel kan ændres.
Det samme princip kan vi bruge bredere.
Når kroppen sender signaler, skal det ikke altid fortolkes som tegn på skade.
Men signalerne skal heller ikke bare overdøves og ignoreres.
De skal undersøges.
Nysgerrigt.
Ansvarligt.
Og uden automatisk at konkludere, at der er noget galt med dig som menneske.
Din personlige rykkertrappe
Derfor skal du nu begynde at lære dit eget rykkersystem at kende.
Hvilke signaler sender din krop, når kontoen begynder at blive lav?
Hvad er dine tegn på Rykker 1?
Hvad sker der, hvis du fortsætter?
Hvad er dine tegn på Rykker 2?
Og har du tidligere oplevet, at kroppen til sidst har tvunget dig til at stoppe?
Du skal ikke sammenligne dine svar med andres.
Der findes ikke én standardtrappe.
Det afgørende er, at du lærer dit eget sprog at kende.
For jo tidligere du opdager signalerne, jo flere handlemuligheder har du.
Ved Rykker 1 kan en mindre justering måske være nok.
Mere søvn.
Et ordentligt måltid.
En pause.
En samtale.
En aflyst aftale.
Mindre støj.
Eller at du sænker forventningerne til den dag.
Ved Rykker 2 kræver det måske en større ændring.
Og ved inkasso er det ofte ikke længere dig, der bestemmer tempoet.
Gå derfor videre til opgaven i appen, og beskriv dine egne signaler ved:
Rykker 1.
Rykker 2.
Og inkasso.
Det handler ikke om at blive bange for kroppen.
Det handler om at lære at samarbejde med den.
For kroppen er ikke problemet.
Den er din vigtigste informant.
I næste lektion skal vi begynde at undersøge udgiftssiden af Energibanken.
Vi starter med det mest synlige:
Det, du fysisk bruger din tid og energi på.
 
[INDSKUD — Moderne smerteforståelse (reddet fra din kladde):]
Tilbage i 1990 lavede man en undersøgelse, hvor 100 mennesker i fyrrerne — alle UDEN rygsmerter — blev lagt i en MR-scanner.
Hvor mange af dem tror du, havde diskusforandringer?
60 procent.
Tres procent gik altså rundt med en ”skade” — uden at have ondt. Allerede dengang vidste vi, at smerte ikke er lig med skade, og skade ikke nødvendigvis er lig med smerte.
Derfor arbejder jeg med to slags smerter:
• ”Giver det mening”-smerter: Du faldt på cyklen i går, og i dag er du blå og grøn. Det giver mening.
• ”Det var da egentlig lidt underligt”-smerter: Du har haft ondt i tre måneder, fået behandling — og det hjælper aldrig rigtigt.
Det er den sidste slags, der er interessant for din Energibank. Når kroppen sender den slags signaler, skal det ikke altid tolkes som tegn på skade. Men signalerne skal heller ikke bare overdøves og ignoreres. De skal undersøges.
Så næste gang du mærker ”det var da egentlig lidt underligt”-smerter, så skift ”lortekrop” ud med et spørgsmål: Hvad prøver du at fortælle mig, jeg med fordel kan ændre?$x$
where not exists (select 1 from video_opgaver where titel like $x$4.3 %$x$);
update video_opgaver set manus_tekst = $x$I sidste lektion tog vi en rundtur i Energibanken.
Du så, at kontoen hele tiden bliver påvirket af det, der kræver energi, og det, der skaber energi.
Men hvordan ved du egentlig, at du over tid har brugt mere, end du har sat ind?
Det fortæller kroppen dig.
Kroppen arbejder 24 timer i døgnet for at passe på dig.
Den regulerer.
Kompenserer.
Tilpasser sig.
Og forsøger hele tiden at skabe balance med de ressourcer, den har til rådighed.
Men kroppen taler ikke dansk.
Den sender ikke en besked i e-Boks med teksten:
“Hej. Du har brugt lidt for meget energi de sidste tre uger. Vil du være sød at ændre noget?”
Den kommunikerer gennem signaler.
Det kan være træthed.
Uro.
Irritation.
Sult og trang til hurtig energi.
Søvnproblemer.
Spændinger.
Smerter.
Fordøjelsesproblemer.
Koncentrationsbesvær.
Eller en oplevelse af, at du ikke længere kan overskue ting, du normalt godt kan håndtere.
Det betyder ikke, at alle symptomer altid skyldes, at din Energibank er tom.
Symptomer og sygdom skal naturligvis tages alvorligt og vurderes fagligt, når det er nødvendigt.
Men kroppens signaler er værdifuld information.
De fortæller dig, at der er noget, du skal stoppe op og undersøge.
For kroppen er ikke din modstander.
Den forsøger ikke at ødelægge din dag.
Den forsøger at få din opmærksomhed.
Det er derfor, jeg har valgt at kalde kroppens signaler for:
Rykker 1.
Rykker 2.
Og inkasso.
Ligesom med en økonomisk konto får du ikke nødvendigvis den største regning som det første.
Først kommer der ofte en lille besked.
Hvis du reagerer på den, kan du måske justere, før regningen vokser.
Men hvis du fortsætter med at bruge mere energi, end du har, kan kroppen blive nødt til at skrue op.
Shinebarometeret og rykkersystemet
Inden vi går videre, skal vi lige skelne mellem Shinebarometeret og rykkersystemet.
De er to forskellige aflæsninger af den samme konto.
Shinebarometeret viser din adfærd.
Hvordan møder du verden og menneskene omkring dig lige nu?
Når du ligger højt på Shinebarometeret, har du måske lettere ved at være nærværende, kreativ, tålmodig og handlekraftig.
Når du ligger lavt, trækker du dig måske.
Du bliver kortere for hovedet.
Mister lysten til andre mennesker.
Reagerer i stedet for at vælge.
Eller har sværere ved at gøre de ting, du egentlig gerne vil.
Rykkersystemet viser kroppens signaler.
Hvad mærker du indadtil, når kontoen er ved at være tom?
Shinebarometeret viser altså, hvordan din saldo påvirker din adfærd.
Rykkersystemet viser, hvordan kroppen forsøger at fortælle dig, at saldoen er lav.
Det ene er det, du og andre kan lægge mærke til i din adfærd.
Det andet er det, du mærker i din krop.
Og begge dele kan hjælpe dig med at opdage et underskud, før det vokser sig større.
Rykker 1
Rykker 1 er de første og ofte mildere signaler.
Det er her, kroppen forsøger at få din opmærksomhed, uden at du nødvendigvis er helt slået ud.
Det kan eksempelvis være:
Du vågner og føler dig ikke rigtig frisk.
Du har mere brug for kaffe end normalt.
Du får lyst til sukker eller hurtig energi.
Du mister lettere koncentrationen.
Du har sværere ved at holde fokus.
Du bliver mere irritabel.
Du taler hurtigere.
Du har kortere lunte.
Du føler dig mere usikker og får større behov for anerkendelse.
Du spænder i nakke eller kæbe.
Du kommer hjem og går direkte omkuld på sofaen.
Eller du oplever, at små ting pludselig fylder meget mere, end de plejer.
Nogle af signalerne kan være så almindelige, at vi næsten ikke lægger mærke til dem.
Vi siger måske:
“Sådan er jeg bare.”
“Jeg er bare ikke et morgenmenneske.”
“Jeg har bare en sød tand.”
“Jeg bliver altid lidt irritabel, når jeg har travlt.”
Men det kan være værd at undersøge, om signalet ændrer sig, alt efter hvor meget energi du har på kontoen.
Måske har du ikke bare en kort lunte.
Måske har du en lunte, der bliver kortere, når din konto er lav.
Måske har du ikke nødvendigvis brug for sukker, fordi du er født med en særlig sød tand.
Måske beder kroppen om hurtig energi, fordi du har glemt at give den reel energi tidligere på dagen.
Rykker 1 betyder ikke, at alt er ved at gå galt.
Tværtimod.
Det er en mulighed for at reagere tidligt.
At undersøge:
Hvad har jeg brugt energi på?
Hvad mangler jeg?
Er der noget, jeg kan skrue ned for?
Og hvad kan jeg sætte ind på kontoen nu?
Rykker 2
Hvis du fortsætter med at bruge mere, end du har, kan kroppen begynde at skrue op.
Det er det, jeg kalder Rykker 2.
Her bliver signalerne ofte tydeligere og sværere at ignorere.
Det kan eksempelvis være:
Vedvarende hovedpine.
Mavesmerter eller fordøjelsesproblemer.
Nakkespændinger, der udvikler sig.
Dårlig eller afbrudt søvn.
Mere udtalt træthed.
Svimmelhed.
Større følelsesmæssige udsving.
Hyppigere sygdom.
Migræne.
Forkølelsessår.
Eller en oplevelse af, at du ikke længere kan samle dig om selv almindelige opgaver.
Det kan også være her, bægeret flyder over i relationer.
En lille kommentar føles pludselig enorm.
Du bliver mere reaktiv.
Konflikterne opstår lettere.
Og du har sværere ved at finde den version af dig selv frem, som du egentlig gerne vil være.
Det er vigtigt, at du ikke bruger listen som en facitliste.
Vi er forskellige.
Kroppen kan sende meget forskellige signaler fra menneske til menneske.
Og de samme signaler kan have mange forskellige årsager.
Pointen er derfor ikke, at du skal diagnosticere dig selv.
Pointen er, at du skal lære dine egne mønstre at kende.
Hvilke tegn plejer at komme først hos dig?
Og hvad sker der, hvis du ignorerer dem?
Inkasso
Inkasso er, når kroppen ikke længere nøjes med at sende en besked.
Den tvinger dig til at stoppe.
Det kan være ved stress, udbrændthed, alvorlig sygdom, sammenbrud eller en længere sygemelding.
Det er her, hvor du ikke længere bare kan tage dig sammen og fortsætte.
Du kan ikke mere.
Inkasso opstår ikke nødvendigvis fra den ene dag til den anden.
Ofte har der været signaler længe.
Små beskeder.
Rykker 1.
Tydeligere signaler.
Rykker 2.
Men hvis vi ikke opdager signalerne, ikke forstår dem eller ikke oplever, at vi har mulighed for at ændre noget, kan belastningen fortsætte med at vokse.
Inkasso er ikke kroppens straf.
Det er ikke kroppen, der svigter dig.
Det er kroppen, der ikke længere kan opretholde den måde, du har levet på.
Din krop tvinger dig ikke i knæ, fordi den hader dig.
Den gør det, fordi den forsøger at beskytte dig.
Men målet er selvfølgelig, at vi ikke behøver at vente, til kroppen råber så højt.
Målet er, at du bliver bedre til at høre den, mens den stadig taler stille.
Kroppen er din bedste ven
Vi er ofte hurtige til at tale grimt om kroppen.
“Lortekrop.”
“Min ryg er svag.”
“Min mave virker aldrig.”
“Min krop modarbejder mig.”
Men hvad nu, hvis kroppen ikke modarbejder dig?
Hvad nu, hvis den forsøger at fortælle dig noget?
Hvis du hamrer din lilletå ind i et bordben, gør det ondt.
Smerten får din opmærksomhed.
Den får dig til at ændre adfærd.
Du løfter foden.
Beskytter tåen.
Og forsøger måske at undgå bordbenet næste gang.
Forestil dig, at du ikke kunne mærke smerten.
Så kunne du blive ved med at ramme tåen igen og igen uden at reagere.
Smerten er derfor ikke bare problemet.
Den er også budbringeren.
Den fortæller dig, at noget med fordel kan ændres.
Det samme princip kan vi bruge bredere.
Når kroppen sender signaler, skal det ikke altid fortolkes som tegn på skade.
Men signalerne skal heller ikke bare overdøves og ignoreres.
De skal undersøges.
Nysgerrigt.
Ansvarligt.
Og uden automatisk at konkludere, at der er noget galt med dig som menneske.
Din personlige rykkertrappe
Derfor skal du nu begynde at lære dit eget rykkersystem at kende.
Hvilke signaler sender din krop, når kontoen begynder at blive lav?
Hvad er dine tegn på Rykker 1?
Hvad sker der, hvis du fortsætter?
Hvad er dine tegn på Rykker 2?
Og har du tidligere oplevet, at kroppen til sidst har tvunget dig til at stoppe?
Du skal ikke sammenligne dine svar med andres.
Der findes ikke én standardtrappe.
Det afgørende er, at du lærer dit eget sprog at kende.
For jo tidligere du opdager signalerne, jo flere handlemuligheder har du.
Ved Rykker 1 kan en mindre justering måske være nok.
Mere søvn.
Et ordentligt måltid.
En pause.
En samtale.
En aflyst aftale.
Mindre støj.
Eller at du sænker forventningerne til den dag.
Ved Rykker 2 kræver det måske en større ændring.
Og ved inkasso er det ofte ikke længere dig, der bestemmer tempoet.
Gå derfor videre til opgaven i appen, og beskriv dine egne signaler ved:
Rykker 1.
Rykker 2.
Og inkasso.
Det handler ikke om at blive bange for kroppen.
Det handler om at lære at samarbejde med den.
For kroppen er ikke problemet.
Den er din vigtigste informant.
I næste lektion skal vi begynde at undersøge udgiftssiden af Energibanken.
Vi starter med det mest synlige:
Det, du fysisk bruger din tid og energi på.
 
[INDSKUD — Moderne smerteforståelse (reddet fra din kladde):]
Tilbage i 1990 lavede man en undersøgelse, hvor 100 mennesker i fyrrerne — alle UDEN rygsmerter — blev lagt i en MR-scanner.
Hvor mange af dem tror du, havde diskusforandringer?
60 procent.
Tres procent gik altså rundt med en ”skade” — uden at have ondt. Allerede dengang vidste vi, at smerte ikke er lig med skade, og skade ikke nødvendigvis er lig med smerte.
Derfor arbejder jeg med to slags smerter:
• ”Giver det mening”-smerter: Du faldt på cyklen i går, og i dag er du blå og grøn. Det giver mening.
• ”Det var da egentlig lidt underligt”-smerter: Du har haft ondt i tre måneder, fået behandling — og det hjælper aldrig rigtigt.
Det er den sidste slags, der er interessant for din Energibank. Når kroppen sender den slags signaler, skal det ikke altid tolkes som tegn på skade. Men signalerne skal heller ikke bare overdøves og ignoreres. De skal undersøges.
Så næste gang du mærker ”det var da egentlig lidt underligt”-smerter, så skift ”lortekrop” ud med et spørgsmål: Hvad prøver du at fortælle mig, jeg med fordel kan ændre?$x$ where titel like $x$4.3 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$4.4 · Det, der tager din energi: Fysisk bevægelse$x$, $x$Modul 4 · Energibanken$x$, $x$KLIPPE-BRIEF · Lektion 4.4 · Det, der tager din energi: Fysisk bevægelse
Modul: Modul 4 · Energibanken
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 4-4-det-der-tager-din-energi-fysisk-bevaegelse.mp4
Kernen: M4-L4-det-der-tager-din-energi-fysisk-bevaegelse-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M4-L4-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M4-L4-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Nu skal vi begynde at undersøge den side af Energibanken, hvor vi bruger energi.
Og vi starter med det mest synlige:
Fysisk bevægelse.
Når jeg siger fysisk bevægelse, tænker du måske automatisk på træning.
Men i Energibanken betyder fysisk bevægelse alt det, din krop bruger energi på.
Det er selvfølgelig, når du går, løber, løfter eller træner.
Men det er også, når du arbejder.
Kører bil.
Står op hele dagen.
Gør rent.
Pakker ordrer.
Slæber varer.
Ordner have.
Passer børn.
Eller løber fra den ene opgave til den næste uden at holde en reel pause.
Din krop bruger også energi på de processer, du ikke selv styrer.
På at fordøje din mad.
Regulere din temperatur.
Bekæmpe sygdom.
Restituere efter træning.
Håndtere smerter.
Og holde dig oprejst, mens du forsøger at få en travl hverdag til at fungere.
Fysisk bevægelse er altså alt det arbejde, kroppen udfører.
Både det, du vælger.
Og det, kroppen er nødt til at håndtere i baggrunden.
Al bevægelse kræver energi
Bevægelse er ikke forkert.
Vi er skabt til at bruge kroppen.
Og fysisk aktivitet kan give os glæde, styrke, ro og mere overskud på længere sigt.
Men selve bevægelsen kræver stadig energi.
En løbetur kan være rigtig god for dig.
Men kroppen skal stadig have energi til at gennemføre den og restituere bagefter.
En travl arbejdsdag kan føles meningsfuld.
Men den kræver stadig noget af kroppen.
En fest kan gøre dig glad.
Men du kan stadig være træt dagen efter.
Det ene udelukker ikke det andet.
Noget kan altså godt kræve energi, mens du gør det, og samtidig give noget positivt tilbage bagefter.
Derfor skal vi væk fra tanken om, at en aktivitet enten er god eller dårlig.
Det er ikke sort eller hvidt.
Det relevante spørgsmål er:
Hvad kræver aktiviteten af mig?
Hvad giver den tilbage?
Og har jeg den nødvendige energi til den lige nu?
Du kan ikke vurdere belastningen ud fra tiden alene
Vi har let ved at tænke:
“Det tager jo kun en time.”
Men én time er ikke bare én time.
En time med en rolig opgave ved et skrivebord er ikke nødvendigvis det samme som en time, hvor du underviser, er socialt på, løfter tungt eller træner intensivt.
En arbejdsdag på seks timer kan for nogle mennesker kræve mere energi end en arbejdsdag på ti timer.
Det afhænger af:
Hvad du laver.
Hvor intenst det er.
Hvor mange afbrydelser der er.
Hvilke omgivelser du befinder dig i.
Hvor meget du skal være på.
Og hvor meget energi du havde på kontoen, før du begyndte.
Der er også forskel på at udføre den samme opgave på en dag, hvor kontoen er fyldt, og på en dag, hvor du allerede ligger i overtræk.
En gåtur på fem kilometer kan føles let den ene dag.
Den samme tur kan føles uoverskuelig den næste.
Det betyder ikke nødvendigvis, at du er doven eller mangler disciplin.
Det kan betyde, at forudsætningerne har ændret sig.
Den samlede belastning tæller
Kroppen opdeler ikke nødvendigvis livet i de samme kasser, som vi gør.
Den siger ikke:
“Det her er arbejde, så det tæller på arbejdskontoen.”
“Det her er træning, så det tæller på træningskontoen.”
“Det her er sygdom, så det hører til et helt tredje sted.”
Kroppen skal håndtere det hele.
Det kaldes blandt andet den samlede kropsbelastning.
Forestil dig, at kroppen har et bæger.
En lang arbejdsdag hælder lidt i.
Dårlig søvn hælder lidt mere i.
En hård træning hælder i.
Smerter hælder i.
Støj, mange indtryk og manglende pauser hælder i.
En konflikt derhjemme hælder også i, selvom den ikke er fysisk.
Det er altså ikke nødvendigvis én enkelt ting, der får bægeret til at flyde over.
Det kan være summen af mange små belastninger over tid.
Derfor kan en aktivitet, du normalt godt kan klare, pludselig føles som for meget.
Ikke fordi aktiviteten i sig selv er blevet farlig.
Men fordi bægeret allerede er næsten fyldt.
Træning er ikke altid det rigtige svar
Vi har lært, at bevægelse er sundt.
Og det er den som udgangspunkt også.
Men mere er ikke altid bedre.
Og den samme form for bevægelse er ikke rigtig på alle tidspunkter.
Jeg har haft klienter, hvor det mest hensigtsmæssige ikke var at lægge mere træning ind.
Det var midlertidigt at tage noget væk.
Ikke fordi løb eller træning var dårligt.
Men fordi deres samlede belastning allerede var så høj, at træningen blev endnu en hævning på en konto, der stod i minus.
Det kan føles forkert.
For hvis du har lært, at træning altid er løsningen, kan det føles som at give op, når du skruer ned.
Men der er forskel på at give op og at tilpasse belastningen.
Nogle gange er en hård træning det rigtige.
Andre gange er en gåtur bedre.
Nogle gange er ti minutters bevægelse nok.
Og nogle gange har kroppen mere brug for mad, søvn eller ro end for endnu en præstation.
Det handler ikke om at finde én regel, du skal følge resten af livet.
Det handler om at kunne aflæse din konto og vælge derefter.
Arbejde er også fysisk bevægelse
Når vi taler om fysisk belastning, tænker mange kun på træning.
Men arbejdet kan være en langt større post i Energibanken.
Måske står du op i otte timer.
Måske sidder du i den samme stilling hele dagen.
Måske løfter du varer.
Måske går du mange kilometer i løbet af en arbejdsdag.
Måske holder du vejret, spænder i skuldrene og skynder dig fra opgave til opgave.
Måske tager du direkte fra arbejde til træning, praktiske opgaver og sociale aftaler.
Og måske betragter du aldrig noget af det som belastning, fordi det “bare er det, du skal”.
Men kroppen skelner ikke mellem:
Det, du gerne vil.
Det, du skal.
Og det, du føler, du burde.
Den skal stadig levere energien.
Smerter og sygdom kræver også energi
Det kræver energi at være syg.
Det kræver energi at komme sig.
Og det kræver energi at have smerter.
Hvis du har hovedpine, spændinger eller smerter i kroppen, bruger du måske også energi på at kompensere.
Du bevæger dig anderledes.
Spænder mere.
Sover dårligere.
Tænker mere over kroppen.
Eller bliver mere forsigtig i dine bevægelser.
Derfor kan du ikke altid forvente den samme præstation af dig selv, når kroppen samtidig håndterer sygdom, smerter eller restitution.
Det betyder ikke, at smerter automatisk er et tegn på, at du skal stoppe al bevægelse.
Men det betyder, at belastningen skal med i det samlede regnestykke.
Vi skal ikke være bange for kroppen.
Men vi skal heller ikke lade som om dens arbejde ikke koster energi.
Dine omgivelser påvirker også belastningen
Det er ikke kun selve opgaven, der betyder noget.
Omgivelserne kan ændre, hvor meget den kræver.
Det kan være:
Støj.
Skarpt lys.
Varme eller kulde.
Rod.
Mange mennesker.
Konstante afbrydelser.
Dårlig arbejdsstilling.
Manglende adgang til pauser.
Eller følelsen af aldrig at kunne afslutte én opgave, før den næste begynder.
To mennesker kan derfor udføre præcis den samme opgave og bruge meget forskellig energi på den.
Og den samme person kan opleve opgaven forskelligt afhængigt af omgivelserne.
Det er derfor, din Energibank skal være personlig.
Du skal ikke spørge:
“Burde det her være hårdt?”
Du skal spørge:
“Hvad gør det faktisk ved mig?”
Se på hele dagen
En af de største fejl, vi laver, er at vurdere hver aktivitet isoleret.
“Jeg kan godt klare et møde.”
“Jeg kan godt klare en træning.”
“Jeg kan godt handle ind.”
“Jeg kan godt lave mad.”
“Jeg kan godt tage til arrangementet.”
Ja, måske.
Men kan du klare det hele på den samme dag?
Og hvad har du tilbage bagefter?
Hver enkelt aktivitet kan være realistisk.
Men summen kan være urealistisk.
Derfor skal du ikke kun se på, om du kan gennemføre en opgave.
Du skal også se på:
Hvad ligger før?
Hvad ligger efter?
Hvor meget kræver hele dagen?
Og hvornår skal energien genopbygges?
Hvis du bruger al din energi på de første opgaver, bliver resten af dagen ikke gratis.
Regningen bliver bare sendt videre.
Målet er ikke at fjerne al fysisk belastning
Du kan ikke og skal ikke skabe et liv, hvor kroppen aldrig bliver udfordret.
Det ville heller ikke gøre dig stærkere.
Målet er ikke at ligge helt stille og beskytte energien mod alt.
Målet er at skabe en belastning, kroppen har mulighed for at håndtere og komme sig efter.
For lidt bevægelse kan også give problemer.
For meget kan give problemer.
Og det, der er passende i én periode, kan være for meget eller for lidt i en anden.
Derfor handler energiforvaltning om justering.
Ikke perfektion.
Begynd at lægge mærke til din fysiske konto
Inden næste lektion skal du begynde at observere:
Hvad bruger du kroppen på i løbet af en almindelig dag?
Hvornår føler du dig fysisk frisk?
Hvornår begynder energien at falde?
Hvilke aktiviteter kræver mere, end du tidligere har været bevidst om?
Hvad giver noget tilbage bagefter?
Og hvor ligger der flere fysisk krævende ting direkte efter hinanden uden plads til restitution?
Du skal ikke ændre det hele endnu.
Du skal bare begynde at se det.
For Energibanken handler ikke om at fortælle dig, at du skal gøre mindre.
Den handler om at hjælpe dig med at forstå, hvad det, du gør, kræver.
Så du kan træffe et realistisk valg om, hvad der skal blive.
Hvad der skal justeres.
Og hvad der måske kan vente.
I næste lektion skal vi kigge på den del af udgiftssiden, der er langt sværere at se:
Mental bevægelse.
For du kan sidde helt stille og samtidig bruge mere energi, end du gør på en løbetur.
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
LEKTION 4.5 — Mental bevægelse: det usynlige forbrug (NY)
I sidste lektion kiggede vi på alt det, kroppen bruger energi på.
Nu skal vi kigge på den post, der snyder os allermest.
Mental bevægelse.
For du kan sidde fuldstændig stille i en stol — og samtidig bruge mere energi, end du gør på en løbetur.
Din kalender kan se tom ud. Men dit hoved kan være på overarbejde.
Vi skal forholde os til tusindvis af beslutninger — hver eneste dag. Hvad du skal have på. Hvad du skal svare. Om du skal sige noget eller lade være. Hvad der skal bestilles hjem. Hvem der skal ringes tilbage til.
Hver enkelt beslutning er bittelille. Men de bliver hævet på den samme konto.
Og her kommer det vigtige for dig, der driver en forretning:
Rigtig mange af dine mentale udgifter er usynlige — også for dig selv.
Du tænker på varen, der ikke er kommet hjem. På om du fik svaret på den besked. På medarbejderen, der er syg i morgen. På regningen, der skal betales. Og på alle de løse ender, du aldrig rigtig får lukket.
Ingen af de ting står i din kalender. Men de kører i baggrunden hele dagen — som apps, du aldrig får lukket. Og de trækker strøm.
Lad mig give dig det tydeligste eksempel, jeg kender:
Opslaget, du har udskudt tre gange.
Et opslag, du udskyder, koster nemlig ikke kun energi den dag, du endelig laver det.
Det koster energi HVER dag, du skubber det foran dig.
Den dårlige samvittighed. Tanken ”det burde jeg altså få gjort”. Følelsen af at være bagud.
Til sidst har det dér ene opslag kostet dig mere energi, end det nogensinde ville have kostet at lave det.
Det er ikke, fordi du er doven. Det er, fordi ingen har lært dig at se den mentale side af regnskabet.
Og det er præcis derfor, du senere får en strategi med faste rammer og en fast rytme. For hver beslutning, strategien tager for dig, er en beslutning, du ikke skal hæve energi til. Det er derfor, strategi ikke er fint papirarbejde — det er energibesparelse.
Men først skal du møde dem, der står for de allerstørste hævninger på din mentale konto.
Jeg kalder dem energityvene.
Og du kender dem godt.
Øvelse i appen: Skriv tre ting ned, der har kørt i baggrunden i dit hoved i dag — som IKKE stod i din kalender. (ca. 3 min.)
LEKTION 4.6 — Energityvene (NY)
Hvis din Energibank var en rigtig bank, ville de her fem stå i køen hver eneste dag.
De kommer ikke for at sætte ind. De kommer for at hæve.
Og det frækkeste ved dem? De ligner hjælp.
1. Overtænkeren
Overtænkeren spoler frem og tilbage. Den genafspiller samtalen fra i tirsdags og producerer katastrofefilm om ting, der aldrig kommer til at ske.
På de sociale medier er det Overtænkeren, der får dig til at se din egen video fjorten gange, før du tør poste den — og bagefter overveje at slette den igen.
Overtænkeren tror, den kvalitetssikrer. Men den producerer ingenting. Den hæver bare.
2. Antageren
Antageren ved, hvad alle andre tænker. Tror den.
”De synes nok, det er pinligt, at jeg poster igen.” ”Hun tænker garanteret, at jeg er for meget.”
Sandheden? Dine følgere tænker mest på sig selv. Og på aftensmad.
Antageren laver regninger på andres vegne — og sender dem til dig.
3. Pleaseren
Pleaseren siger ja, før du overhovedet har nået at mærke efter.
Den er i familie med kamæleonen fra Modul 3 — den har bare fået arbejdstøj på. Den tager den ekstra vagt, den siger ja til arrangementet, den svarer beskeder klokken 22.
Ikke fordi du vil. Men fordi Pleaseren engang lærte, at det var sådan, man blev holdt af.
4. Kontrolløren
Kontrolløren vil styre ting, som ingen kan styre.
Vejret. Andre menneskers humør. Og — hold nu fast — algoritmen.
Du kan ikke kontrollere algoritmen. Du kan kun kontrollere dit indhold, din rytme og din energi. Alt det andet er lejeudgifter i et hus, du ikke ejer.
Hver gang Kontrolløren tjekker visningstallene for femte gang på en time, betaler du.
5. Den indre kritiker
Den indre kritiker er dommeren, der sidder klar, hver gang du har lavet noget.
”Din stemme lyder dum.” ”Du ser træt ud.” ”Det der ville en rigtig professionel aldrig have postet.”
Læg mærke til én ting: Den taler til dig på en måde, du ALDRIG ville tale til en veninde på.
Hvis du sagde de sætninger højt til et andet menneske, ville du skamme dig. Men til dig selv? Dagligt. Gratis er det bare ikke.
Sådan afvæbner du en energityv
Her er den gode nyhed: Tyvene er ikke dine fjender.
Hver eneste af dem prøvede engang at beskytte dig. Overtænkeren ville redde dig fra fejl. Antageren fra afvisning. Pleaseren fra at stå udenfor. Det er gamle vagter, der aldrig fik at vide, at faren er drevet over.
Og husker du mellemrummet fra Modul 3? Det mellem udløser og handling?
Det er dér, du fanger dem. Ikke ved at kæmpe — men ved at NAVNGIVE dem:
”Nå. Dér er Antageren igen.”
Det lyder næsten for simpelt. Men i det øjeblik, du ser tyven, er den ikke længere dig. Den er bare en gammel vane, der står i køen. Og du bestemmer, om den får lov at hæve.
Øvelse i appen: Hvem er din største energityv? I hvilke situationer kommer den? Hvad koster den dig? Og hvad vil du sige til den, næste gang du opdager den i køen? (ca. 10 min.)
LEKTION 4.7 — Indbetalingerne: det, der skaber energi (NY)
Nu har vi brugt lang tid på udgiftssiden. Med god grund — det er den, der vælter kontoen.
Men nu kommer den sjove side: indbetalingerne.
Og lad mig sige det med det samme: Det her er ikke en lektion om at leve perfekt. Det er en lektion om at sætte ind på kontoen — i en hverdag, der ser ud som din.
Kost og væske
Din krop kan ikke skabe energi ud af ingenting.
Det handler ikke om en perfekt kostplan. Det handler om tre spørgsmål: Får du spist? Får du spist nok? Og får du væske?
Kaffe og sukker kan føles som indbetalinger. Men for de fleste af os er de nærmere et hurtigt lån: De virker her og nu — og så kommer regningen senere. Undersøg, hvad der sker hos dig.
Måske kender du trangen til noget sødt om eftermiddagen? Så kan det være, at det ikke er tanden, der taler — men kontoen.
Ro — og hvorfor sofaen snyder
Ro og hvile er ikke bare fraværet af arbejde.
Du kan ligge på sofaen med telefonen og være i FULD mental bevægelse: scrolle, planlægge, bekymre dig, besvare beskeder.
Kroppen ligger stille. Kontoen bliver tømt.
Ro ser forskellig ud fra menneske til menneske. For nogle er det stilhed. For andre er det en gåtur, dans, strikning eller høj musik i bilen — fordi kroppen først skal af med noget, før den kan falde til ro. Du skal ikke finde den ”rigtige” ro. Du skal finde DIN.
Glæde og mening
Kan du huske øvelsen fra Modul 2 — hvad gør dig egentlig glad?
Det var ikke en hyggeøvelse. Det var research til i dag.
Find din liste frem. Det, der står på den, er ikke pynt på livet — det er nogle af de mest stabile indbetalinger, din konto kan få. Og hvis alt i din hverdag kræver noget af dig, men næsten intet giver tilbage, så er det ikke dig, der er noget galt med. Det er regnskabet.
Udtryk — det undervurderede indskud
Da vi blev født, var vi verdensmestre i at udtrykke os. Trætte? Vi græd. Sultne? Vi græd.
Men på et tidspunkt lærte de fleste af os, at det var smartere at holde det inde. Vi begyndte at sige pyt.
Og pyt kan være fint. Men:
Hvis vi bliver ved med at tage indtryk ind uden at få noget ud, kan der opstå et indre pres.
Vi tager indtryk ind hele dagen. Udtrykket — samtale, sang, skrift, gråd, grin eller en ærlig besked — er vejen ud igen.
Udtryk er ikke noget kunstnerisk. Det er en ventil. Og for dig, der skal lave content, er det her faktisk en fordel: At vise noget af dig selv på skærmen ER udtryk. Rigtigt brugt kan dit indhold blive en indbetaling — ikke en hævning.
Øvelse i appen: Din indbetalingsliste. Skriv 5 hurtige indskud (under 10 minutter — fx en sang, frisk luft, et glas vand og fem minutters ro) og 3 store indskud (fx en fridag, en snak med den rigtige person, en hel aften uden telefon). Listen skal hænge, hvor du kan se den. (ca. 10 min.)
LEKTION 4.8 — Din energiplan: fra viden til hverdag (NY — modulets afslutning)
Lad os lige samle det hele.
• Shinebarometeret er displayet — det viser, hvor du er, gennem din adfærd.
• Rykkerne er kroppens beskeder — den fortæller dig, når saldoen er lav.
• Energibanken er regnskabet — det forklarer HVORFOR.
• Energityvene er de største hævninger — og nu kender du dem ved navn.
• Indbetalingslisten er dit værktøj — dine sikre indskud, sort på hvidt.
Nu mangler kun én ting: at det kommer ud af hovedet og ind i kalenderen.
For her er sandheden om indbetalinger:
Det, der ikke står i kalenderen, taber til det, der gør.
Din pause skal bookes som et møde. Din gåtur skal stå der som en aftale. Ikke fordi du er et regneark — men fordi du nu VED, at energien er det, alt andet bygger på.
Og så skal jeg sige noget, som måske er noget af det vigtigste i hele forløbet:
Content er arbejde.
Det er ikke noget, du skal lave i din fritid. Det er ikke noget, der skal presses ind søndag aften, når kontoen alligevel er tom.
Derfor skal det ind i arbejdsplanen — på lige fod med alle andre opgaver i din forretning.
Det er ikke en luksus. Det er en beslutning. Og du har lige lært, at hver beslutning, du træffer PÅ FORHÅND, er energi sparet.
Nu forstår vi mennesket. Nu forstår vi din energi.
NU er vi klar til strategien — den, der passer til dig, din hverdag og den konto, du faktisk har.
Energi. Strategi. Resultat. Vi ses, makker. ◆ TIL OPTAGELSEN: i kursist-versionen må afslutningen gerne være: Vi ses i næste modul, makker.
Øvelse i appen: Vælg din faste planlægningsdag (én ugedag, hvor næste uges opslag planlægges — appen minder dig om den) + book din første indbetaling i kalenderen. (ca. 5 min.)
◆ TIL OPTAGELSEN: Lektion 4.5-4.8 er nyskrevne (godkendt struktur fra UDKASTET). Ret til i DIN stemme, hvor du vil — det er dit manus.$x$
where not exists (select 1 from video_opgaver where titel like $x$4.4 %$x$);
update video_opgaver set manus_tekst = $x$Nu skal vi begynde at undersøge den side af Energibanken, hvor vi bruger energi.
Og vi starter med det mest synlige:
Fysisk bevægelse.
Når jeg siger fysisk bevægelse, tænker du måske automatisk på træning.
Men i Energibanken betyder fysisk bevægelse alt det, din krop bruger energi på.
Det er selvfølgelig, når du går, løber, løfter eller træner.
Men det er også, når du arbejder.
Kører bil.
Står op hele dagen.
Gør rent.
Pakker ordrer.
Slæber varer.
Ordner have.
Passer børn.
Eller løber fra den ene opgave til den næste uden at holde en reel pause.
Din krop bruger også energi på de processer, du ikke selv styrer.
På at fordøje din mad.
Regulere din temperatur.
Bekæmpe sygdom.
Restituere efter træning.
Håndtere smerter.
Og holde dig oprejst, mens du forsøger at få en travl hverdag til at fungere.
Fysisk bevægelse er altså alt det arbejde, kroppen udfører.
Både det, du vælger.
Og det, kroppen er nødt til at håndtere i baggrunden.
Al bevægelse kræver energi
Bevægelse er ikke forkert.
Vi er skabt til at bruge kroppen.
Og fysisk aktivitet kan give os glæde, styrke, ro og mere overskud på længere sigt.
Men selve bevægelsen kræver stadig energi.
En løbetur kan være rigtig god for dig.
Men kroppen skal stadig have energi til at gennemføre den og restituere bagefter.
En travl arbejdsdag kan føles meningsfuld.
Men den kræver stadig noget af kroppen.
En fest kan gøre dig glad.
Men du kan stadig være træt dagen efter.
Det ene udelukker ikke det andet.
Noget kan altså godt kræve energi, mens du gør det, og samtidig give noget positivt tilbage bagefter.
Derfor skal vi væk fra tanken om, at en aktivitet enten er god eller dårlig.
Det er ikke sort eller hvidt.
Det relevante spørgsmål er:
Hvad kræver aktiviteten af mig?
Hvad giver den tilbage?
Og har jeg den nødvendige energi til den lige nu?
Du kan ikke vurdere belastningen ud fra tiden alene
Vi har let ved at tænke:
“Det tager jo kun en time.”
Men én time er ikke bare én time.
En time med en rolig opgave ved et skrivebord er ikke nødvendigvis det samme som en time, hvor du underviser, er socialt på, løfter tungt eller træner intensivt.
En arbejdsdag på seks timer kan for nogle mennesker kræve mere energi end en arbejdsdag på ti timer.
Det afhænger af:
Hvad du laver.
Hvor intenst det er.
Hvor mange afbrydelser der er.
Hvilke omgivelser du befinder dig i.
Hvor meget du skal være på.
Og hvor meget energi du havde på kontoen, før du begyndte.
Der er også forskel på at udføre den samme opgave på en dag, hvor kontoen er fyldt, og på en dag, hvor du allerede ligger i overtræk.
En gåtur på fem kilometer kan føles let den ene dag.
Den samme tur kan føles uoverskuelig den næste.
Det betyder ikke nødvendigvis, at du er doven eller mangler disciplin.
Det kan betyde, at forudsætningerne har ændret sig.
Den samlede belastning tæller
Kroppen opdeler ikke nødvendigvis livet i de samme kasser, som vi gør.
Den siger ikke:
“Det her er arbejde, så det tæller på arbejdskontoen.”
“Det her er træning, så det tæller på træningskontoen.”
“Det her er sygdom, så det hører til et helt tredje sted.”
Kroppen skal håndtere det hele.
Det kaldes blandt andet den samlede kropsbelastning.
Forestil dig, at kroppen har et bæger.
En lang arbejdsdag hælder lidt i.
Dårlig søvn hælder lidt mere i.
En hård træning hælder i.
Smerter hælder i.
Støj, mange indtryk og manglende pauser hælder i.
En konflikt derhjemme hælder også i, selvom den ikke er fysisk.
Det er altså ikke nødvendigvis én enkelt ting, der får bægeret til at flyde over.
Det kan være summen af mange små belastninger over tid.
Derfor kan en aktivitet, du normalt godt kan klare, pludselig føles som for meget.
Ikke fordi aktiviteten i sig selv er blevet farlig.
Men fordi bægeret allerede er næsten fyldt.
Træning er ikke altid det rigtige svar
Vi har lært, at bevægelse er sundt.
Og det er den som udgangspunkt også.
Men mere er ikke altid bedre.
Og den samme form for bevægelse er ikke rigtig på alle tidspunkter.
Jeg har haft klienter, hvor det mest hensigtsmæssige ikke var at lægge mere træning ind.
Det var midlertidigt at tage noget væk.
Ikke fordi løb eller træning var dårligt.
Men fordi deres samlede belastning allerede var så høj, at træningen blev endnu en hævning på en konto, der stod i minus.
Det kan føles forkert.
For hvis du har lært, at træning altid er løsningen, kan det føles som at give op, når du skruer ned.
Men der er forskel på at give op og at tilpasse belastningen.
Nogle gange er en hård træning det rigtige.
Andre gange er en gåtur bedre.
Nogle gange er ti minutters bevægelse nok.
Og nogle gange har kroppen mere brug for mad, søvn eller ro end for endnu en præstation.
Det handler ikke om at finde én regel, du skal følge resten af livet.
Det handler om at kunne aflæse din konto og vælge derefter.
Arbejde er også fysisk bevægelse
Når vi taler om fysisk belastning, tænker mange kun på træning.
Men arbejdet kan være en langt større post i Energibanken.
Måske står du op i otte timer.
Måske sidder du i den samme stilling hele dagen.
Måske løfter du varer.
Måske går du mange kilometer i løbet af en arbejdsdag.
Måske holder du vejret, spænder i skuldrene og skynder dig fra opgave til opgave.
Måske tager du direkte fra arbejde til træning, praktiske opgaver og sociale aftaler.
Og måske betragter du aldrig noget af det som belastning, fordi det “bare er det, du skal”.
Men kroppen skelner ikke mellem:
Det, du gerne vil.
Det, du skal.
Og det, du føler, du burde.
Den skal stadig levere energien.
Smerter og sygdom kræver også energi
Det kræver energi at være syg.
Det kræver energi at komme sig.
Og det kræver energi at have smerter.
Hvis du har hovedpine, spændinger eller smerter i kroppen, bruger du måske også energi på at kompensere.
Du bevæger dig anderledes.
Spænder mere.
Sover dårligere.
Tænker mere over kroppen.
Eller bliver mere forsigtig i dine bevægelser.
Derfor kan du ikke altid forvente den samme præstation af dig selv, når kroppen samtidig håndterer sygdom, smerter eller restitution.
Det betyder ikke, at smerter automatisk er et tegn på, at du skal stoppe al bevægelse.
Men det betyder, at belastningen skal med i det samlede regnestykke.
Vi skal ikke være bange for kroppen.
Men vi skal heller ikke lade som om dens arbejde ikke koster energi.
Dine omgivelser påvirker også belastningen
Det er ikke kun selve opgaven, der betyder noget.
Omgivelserne kan ændre, hvor meget den kræver.
Det kan være:
Støj.
Skarpt lys.
Varme eller kulde.
Rod.
Mange mennesker.
Konstante afbrydelser.
Dårlig arbejdsstilling.
Manglende adgang til pauser.
Eller følelsen af aldrig at kunne afslutte én opgave, før den næste begynder.
To mennesker kan derfor udføre præcis den samme opgave og bruge meget forskellig energi på den.
Og den samme person kan opleve opgaven forskelligt afhængigt af omgivelserne.
Det er derfor, din Energibank skal være personlig.
Du skal ikke spørge:
“Burde det her være hårdt?”
Du skal spørge:
“Hvad gør det faktisk ved mig?”
Se på hele dagen
En af de største fejl, vi laver, er at vurdere hver aktivitet isoleret.
“Jeg kan godt klare et møde.”
“Jeg kan godt klare en træning.”
“Jeg kan godt handle ind.”
“Jeg kan godt lave mad.”
“Jeg kan godt tage til arrangementet.”
Ja, måske.
Men kan du klare det hele på den samme dag?
Og hvad har du tilbage bagefter?
Hver enkelt aktivitet kan være realistisk.
Men summen kan være urealistisk.
Derfor skal du ikke kun se på, om du kan gennemføre en opgave.
Du skal også se på:
Hvad ligger før?
Hvad ligger efter?
Hvor meget kræver hele dagen?
Og hvornår skal energien genopbygges?
Hvis du bruger al din energi på de første opgaver, bliver resten af dagen ikke gratis.
Regningen bliver bare sendt videre.
Målet er ikke at fjerne al fysisk belastning
Du kan ikke og skal ikke skabe et liv, hvor kroppen aldrig bliver udfordret.
Det ville heller ikke gøre dig stærkere.
Målet er ikke at ligge helt stille og beskytte energien mod alt.
Målet er at skabe en belastning, kroppen har mulighed for at håndtere og komme sig efter.
For lidt bevægelse kan også give problemer.
For meget kan give problemer.
Og det, der er passende i én periode, kan være for meget eller for lidt i en anden.
Derfor handler energiforvaltning om justering.
Ikke perfektion.
Begynd at lægge mærke til din fysiske konto
Inden næste lektion skal du begynde at observere:
Hvad bruger du kroppen på i løbet af en almindelig dag?
Hvornår føler du dig fysisk frisk?
Hvornår begynder energien at falde?
Hvilke aktiviteter kræver mere, end du tidligere har været bevidst om?
Hvad giver noget tilbage bagefter?
Og hvor ligger der flere fysisk krævende ting direkte efter hinanden uden plads til restitution?
Du skal ikke ændre det hele endnu.
Du skal bare begynde at se det.
For Energibanken handler ikke om at fortælle dig, at du skal gøre mindre.
Den handler om at hjælpe dig med at forstå, hvad det, du gør, kræver.
Så du kan træffe et realistisk valg om, hvad der skal blive.
Hvad der skal justeres.
Og hvad der måske kan vente.
I næste lektion skal vi kigge på den del af udgiftssiden, der er langt sværere at se:
Mental bevægelse.
For du kan sidde helt stille og samtidig bruge mere energi, end du gør på en løbetur.
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
LEKTION 4.5 — Mental bevægelse: det usynlige forbrug (NY)
I sidste lektion kiggede vi på alt det, kroppen bruger energi på.
Nu skal vi kigge på den post, der snyder os allermest.
Mental bevægelse.
For du kan sidde fuldstændig stille i en stol — og samtidig bruge mere energi, end du gør på en løbetur.
Din kalender kan se tom ud. Men dit hoved kan være på overarbejde.
Vi skal forholde os til tusindvis af beslutninger — hver eneste dag. Hvad du skal have på. Hvad du skal svare. Om du skal sige noget eller lade være. Hvad der skal bestilles hjem. Hvem der skal ringes tilbage til.
Hver enkelt beslutning er bittelille. Men de bliver hævet på den samme konto.
Og her kommer det vigtige for dig, der driver en forretning:
Rigtig mange af dine mentale udgifter er usynlige — også for dig selv.
Du tænker på varen, der ikke er kommet hjem. På om du fik svaret på den besked. På medarbejderen, der er syg i morgen. På regningen, der skal betales. Og på alle de løse ender, du aldrig rigtig får lukket.
Ingen af de ting står i din kalender. Men de kører i baggrunden hele dagen — som apps, du aldrig får lukket. Og de trækker strøm.
Lad mig give dig det tydeligste eksempel, jeg kender:
Opslaget, du har udskudt tre gange.
Et opslag, du udskyder, koster nemlig ikke kun energi den dag, du endelig laver det.
Det koster energi HVER dag, du skubber det foran dig.
Den dårlige samvittighed. Tanken ”det burde jeg altså få gjort”. Følelsen af at være bagud.
Til sidst har det dér ene opslag kostet dig mere energi, end det nogensinde ville have kostet at lave det.
Det er ikke, fordi du er doven. Det er, fordi ingen har lært dig at se den mentale side af regnskabet.
Og det er præcis derfor, du senere får en strategi med faste rammer og en fast rytme. For hver beslutning, strategien tager for dig, er en beslutning, du ikke skal hæve energi til. Det er derfor, strategi ikke er fint papirarbejde — det er energibesparelse.
Men først skal du møde dem, der står for de allerstørste hævninger på din mentale konto.
Jeg kalder dem energityvene.
Og du kender dem godt.
Øvelse i appen: Skriv tre ting ned, der har kørt i baggrunden i dit hoved i dag — som IKKE stod i din kalender. (ca. 3 min.)
LEKTION 4.6 — Energityvene (NY)
Hvis din Energibank var en rigtig bank, ville de her fem stå i køen hver eneste dag.
De kommer ikke for at sætte ind. De kommer for at hæve.
Og det frækkeste ved dem? De ligner hjælp.
1. Overtænkeren
Overtænkeren spoler frem og tilbage. Den genafspiller samtalen fra i tirsdags og producerer katastrofefilm om ting, der aldrig kommer til at ske.
På de sociale medier er det Overtænkeren, der får dig til at se din egen video fjorten gange, før du tør poste den — og bagefter overveje at slette den igen.
Overtænkeren tror, den kvalitetssikrer. Men den producerer ingenting. Den hæver bare.
2. Antageren
Antageren ved, hvad alle andre tænker. Tror den.
”De synes nok, det er pinligt, at jeg poster igen.” ”Hun tænker garanteret, at jeg er for meget.”
Sandheden? Dine følgere tænker mest på sig selv. Og på aftensmad.
Antageren laver regninger på andres vegne — og sender dem til dig.
3. Pleaseren
Pleaseren siger ja, før du overhovedet har nået at mærke efter.
Den er i familie med kamæleonen fra Modul 3 — den har bare fået arbejdstøj på. Den tager den ekstra vagt, den siger ja til arrangementet, den svarer beskeder klokken 22.
Ikke fordi du vil. Men fordi Pleaseren engang lærte, at det var sådan, man blev holdt af.
4. Kontrolløren
Kontrolløren vil styre ting, som ingen kan styre.
Vejret. Andre menneskers humør. Og — hold nu fast — algoritmen.
Du kan ikke kontrollere algoritmen. Du kan kun kontrollere dit indhold, din rytme og din energi. Alt det andet er lejeudgifter i et hus, du ikke ejer.
Hver gang Kontrolløren tjekker visningstallene for femte gang på en time, betaler du.
5. Den indre kritiker
Den indre kritiker er dommeren, der sidder klar, hver gang du har lavet noget.
”Din stemme lyder dum.” ”Du ser træt ud.” ”Det der ville en rigtig professionel aldrig have postet.”
Læg mærke til én ting: Den taler til dig på en måde, du ALDRIG ville tale til en veninde på.
Hvis du sagde de sætninger højt til et andet menneske, ville du skamme dig. Men til dig selv? Dagligt. Gratis er det bare ikke.
Sådan afvæbner du en energityv
Her er den gode nyhed: Tyvene er ikke dine fjender.
Hver eneste af dem prøvede engang at beskytte dig. Overtænkeren ville redde dig fra fejl. Antageren fra afvisning. Pleaseren fra at stå udenfor. Det er gamle vagter, der aldrig fik at vide, at faren er drevet over.
Og husker du mellemrummet fra Modul 3? Det mellem udløser og handling?
Det er dér, du fanger dem. Ikke ved at kæmpe — men ved at NAVNGIVE dem:
”Nå. Dér er Antageren igen.”
Det lyder næsten for simpelt. Men i det øjeblik, du ser tyven, er den ikke længere dig. Den er bare en gammel vane, der står i køen. Og du bestemmer, om den får lov at hæve.
Øvelse i appen: Hvem er din største energityv? I hvilke situationer kommer den? Hvad koster den dig? Og hvad vil du sige til den, næste gang du opdager den i køen? (ca. 10 min.)
LEKTION 4.7 — Indbetalingerne: det, der skaber energi (NY)
Nu har vi brugt lang tid på udgiftssiden. Med god grund — det er den, der vælter kontoen.
Men nu kommer den sjove side: indbetalingerne.
Og lad mig sige det med det samme: Det her er ikke en lektion om at leve perfekt. Det er en lektion om at sætte ind på kontoen — i en hverdag, der ser ud som din.
Kost og væske
Din krop kan ikke skabe energi ud af ingenting.
Det handler ikke om en perfekt kostplan. Det handler om tre spørgsmål: Får du spist? Får du spist nok? Og får du væske?
Kaffe og sukker kan føles som indbetalinger. Men for de fleste af os er de nærmere et hurtigt lån: De virker her og nu — og så kommer regningen senere. Undersøg, hvad der sker hos dig.
Måske kender du trangen til noget sødt om eftermiddagen? Så kan det være, at det ikke er tanden, der taler — men kontoen.
Ro — og hvorfor sofaen snyder
Ro og hvile er ikke bare fraværet af arbejde.
Du kan ligge på sofaen med telefonen og være i FULD mental bevægelse: scrolle, planlægge, bekymre dig, besvare beskeder.
Kroppen ligger stille. Kontoen bliver tømt.
Ro ser forskellig ud fra menneske til menneske. For nogle er det stilhed. For andre er det en gåtur, dans, strikning eller høj musik i bilen — fordi kroppen først skal af med noget, før den kan falde til ro. Du skal ikke finde den ”rigtige” ro. Du skal finde DIN.
Glæde og mening
Kan du huske øvelsen fra Modul 2 — hvad gør dig egentlig glad?
Det var ikke en hyggeøvelse. Det var research til i dag.
Find din liste frem. Det, der står på den, er ikke pynt på livet — det er nogle af de mest stabile indbetalinger, din konto kan få. Og hvis alt i din hverdag kræver noget af dig, men næsten intet giver tilbage, så er det ikke dig, der er noget galt med. Det er regnskabet.
Udtryk — det undervurderede indskud
Da vi blev født, var vi verdensmestre i at udtrykke os. Trætte? Vi græd. Sultne? Vi græd.
Men på et tidspunkt lærte de fleste af os, at det var smartere at holde det inde. Vi begyndte at sige pyt.
Og pyt kan være fint. Men:
Hvis vi bliver ved med at tage indtryk ind uden at få noget ud, kan der opstå et indre pres.
Vi tager indtryk ind hele dagen. Udtrykket — samtale, sang, skrift, gråd, grin eller en ærlig besked — er vejen ud igen.
Udtryk er ikke noget kunstnerisk. Det er en ventil. Og for dig, der skal lave content, er det her faktisk en fordel: At vise noget af dig selv på skærmen ER udtryk. Rigtigt brugt kan dit indhold blive en indbetaling — ikke en hævning.
Øvelse i appen: Din indbetalingsliste. Skriv 5 hurtige indskud (under 10 minutter — fx en sang, frisk luft, et glas vand og fem minutters ro) og 3 store indskud (fx en fridag, en snak med den rigtige person, en hel aften uden telefon). Listen skal hænge, hvor du kan se den. (ca. 10 min.)
LEKTION 4.8 — Din energiplan: fra viden til hverdag (NY — modulets afslutning)
Lad os lige samle det hele.
• Shinebarometeret er displayet — det viser, hvor du er, gennem din adfærd.
• Rykkerne er kroppens beskeder — den fortæller dig, når saldoen er lav.
• Energibanken er regnskabet — det forklarer HVORFOR.
• Energityvene er de største hævninger — og nu kender du dem ved navn.
• Indbetalingslisten er dit værktøj — dine sikre indskud, sort på hvidt.
Nu mangler kun én ting: at det kommer ud af hovedet og ind i kalenderen.
For her er sandheden om indbetalinger:
Det, der ikke står i kalenderen, taber til det, der gør.
Din pause skal bookes som et møde. Din gåtur skal stå der som en aftale. Ikke fordi du er et regneark — men fordi du nu VED, at energien er det, alt andet bygger på.
Og så skal jeg sige noget, som måske er noget af det vigtigste i hele forløbet:
Content er arbejde.
Det er ikke noget, du skal lave i din fritid. Det er ikke noget, der skal presses ind søndag aften, når kontoen alligevel er tom.
Derfor skal det ind i arbejdsplanen — på lige fod med alle andre opgaver i din forretning.
Det er ikke en luksus. Det er en beslutning. Og du har lige lært, at hver beslutning, du træffer PÅ FORHÅND, er energi sparet.
Nu forstår vi mennesket. Nu forstår vi din energi.
NU er vi klar til strategien — den, der passer til dig, din hverdag og den konto, du faktisk har.
Energi. Strategi. Resultat. Vi ses, makker. ◆ TIL OPTAGELSEN: i kursist-versionen må afslutningen gerne være: Vi ses i næste modul, makker.
Øvelse i appen: Vælg din faste planlægningsdag (én ugedag, hvor næste uges opslag planlægges — appen minder dig om den) + book din første indbetaling i kalenderen. (ca. 5 min.)
◆ TIL OPTAGELSEN: Lektion 4.5-4.8 er nyskrevne (godkendt struktur fra UDKASTET). Ret til i DIN stemme, hvor du vil — det er dit manus.$x$ where titel like $x$4.4 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$4.5 · Mental bevægelse: det usynlige forbrug$x$, $x$Modul 4 · Energibanken$x$, $x$KLIPPE-BRIEF · Lektion 4.5 · Mental bevægelse: det usynlige forbrug
Modul: Modul 4 · Energibanken
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 4-5-mental-bevaegelse-det-usynlige-forbrug.mp4
Kernen: M4-L5-mental-bevaegelse-det-usynlige-forbrug-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M4-L5-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M4-L5-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', null
where not exists (select 1 from video_opgaver where titel like $x$4.5 %$x$);

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$4.6 · Energityvene$x$, $x$Modul 4 · Energibanken$x$, $x$KLIPPE-BRIEF · Lektion 4.6 · Energityvene
Modul: Modul 4 · Energibanken
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 4-6-energityvene.mp4
Kernen: M4-L6-energityvene-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M4-L6-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M4-L6-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', null
where not exists (select 1 from video_opgaver where titel like $x$4.6 %$x$);

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$4.7 · Indbetalingerne: det, der skaber energi$x$, $x$Modul 4 · Energibanken$x$, $x$KLIPPE-BRIEF · Lektion 4.7 · Indbetalingerne: det, der skaber energi
Modul: Modul 4 · Energibanken
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 4-7-indbetalingerne-det-der-skaber-energi.mp4
Kernen: M4-L7-indbetalingerne-det-der-skaber-energi-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M4-L7-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M4-L7-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', null
where not exists (select 1 from video_opgaver where titel like $x$4.7 %$x$);

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$4.8 · Din energiplan: fra viden til hverdag$x$, $x$Modul 4 · Energibanken$x$, $x$KLIPPE-BRIEF · Lektion 4.8 · Din energiplan: fra viden til hverdag
Modul: Modul 4 · Energibanken
Vises i: YOU GOT THIS (kursister) + I GOT YOU (Business) — bookends klippes pr. produkt
Råfil (optagelsen): 4-8-din-energiplan-fra-viden-til-hverdag.mp4
Kernen: M4-L8-din-energiplan-fra-viden-til-hverdag-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M4-L8-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M4-L8-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', null
where not exists (select 1 from video_opgaver where titel like $x$4.8 %$x$);

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$5.1 · Din strategi skal passe til DIG$x$, $x$Modul 5 · Brandstrategien$x$, $x$KLIPPE-BRIEF · Lektion 5.1 · Din strategi skal passe til DIG
Modul: Modul 5 · Brandstrategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 5-1-din-strategi-skal-passe-til-dig.mp4
Kernen: M5-L1-din-strategi-skal-passe-til-dig-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M5-L1-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M5-L1-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Måske har du tænkt undervejs: "Hvornår kommer vi til det med Instagram?"
Det gør vi nu.
Men jeg lover dig: alt det, vi har lavet indtil nu, er grunden til, at det her kommer til at virke.
Det vi skal starte med er at bygge jeres brandstrategi. Ikke en standard brandstrategi. Jeres brandstrategi.
Brandstrategien er den røde tråd og det der skaber genkendelighed i jeres content.
Ligesom hvis man tager et stykke tøj og holder hånden over mærket bagi — så skal man helst ikke være i tvivl om, hvilket mærke det er fra.
Det samme skal vi opnå med det indhold, vi laver — derfor er det vigtigt, at vi arbejder i dybden med brandstrategien, før vi laver content-strategien.
Vi skal fastlægge:
• Din drivkraft — Hvad er formålet med forretningen?
• Dine værdier — Hvilke følelser vil I gerne give jeres kunder?
• Din USP — hvad adskiller din forretning fra de andre?
• Din kernekunde — hvem er målgruppen, vi skal tale til
• Din målsætning — hvad vil vi gerne opnå?
Hvert trin svarer du på som en lille øvelse i appen — og til allersidst samler appen ALLE dine svar og bygger din færdige strategi. Du skal ikke selv holde styr på noget undervejs.$x$
where not exists (select 1 from video_opgaver where titel like $x$5.1 %$x$);
update video_opgaver set manus_tekst = $x$Måske har du tænkt undervejs: "Hvornår kommer vi til det med Instagram?"
Det gør vi nu.
Men jeg lover dig: alt det, vi har lavet indtil nu, er grunden til, at det her kommer til at virke.
Det vi skal starte med er at bygge jeres brandstrategi. Ikke en standard brandstrategi. Jeres brandstrategi.
Brandstrategien er den røde tråd og det der skaber genkendelighed i jeres content.
Ligesom hvis man tager et stykke tøj og holder hånden over mærket bagi — så skal man helst ikke være i tvivl om, hvilket mærke det er fra.
Det samme skal vi opnå med det indhold, vi laver — derfor er det vigtigt, at vi arbejder i dybden med brandstrategien, før vi laver content-strategien.
Vi skal fastlægge:
• Din drivkraft — Hvad er formålet med forretningen?
• Dine værdier — Hvilke følelser vil I gerne give jeres kunder?
• Din USP — hvad adskiller din forretning fra de andre?
• Din kernekunde — hvem er målgruppen, vi skal tale til
• Din målsætning — hvad vil vi gerne opnå?
Hvert trin svarer du på som en lille øvelse i appen — og til allersidst samler appen ALLE dine svar og bygger din færdige strategi. Du skal ikke selv holde styr på noget undervejs.$x$ where titel like $x$5.1 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$5.2 · Din drivkraft$x$, $x$Modul 5 · Brandstrategien$x$, $x$KLIPPE-BRIEF · Lektion 5.2 · Din drivkraft
Modul: Modul 5 · Brandstrategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 5-2-din-drivkraft.mp4
Kernen: M5-L2-din-drivkraft-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M5-L2-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M5-L2-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Hvis jeres forretning lukkede i morgen — hvad ville kunderne så mangle? Ikke varerne. Dem kan de købe online. Noget andet. Og det "noget andet" er grunden til, at I findes.
Store virksomheder kalder det vision og mission. Vi gør det jordnært: Hvorfor eksisterer jeres forretning?
(Er du ikke ejeren, men den, der sidder med de sociale medier? Så svar på forretningens vegne — og tag dine egne svar med. Det er dig, der skal lave indholdet.)
Og nu tænker du måske: "For at tjene penge?" Fair. Men det er ikke derfor, du åbnede den. Der findes lettere måder at tjene penge på, tro mig.
Måden vi finder svaret på hedder 6 gange hvorfor: Du svarer på spørgsmålet "hvorfor har du din forretning?" — og så spørger du "hvorfor?" til dit eget svar. Seks gange i træk.
Sådan kan det lyde: "Jeg har en tøjbutik." Hvorfor? "Fordi jeg elsker tøj." Hvorfor? "Fordi tøj kan forandre, hvordan man har det." Hvorfor betyder det noget? "Fordi jeg kan se, hvad der sker med en kvinde, der ser sig i spejlet og faktisk kan lide det, hun ser." Hvorfor er det vigtigt for dig? "Fordi jeg ved, hvordan det modsatte føles."
Og dér — omkring femte-sjette hvorfor — rammer du noget ægte. Det er jeres drivkraft.
Det behøver ikke redde verden. Det skal bare være sandt.
Og så skal din drivkraft vendes udad. For en drivkraft lever ikke inde i dit hoved — den lever i den forskel, kunderne mærker. Så spørg dig selv: Hvilken oplevelse skal kunderne have hos jer? Og hvilken forskel vil I gerne gøre for dem? Skal kunden gå derfra og føle sig set? Klædt bedre på, end de kom? Lettet, fordi de fandt gaven på ti minutter? Det er dét, din forretning i virkeligheden giver — og det er dét, dit indhold skal give videre.
Jeres drivkraft er fundamentet under resten af strategien: værdierne vokser ud af det, og jeres indhold bliver først ægte, når det peger tilbage på det. Kunder kan mærke forskel på en forretning, der sælger noget — og en forretning, der vil noget.
📱 ØVELSE I APPEN — Din drivkraft (ca. 10 min.)
Appen stiller dig disse spørgsmål:
1. Hvorfor har du din forretning? (skriv dit første, ærlige svar)
2.-6. Hvorfor? (appen spørger ind til dit eget svar — fem gange mere)
7. Gør sætningen færdig: "Vores forretning findes, fordi..."
8. Gør sætningen færdig: "Når en kunde har været hos os, skal de gå derfra med følelsen af..."$x$
where not exists (select 1 from video_opgaver where titel like $x$5.2 %$x$);
update video_opgaver set manus_tekst = $x$Hvis jeres forretning lukkede i morgen — hvad ville kunderne så mangle? Ikke varerne. Dem kan de købe online. Noget andet. Og det "noget andet" er grunden til, at I findes.
Store virksomheder kalder det vision og mission. Vi gør det jordnært: Hvorfor eksisterer jeres forretning?
(Er du ikke ejeren, men den, der sidder med de sociale medier? Så svar på forretningens vegne — og tag dine egne svar med. Det er dig, der skal lave indholdet.)
Og nu tænker du måske: "For at tjene penge?" Fair. Men det er ikke derfor, du åbnede den. Der findes lettere måder at tjene penge på, tro mig.
Måden vi finder svaret på hedder 6 gange hvorfor: Du svarer på spørgsmålet "hvorfor har du din forretning?" — og så spørger du "hvorfor?" til dit eget svar. Seks gange i træk.
Sådan kan det lyde: "Jeg har en tøjbutik." Hvorfor? "Fordi jeg elsker tøj." Hvorfor? "Fordi tøj kan forandre, hvordan man har det." Hvorfor betyder det noget? "Fordi jeg kan se, hvad der sker med en kvinde, der ser sig i spejlet og faktisk kan lide det, hun ser." Hvorfor er det vigtigt for dig? "Fordi jeg ved, hvordan det modsatte føles."
Og dér — omkring femte-sjette hvorfor — rammer du noget ægte. Det er jeres drivkraft.
Det behøver ikke redde verden. Det skal bare være sandt.
Og så skal din drivkraft vendes udad. For en drivkraft lever ikke inde i dit hoved — den lever i den forskel, kunderne mærker. Så spørg dig selv: Hvilken oplevelse skal kunderne have hos jer? Og hvilken forskel vil I gerne gøre for dem? Skal kunden gå derfra og føle sig set? Klædt bedre på, end de kom? Lettet, fordi de fandt gaven på ti minutter? Det er dét, din forretning i virkeligheden giver — og det er dét, dit indhold skal give videre.
Jeres drivkraft er fundamentet under resten af strategien: værdierne vokser ud af det, og jeres indhold bliver først ægte, når det peger tilbage på det. Kunder kan mærke forskel på en forretning, der sælger noget — og en forretning, der vil noget.
📱 ØVELSE I APPEN — Din drivkraft (ca. 10 min.)
Appen stiller dig disse spørgsmål:
1. Hvorfor har du din forretning? (skriv dit første, ærlige svar)
2.-6. Hvorfor? (appen spørger ind til dit eget svar — fem gange mere)
7. Gør sætningen færdig: "Vores forretning findes, fordi..."
8. Gør sætningen færdig: "Når en kunde har været hos os, skal de gå derfra med følelsen af..."$x$ where titel like $x$5.2 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$5.3 · Jeres værdier$x$, $x$Modul 5 · Brandstrategien$x$, $x$KLIPPE-BRIEF · Lektion 5.3 · Jeres værdier
Modul: Modul 5 · Brandstrategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 5-3-jeres-vaerdier.mp4
Kernen: M5-L3-jeres-vaerdier-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M5-L3-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M5-L3-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Hvis jeg fjernede jeres logo og navn fra alt jeres indhold — kunne kunderne så stadig se, at det var jer?
Det er dét, værdier gør. De er ikke fine ord til en rapport — de er de følelser, kunderne skal have, både når de træder ind i butikken, og når de ser jeres indhold.
Et eksempel: Jeg har arbejdet med en butiksejer, der ikke er typen, der laver polerede reels med hurtige klip. Til gengæld bliver folk set, når de kommer ind i butikken. Værdierne blev: Nærvær. Umage. Kvalitet. Tre ord — og pludselig var der ingen tvivl om, hvordan indholdet skulle føles: ægte øjebliksbilleder frem for det glittede.
En anden butik landede på: Ordentlighed. Uhøjtideligt. Perfekt uperfekt. Kan du mærke forskellen på de to butikker — bare ud fra seks ord? Det er pointen.
Sådan finder I jeres:
• Tænk på den bedste kundeoplevelse i forretningen nogensinde. Ikke det største salg — den bedste oplevelse. Hvilke ord beskriver den?
• Tænk på, hvad I aldrig kunne finde på. Jeres nej'er afslører jeres værdier lige så tydeligt som jeres ja'er.
• Vælg tre ord. Ikke fem. Hvis alt er vigtigt, er ingenting vigtigt.
Testen: Ville stamkunderne nikke og sige "ja, det er jer"? Hvis ordene kunne hænge i enhver forretning i landet, er de for tomme. "God service" er ikke en værdi — det er et minimum.
📱 ØVELSE I APPEN — Jeres værdier (ca. 10 min.)
Appen stiller dig disse spørgsmål:
1. Beskriv den bedste kundeoplevelse i jeres forretning nogensinde — hvad skete der?
2. Hvad kunne I aldrig finde på?
3. Vælg jeres tre værdier — tre ord.
(Tip: sov på dem, og læs dem igen i morgen, mens du står i forretningen — passer de stadig?)$x$
where not exists (select 1 from video_opgaver where titel like $x$5.3 %$x$);
update video_opgaver set manus_tekst = $x$Hvis jeg fjernede jeres logo og navn fra alt jeres indhold — kunne kunderne så stadig se, at det var jer?
Det er dét, værdier gør. De er ikke fine ord til en rapport — de er de følelser, kunderne skal have, både når de træder ind i butikken, og når de ser jeres indhold.
Et eksempel: Jeg har arbejdet med en butiksejer, der ikke er typen, der laver polerede reels med hurtige klip. Til gengæld bliver folk set, når de kommer ind i butikken. Værdierne blev: Nærvær. Umage. Kvalitet. Tre ord — og pludselig var der ingen tvivl om, hvordan indholdet skulle føles: ægte øjebliksbilleder frem for det glittede.
En anden butik landede på: Ordentlighed. Uhøjtideligt. Perfekt uperfekt. Kan du mærke forskellen på de to butikker — bare ud fra seks ord? Det er pointen.
Sådan finder I jeres:
• Tænk på den bedste kundeoplevelse i forretningen nogensinde. Ikke det største salg — den bedste oplevelse. Hvilke ord beskriver den?
• Tænk på, hvad I aldrig kunne finde på. Jeres nej'er afslører jeres værdier lige så tydeligt som jeres ja'er.
• Vælg tre ord. Ikke fem. Hvis alt er vigtigt, er ingenting vigtigt.
Testen: Ville stamkunderne nikke og sige "ja, det er jer"? Hvis ordene kunne hænge i enhver forretning i landet, er de for tomme. "God service" er ikke en værdi — det er et minimum.
📱 ØVELSE I APPEN — Jeres værdier (ca. 10 min.)
Appen stiller dig disse spørgsmål:
1. Beskriv den bedste kundeoplevelse i jeres forretning nogensinde — hvad skete der?
2. Hvad kunne I aldrig finde på?
3. Vælg jeres tre værdier — tre ord.
(Tip: sov på dem, og læs dem igen i morgen, mens du står i forretningen — passer de stadig?)$x$ where titel like $x$5.3 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$5.4 · Jeres USP$x$, $x$Modul 5 · Brandstrategien$x$, $x$KLIPPE-BRIEF · Lektion 5.4 · Jeres USP
Modul: Modul 5 · Brandstrategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 5-4-jeres-usp.mp4
Kernen: M5-L4-jeres-usp-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M5-L4-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M5-L4-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Jeres forretning har én ting, som ingen konkurrent, ingen kæde og ingen webshop kan kopiere.
USP betyder Unique Selling Point — det, der adskiller jeres forretning fra de andre. De fleste tænker på varerne: "Vi har mærker, de andre ikke har." Men varer kan skaffes. Priser kan matches. Beliggenhed kan kopieres.
Det eneste, der ikke kan kopieres, er jer.
Jeg havde en kunde, der sælger designertøj. Vi ledte efter USP'en i tøjet, i mærkerne, i webshoppen — og så gik det op for os: ejeren selv ER butikkens USP. Hendes smag. Hendes ærlige anmeldelser, hvor hun også siger, når noget IKKE er pengene værd. Kunderne køber ikke bare designertøj — de køber hendes blik. Da indholdet begyndte at bygge på DET, tredoblede omsætningen fra Instagram på tre måneder.
Så spørgsmålet er ikke "hvad sælger I?" men "hvorfor kommer folk tilbage til netop jeres forretning?"
Er det fagligheden? Ærligheden — at I siger fra, når noget ikke klæder kunden? Stemningen? Humoren?
(Og "jer" betyder menneskene i forretningen — ejeren, medarbejderne, de frivillige. USP'en er den, kunderne møder.)
📱 ØVELSE I APPEN — Jeres USP (ca. 5 min. + tre kundesamtaler)
Appen stiller dig disse spørgsmål:
1. Gør sætningen færdig: "Folk handler hos os, fordi..." (du må ikke svare med et produkt eller en pris)
2. Spørg tre stamkunder: "Hvorfor handler du egentlig her?" — og skriv deres svar ind. (Deres svar er tit mere præcist end dit eget.)$x$
where not exists (select 1 from video_opgaver where titel like $x$5.4 %$x$);
update video_opgaver set manus_tekst = $x$Jeres forretning har én ting, som ingen konkurrent, ingen kæde og ingen webshop kan kopiere.
USP betyder Unique Selling Point — det, der adskiller jeres forretning fra de andre. De fleste tænker på varerne: "Vi har mærker, de andre ikke har." Men varer kan skaffes. Priser kan matches. Beliggenhed kan kopieres.
Det eneste, der ikke kan kopieres, er jer.
Jeg havde en kunde, der sælger designertøj. Vi ledte efter USP'en i tøjet, i mærkerne, i webshoppen — og så gik det op for os: ejeren selv ER butikkens USP. Hendes smag. Hendes ærlige anmeldelser, hvor hun også siger, når noget IKKE er pengene værd. Kunderne køber ikke bare designertøj — de køber hendes blik. Da indholdet begyndte at bygge på DET, tredoblede omsætningen fra Instagram på tre måneder.
Så spørgsmålet er ikke "hvad sælger I?" men "hvorfor kommer folk tilbage til netop jeres forretning?"
Er det fagligheden? Ærligheden — at I siger fra, når noget ikke klæder kunden? Stemningen? Humoren?
(Og "jer" betyder menneskene i forretningen — ejeren, medarbejderne, de frivillige. USP'en er den, kunderne møder.)
📱 ØVELSE I APPEN — Jeres USP (ca. 5 min. + tre kundesamtaler)
Appen stiller dig disse spørgsmål:
1. Gør sætningen færdig: "Folk handler hos os, fordi..." (du må ikke svare med et produkt eller en pris)
2. Spørg tre stamkunder: "Hvorfor handler du egentlig her?" — og skriv deres svar ind. (Deres svar er tit mere præcist end dit eget.)$x$ where titel like $x$5.4 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$5.5 · Jeres kernekunde$x$, $x$Modul 5 · Brandstrategien$x$, $x$KLIPPE-BRIEF · Lektion 5.5 · Jeres kernekunde
Modul: Modul 5 · Brandstrategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 5-5-jeres-kernekunde.mp4
Kernen: M5-L5-jeres-kernekunde-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M5-L5-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M5-L5-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Når du taler til alle, hører ingen efter.
"Min målgruppe er kvinder mellem 25 og 70" er ikke en målgruppe — det er halvdelen af Danmark. Indhold til alle rammer ingen.
Sådan ser det ud, når det er skarpt. For en af mine kunder byggede vi kernekunden "Katrine": Hun er 42. Karrierekvinde. Har travlt. Hun gider ikke billigt bras eller smart-i-en-fart-kommunikation. Hun værdsætter tryghed, ærlighed og kvalitet — og forkælelse uden bøvl. Hun vil føle sig velklædt og lidt ekstra — men stadig som sig selv.
Kan du se, hvad der sker? Pludselig ved vi ALT om indholdet: Ærligt og roligt. Ingen råbende TILBUD-grafik. Hellere "tre looks til en travl uge" end 40 produkter på række.
Kernekunden er ikke jeres eneste kunde. Det er den kunde, I ville ønske, I havde ti flere af.
Byg jeres sådan her:
• Et navn og en alder. Ja, helt konkret. Det føles fjollet. Gør det alligevel.
• En hverdag: Hvad fylder? Hvornår ser de jeres indhold — i sofaen kl. 21 eller i frokostpausen?
• Følelser: Hvad skal de føle, når de har handlet hos jer?
• Nej'er: Hvad gider de IKKE? Det fortæller jer, hvad jeres indhold aldrig skal være.
Har I flere målgrupper — fx både mænd og kvinder, eller både mode og bolig? Så gælder tre ting:
Ét: Kig på, hvem der faktisk køber. Tit er det én person, der køber til dem begge — til hverdag, til gaver, til jul. Måske er jeres kernekunde stadig én person, der bare handler på flere hylder.
To: Nogle af jer har ligefrem to slags kunder: dem, der sælger boligen, og dem, der køber. Dem, der donerer, og dem, der handler. Medlemmer og sponsorer. Vælg den primære: den, der oftest skal se jeres indhold — og byg også den anden som målgruppe i appen ("tilføj endnu en målgruppe").
Tre — og her bliver det nemt: Fordelingen klarer søjlerne (dem bygger vi i modul 6). Hver målgruppe får sin egen produkt-serie, og I fordeler efter kassen: står den anden målgruppe for ca. en tredjedel af omsætningen, får den ca. en tredjedel af behovs-indholdet. Ikke 50/50, bare fordi der er to afdelinger. Og relations-indholdet — menneskene bag, hverdagen — det er fælles for alle og fordeles aldrig.
Og én ting til, som gør kernekunden dobbelt så brugbar: situationerne. Katrine er ikke bare en person — hun står midt i noget: en konfirmation, der nærmer sig. Et gaveræs. 20 minutter i frokostpausen. Situationerne er dér, behovene bor — og de bliver jeres bedste kilde til aktuelt indhold.
Og så testen, I skal bruge resten af livet: Hver gang I laver et opslag: "Ville Katrine stoppe op ved det her?" Ikke "synes vi selv, det er godt?" — men ville hun stoppe op?
📱 ØVELSE I APPEN — Jeres kernekunde (ca. 15 min.)
Appen stiller dig disse spørgsmål:
1. Hvad hedder personen, og hvor gammel er de? (ja, helt konkret)
2. Hvordan ser deres hverdag ud — og hvornår ser de jeres indhold?
3. Hvad skal de føle, når de har handlet hos jer?
4. Hvad gider de IKKE? (deres nej'er)
5. Nævn tre typiske situationer, hvor de får brug for jer (konfirmationen, gaveræset, den travle uge...)
6. Har I flere målgrupper? Tryk "+ Tilføj endnu en målgruppe" — appen spørger også, hvor stor en del af omsætningen den står for (så fordeler den indholdet for jer senere)$x$
where not exists (select 1 from video_opgaver where titel like $x$5.5 %$x$);
update video_opgaver set manus_tekst = $x$Når du taler til alle, hører ingen efter.
"Min målgruppe er kvinder mellem 25 og 70" er ikke en målgruppe — det er halvdelen af Danmark. Indhold til alle rammer ingen.
Sådan ser det ud, når det er skarpt. For en af mine kunder byggede vi kernekunden "Katrine": Hun er 42. Karrierekvinde. Har travlt. Hun gider ikke billigt bras eller smart-i-en-fart-kommunikation. Hun værdsætter tryghed, ærlighed og kvalitet — og forkælelse uden bøvl. Hun vil føle sig velklædt og lidt ekstra — men stadig som sig selv.
Kan du se, hvad der sker? Pludselig ved vi ALT om indholdet: Ærligt og roligt. Ingen råbende TILBUD-grafik. Hellere "tre looks til en travl uge" end 40 produkter på række.
Kernekunden er ikke jeres eneste kunde. Det er den kunde, I ville ønske, I havde ti flere af.
Byg jeres sådan her:
• Et navn og en alder. Ja, helt konkret. Det føles fjollet. Gør det alligevel.
• En hverdag: Hvad fylder? Hvornår ser de jeres indhold — i sofaen kl. 21 eller i frokostpausen?
• Følelser: Hvad skal de føle, når de har handlet hos jer?
• Nej'er: Hvad gider de IKKE? Det fortæller jer, hvad jeres indhold aldrig skal være.
Har I flere målgrupper — fx både mænd og kvinder, eller både mode og bolig? Så gælder tre ting:
Ét: Kig på, hvem der faktisk køber. Tit er det én person, der køber til dem begge — til hverdag, til gaver, til jul. Måske er jeres kernekunde stadig én person, der bare handler på flere hylder.
To: Nogle af jer har ligefrem to slags kunder: dem, der sælger boligen, og dem, der køber. Dem, der donerer, og dem, der handler. Medlemmer og sponsorer. Vælg den primære: den, der oftest skal se jeres indhold — og byg også den anden som målgruppe i appen ("tilføj endnu en målgruppe").
Tre — og her bliver det nemt: Fordelingen klarer søjlerne (dem bygger vi i modul 6). Hver målgruppe får sin egen produkt-serie, og I fordeler efter kassen: står den anden målgruppe for ca. en tredjedel af omsætningen, får den ca. en tredjedel af behovs-indholdet. Ikke 50/50, bare fordi der er to afdelinger. Og relations-indholdet — menneskene bag, hverdagen — det er fælles for alle og fordeles aldrig.
Og én ting til, som gør kernekunden dobbelt så brugbar: situationerne. Katrine er ikke bare en person — hun står midt i noget: en konfirmation, der nærmer sig. Et gaveræs. 20 minutter i frokostpausen. Situationerne er dér, behovene bor — og de bliver jeres bedste kilde til aktuelt indhold.
Og så testen, I skal bruge resten af livet: Hver gang I laver et opslag: "Ville Katrine stoppe op ved det her?" Ikke "synes vi selv, det er godt?" — men ville hun stoppe op?
📱 ØVELSE I APPEN — Jeres kernekunde (ca. 15 min.)
Appen stiller dig disse spørgsmål:
1. Hvad hedder personen, og hvor gammel er de? (ja, helt konkret)
2. Hvordan ser deres hverdag ud — og hvornår ser de jeres indhold?
3. Hvad skal de føle, når de har handlet hos jer?
4. Hvad gider de IKKE? (deres nej'er)
5. Nævn tre typiske situationer, hvor de får brug for jer (konfirmationen, gaveræset, den travle uge...)
6. Har I flere målgrupper? Tryk "+ Tilføj endnu en målgruppe" — appen spørger også, hvor stor en del af omsætningen den står for (så fordeler den indholdet for jer senere)$x$ where titel like $x$5.5 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$5.6 · Hvad er succeskriteriet?$x$, $x$Modul 5 · Brandstrategien$x$, $x$KLIPPE-BRIEF · Lektion 5.6 · Hvad er succeskriteriet?
Modul: Modul 5 · Brandstrategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 5-6-hvad-er-succeskriteriet.mp4
Kernen: M5-L6-hvad-er-succeskriteriet-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M5-L6-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M5-L6-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Nu skal vi tale om det, ingen SoMe-guru tør sige højt: I skal sandsynligvis poste MINDRE, end I tror.
Men først målsætningen — for hvad vil vi egentlig opnå? For en lokal forretning er svaret altid det samme: kunder ind ad døren. Uanset om jeres dør er en butik, en café, en bank, en klinik eller en klub. Visninger er en webshop-målsætning — de skal sælge til hele Danmark. I skal huskes af de par tusinde, der bor i nærheden.
Og lad os så tage den med det samme: at gå viralt er IKKE målet. Medmindre I har en webshop, der kan sælge til hele landet, er 100.000 visninger fra fremmede i den anden ende af Danmark bare tomme kalorier — flotte tal, nul kunder ind ad døren. Et opslag, som 300 lokale gemmer og sender til hinanden, slår et viralt hit. Hver gang. Succeskriteriet er ikke at blive set af mange — det er at blive husket af de rigtige. Sagt kortest: nogle kommer direkte ind ad døren, andre gemmer, sender, spørger eller får jer ind på radaren — men målet er at blive valgt.
Og vejen derind går gennem indholdets to jobs: skabe behov ("den skal jeg eje") og skabe relation — at folk føler, de kender jer, længe før de træder ind ad døren. For når behovet opstår, tænker de på JER. Ikke på en webshop.
Derfor måler vi ikke på visninger, men på jeres relationstal — i appen hedder det interaktionsraten: hvor mange af jeres følgere, der liker, kommenterer, gemmer og deler. Gemmer folk jeres opslag? Så har I skabt behov. Kommenterer og deler de? Så har I bygget relation. Ét tal — begge jobs.
Sådan finder I tallet — det tager fem minutter i appen: Tryk "Ny måling". Åbn Indblik på jeres seneste 9 opslag — det er præcis ét gitter på jeres forside, så I skal aldrig vælge. Tæl likes, kommentarer, gemte og delinger sammen (de to sidste er de vigtigste: et gem er et plantet behov, en deling er en anbefaling), tast dem ind sammen med følgertallet — appen regner raten ud og gemmer målingen. Og her skal I ikke jagte et branchetal — I sammenligner jer med jer selv. Mål den første i hver måned: stiger raten, virker strategien. Også selvom rækkevidden svinger.
Og så rytmen: tre opslag om ugen i tre år slår syv opslag om ugen i tre uger. Hver gang. Vær ærlig — hvad kan I faktisk holde til, også i de uger, hvor der er travlt i forretningen og en medarbejder er syg? DET tal er jeres rytme. Ikke jeres ambitiøse tal. Jeres ærlige tal. (Og er I en sæsonforretning, må rytmen gerne skrue op og ned med sæsonen — bare den er planlagt, ikke tilfældig.)
Én gang om måneden gør I så to ting. Ét: kig på tallene. Hvilken søjle fik højest interaktion? Lav mere af det — og justér det svageste (nyt hook, nyt cover; idéen fejler sjældent, det er eksekveringen, der skal skrues på). To: genbrug uden skam. Det bedste opslag fra sidste måned? Klip det om, giv det en ny vinkel, post det igen. I bliver trætte af jeres indhold længe før kunderne gør — der findes ingen slid på godt indhold.
Og så det stærkeste succestal af dem alle — det, der ikke står i nogen app: når en kunde nævner et opslag i forretningen. "Jeg så den der video med..." Skriv det ned, hver gang det sker. Sørg for, at alle i forretningen ved, hvad der kører på Instagram i denne uge — så de kan sige "den har vi faktisk vist i går". Og det, kunderne oftest spørger til? Det er næste uges indhold. Instagram og butiksgulvet skal tale sammen — det er dér, cirklen sluttes.
📱 ØVELSE I APPEN — Jeres målsætning (ca. 10 min.)
Tre ting i appen:
1. Sæt jeres uge-rytme: hvor mange opslag om ugen — og hvilke dage? (det ærlige tal, ikke det ambitiøse)
2. Tryk "Ny måling" og lav jeres første måling af interaktionsraten — så I har jeres udgangspunkt. Det tal skal vi se stige.
3. Sæt et fast måneds-tjek i kalenderen (15 min.): tallene + det, kunderne nævnte i forretningen.
Og så er brandstrategien på plads: jeres drivkraft, jeres værdier, jeres USP, jeres kernekunde og jeres målsætning. I næste modul bygger vi content-strategien — hvordan det hele bliver til indhold.$x$
where not exists (select 1 from video_opgaver where titel like $x$5.6 %$x$);
update video_opgaver set manus_tekst = $x$Nu skal vi tale om det, ingen SoMe-guru tør sige højt: I skal sandsynligvis poste MINDRE, end I tror.
Men først målsætningen — for hvad vil vi egentlig opnå? For en lokal forretning er svaret altid det samme: kunder ind ad døren. Uanset om jeres dør er en butik, en café, en bank, en klinik eller en klub. Visninger er en webshop-målsætning — de skal sælge til hele Danmark. I skal huskes af de par tusinde, der bor i nærheden.
Og lad os så tage den med det samme: at gå viralt er IKKE målet. Medmindre I har en webshop, der kan sælge til hele landet, er 100.000 visninger fra fremmede i den anden ende af Danmark bare tomme kalorier — flotte tal, nul kunder ind ad døren. Et opslag, som 300 lokale gemmer og sender til hinanden, slår et viralt hit. Hver gang. Succeskriteriet er ikke at blive set af mange — det er at blive husket af de rigtige. Sagt kortest: nogle kommer direkte ind ad døren, andre gemmer, sender, spørger eller får jer ind på radaren — men målet er at blive valgt.
Og vejen derind går gennem indholdets to jobs: skabe behov ("den skal jeg eje") og skabe relation — at folk føler, de kender jer, længe før de træder ind ad døren. For når behovet opstår, tænker de på JER. Ikke på en webshop.
Derfor måler vi ikke på visninger, men på jeres relationstal — i appen hedder det interaktionsraten: hvor mange af jeres følgere, der liker, kommenterer, gemmer og deler. Gemmer folk jeres opslag? Så har I skabt behov. Kommenterer og deler de? Så har I bygget relation. Ét tal — begge jobs.
Sådan finder I tallet — det tager fem minutter i appen: Tryk "Ny måling". Åbn Indblik på jeres seneste 9 opslag — det er præcis ét gitter på jeres forside, så I skal aldrig vælge. Tæl likes, kommentarer, gemte og delinger sammen (de to sidste er de vigtigste: et gem er et plantet behov, en deling er en anbefaling), tast dem ind sammen med følgertallet — appen regner raten ud og gemmer målingen. Og her skal I ikke jagte et branchetal — I sammenligner jer med jer selv. Mål den første i hver måned: stiger raten, virker strategien. Også selvom rækkevidden svinger.
Og så rytmen: tre opslag om ugen i tre år slår syv opslag om ugen i tre uger. Hver gang. Vær ærlig — hvad kan I faktisk holde til, også i de uger, hvor der er travlt i forretningen og en medarbejder er syg? DET tal er jeres rytme. Ikke jeres ambitiøse tal. Jeres ærlige tal. (Og er I en sæsonforretning, må rytmen gerne skrue op og ned med sæsonen — bare den er planlagt, ikke tilfældig.)
Én gang om måneden gør I så to ting. Ét: kig på tallene. Hvilken søjle fik højest interaktion? Lav mere af det — og justér det svageste (nyt hook, nyt cover; idéen fejler sjældent, det er eksekveringen, der skal skrues på). To: genbrug uden skam. Det bedste opslag fra sidste måned? Klip det om, giv det en ny vinkel, post det igen. I bliver trætte af jeres indhold længe før kunderne gør — der findes ingen slid på godt indhold.
Og så det stærkeste succestal af dem alle — det, der ikke står i nogen app: når en kunde nævner et opslag i forretningen. "Jeg så den der video med..." Skriv det ned, hver gang det sker. Sørg for, at alle i forretningen ved, hvad der kører på Instagram i denne uge — så de kan sige "den har vi faktisk vist i går". Og det, kunderne oftest spørger til? Det er næste uges indhold. Instagram og butiksgulvet skal tale sammen — det er dér, cirklen sluttes.
📱 ØVELSE I APPEN — Jeres målsætning (ca. 10 min.)
Tre ting i appen:
1. Sæt jeres uge-rytme: hvor mange opslag om ugen — og hvilke dage? (det ærlige tal, ikke det ambitiøse)
2. Tryk "Ny måling" og lav jeres første måling af interaktionsraten — så I har jeres udgangspunkt. Det tal skal vi se stige.
3. Sæt et fast måneds-tjek i kalenderen (15 min.): tallene + det, kunderne nævnte i forretningen.
Og så er brandstrategien på plads: jeres drivkraft, jeres værdier, jeres USP, jeres kernekunde og jeres målsætning. I næste modul bygger vi content-strategien — hvordan det hele bliver til indhold.$x$ where titel like $x$5.6 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$6.1 · Hvad virker i dag?$x$, $x$Modul 6 · Content-strategien$x$, $x$KLIPPE-BRIEF · Lektion 6.1 · Hvad virker i dag?
Modul: Modul 6 · Content-strategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 6-1-hvad-virker-i-dag.mp4
Kernen: M6-L1-hvad-virker-i-dag-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M6-L1-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M6-L1-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Inden vi bygger jeres content-strategi, skal du lige forstå den verden, jeres indhold skal leve i — for den har ændret sig. Meget.
Instagram startede i 2010 som en fotoapp. Man delte et billede af sin kaffe, og ens venner så det. I 2016 skiftede Instagram fra kronologisk rækkefølge til algoritme — og fotoappen blev til en underholdningsplatform. I dag er Instagram et community: At nogen følger dig, er ikke længere en garanti for, at de ser dit indhold. Instagram forsøger at vise os det indhold, platformen vurderer er mest relevant for os.
Og så kom AI — og ændrede spillet én gang til.
I dag kan hvem som helst lave "pænt" indhold på ti sekunder. Perfekte billeder, glatte tekster, professionelle videoer — AI kan lave det hele, i uendelige mængder. Og hvad sker der, når alle kan lave det samme? Så bliver det værdiløst. Alt indhold, der kan kopieres, er blevet gratis.
Det betyder, at standard tips og tricks er døde. "Post kl. 19, brug de her hashtags, lav den her trend" — det gør alle andre også. Det er usynligt.
Der er kun én ting tilbage, som ikke kan kopieres: jer. Jeres drivkraft. Jeres værdier. Jeres USP. Ejeren, der ærligt siger, hvad der IKKE er pengene værd. Medarbejderen, der kender stamkunderne ved navn. Morgenstemningen, inden forretningen åbner.
Det er derfor, autentisk indhold vinder nu — ikke fordi det er et buzzword, men fordi det er det eneste, der er knapt. Og det er derfor, folk ender med at købe hos JER: ikke fordi jeres opslag var pænest, men fordi de kunne mærke, hvem I er.
Så det er opskriften på alt, hvad vi bygger i det her modul: jeres indhold skal være noget, kun I kan lave.
📱 ØVELSE I APPEN — Hvad virker på dig? (ca. 5 min.)
Appen stiller dig disse spørgsmål:
1. Nævn tre profiler, du selv elsker at følge.
2. For hver: hvad gør de, som får dig til at blive hængende?
(Læg mærke til, hvor tit svaret er noget personligt — ikke noget perfekt.)$x$
where not exists (select 1 from video_opgaver where titel like $x$6.1 %$x$);
update video_opgaver set manus_tekst = $x$Inden vi bygger jeres content-strategi, skal du lige forstå den verden, jeres indhold skal leve i — for den har ændret sig. Meget.
Instagram startede i 2010 som en fotoapp. Man delte et billede af sin kaffe, og ens venner så det. I 2016 skiftede Instagram fra kronologisk rækkefølge til algoritme — og fotoappen blev til en underholdningsplatform. I dag er Instagram et community: At nogen følger dig, er ikke længere en garanti for, at de ser dit indhold. Instagram forsøger at vise os det indhold, platformen vurderer er mest relevant for os.
Og så kom AI — og ændrede spillet én gang til.
I dag kan hvem som helst lave "pænt" indhold på ti sekunder. Perfekte billeder, glatte tekster, professionelle videoer — AI kan lave det hele, i uendelige mængder. Og hvad sker der, når alle kan lave det samme? Så bliver det værdiløst. Alt indhold, der kan kopieres, er blevet gratis.
Det betyder, at standard tips og tricks er døde. "Post kl. 19, brug de her hashtags, lav den her trend" — det gør alle andre også. Det er usynligt.
Der er kun én ting tilbage, som ikke kan kopieres: jer. Jeres drivkraft. Jeres værdier. Jeres USP. Ejeren, der ærligt siger, hvad der IKKE er pengene værd. Medarbejderen, der kender stamkunderne ved navn. Morgenstemningen, inden forretningen åbner.
Det er derfor, autentisk indhold vinder nu — ikke fordi det er et buzzword, men fordi det er det eneste, der er knapt. Og det er derfor, folk ender med at købe hos JER: ikke fordi jeres opslag var pænest, men fordi de kunne mærke, hvem I er.
Så det er opskriften på alt, hvad vi bygger i det her modul: jeres indhold skal være noget, kun I kan lave.
📱 ØVELSE I APPEN — Hvad virker på dig? (ca. 5 min.)
Appen stiller dig disse spørgsmål:
1. Nævn tre profiler, du selv elsker at følge.
2. For hver: hvad gør de, som får dig til at blive hængende?
(Læg mærke til, hvor tit svaret er noget personligt — ikke noget perfekt.)$x$ where titel like $x$6.1 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$6.2 · De to indholdstyper — og de fire indholdssøjler$x$, $x$Modul 6 · Content-strategien$x$, $x$KLIPPE-BRIEF · Lektion 6.2 · De to indholdstyper — og de fire indholdssøjler
Modul: Modul 6 · Content-strategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 6-2-de-to-indholdstyper-og-de-fire-indholdssoejler.mp4
Kernen: M6-L2-de-to-indholdstyper-og-de-fire-indholdssoejler-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M6-L2-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M6-L2-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Jeg vil i denne lektion introducere jer for Energidas Contentmodel — en model, der er bygget til virksomheder på de sociale medier.
Der findes to overordnede indholdstyper for detail:
1. Indhold der skaber behov
2. Indhold der danner relation
Og de to indholdstyper bliver til fire faste indholdssøjler.
SKABE BEHOV handler om at få kunden til at forstå, hvorfor de har brug for det, I tilbyder. Her arbejder I med to søjler:
Søjle 1 — Kundens behov og situation. Denne søjle tager udgangspunkt i målgruppen fra jeres brandstrategi. Hvad står kunden i lige nu? Hvad har de brug for hjælp til? Hvad spørger de om? Hvad sker der i kalenderen, sæsonen eller hverdagen, som gør jeres indhold relevant?
Kundens reaktion skal være: "Wow — de ser mig og giver mig det, jeg har brug for."
Søjle 2 — Produktet. Denne søjle tager udgangspunkt i de produkter, I gerne vil sætte fokus på. Her viser I ikke bare varen — I viser, hvorfor varen er relevant, værdifuld og værd at vælge. Produktindholdet skal hænge sammen med jeres USP, så kunderne forstår, hvorfor netop jeres udvalg, kvalitet, service eller måde at vælge varer på gør en forskel.
Kundens reaktion skal være: "Den vil jeg have."
DANNE RELATION handler om at få kunden til at forstå, hvorfor de skal købe hos JER. Her arbejder I med to søjler:
Søjle 3 — Branding. Denne søjle tager udgangspunkt i jeres drivkraft — og tager kunden med bagom forretningen. Her viser I, hvordan jeres hvorfor afspejler sig i hverdagen: Hvordan driver I forretning? Hvad går I op i? Hvad står bag jeres valg, jeres sortiment, jeres service og jeres måde at møde kunderne på — alt det, kunden aldrig ser fra butiksgulvet?
Og denne søjle har noget særligt: formatet ligger fast — altid Story. Stories er bygget til behind the scenes: råt, ægte og væk efter 24 timer, så der er nul produktionspres. Og stories når netop dem, der allerede følger jer — præcis dem, relationen skal bygges med. Gem de bedste som highlights, så ligger "hvem er I?" permanent øverst på jeres profil.
Kundens reaktion skal være: "Okay — det vidste jeg ikke om dem. Nu forstår jeg, hvorfor de gør det."
Søjle 4 — Community & værdier. Denne søjle tager udgangspunkt i jeres værdier. Her viser I værdierne i praksis: gennem inddragelse, lokale fællesskaber, holdninger, kundernes spørgsmål, små hverdagsøjeblikke — og måden, I skaber stemning omkring forretningen på.
Kundens reaktion skal være: "Dem kan jeg godt lide — dem vil jeg være kunde hos."
Kan I se broen? Brandstrategien har fire byggesten (målsætningen er jeres kompas — mål, ikke byggesten) — og indholdet har fire søjler. Én byggesten pr. søjle: målgruppen → kundens behov og situation · USP'en → produktet · drivkraften → branding · værdierne → community. Intet skal opfindes. Alt skal oversættes.
Den vigtige regel: alle skal lave 4 indholdssøjler. Tre af dem bor i feedet — kundens situation, produktet og community — og når man kigger ned over feedet, skal alle tre være repræsenteret. Den fjerde, branding, bor i stories og highlights. Så viser profilen det hele: hvem kunden er · hvad I sælger · hvorfor I gør det · hvad man bliver en del af, når man handler hos jer.
Hvorfor er det så vigtigt at vælge formålet, FØR man laver opslaget? Fordi formålet bestemmer alt: hvad man viser, hvordan man slutter — og hvad kunden skal gøre bagefter.
Der findes fire handlinger, I kan bede om — og de er alle sammen konkrete:
• Kommer ind i forretningen — selve målet: "Kom forbi og prøv den."
• Gemmer opslaget — behovet er plantet: "Gem den til din næste bytur."
• Sender til en ven: "Send til én, der har brug for det her."
• Kommenterer eller skriver til jer — relationen bliver stærkere: "Hvilken ville du vælge?" Og husk: mange svarer privat. Et svar på jeres story eller en besked i DM tæller mindst lige så meget som en kommentar.
Som tommelfingerregel: produkt-søjlen → gem eller kom ind. Situations-søjlen → gem eller send. Relations-søjlerne → kommentér eller skriv. Og vælg altid kun ÉN pr. opslag. Og de handlinger er algoritmens valuta: hver gang nogen gemmer, sender eller kommenterer, fortæller de algoritmen "det her er værdifuldt" — og så viser den jer til flere.
Og så en vigtig frihed, inden nogen misforstår: produktindhold må gerne fylde meget — når det giver værdi, inspiration eller beslutningshjælp. Det er kun den rene tilbudsavis ("Køb. 799 kr.") der skal holdes under 10 %.
I de næste tre lektioner lærer du først behovets to søjler — og så relationens to.
📱 ØVELSE I APPEN — Kend typerne (ca. 5 min.)
Appen stiller dig disse spørgsmål:
1. Kig på jeres seneste fem opslag: hvad gjorde hvert af dem — skabte det behov, dannede det relation, eller ingen af delene?
2. Hvad skulle kunden gøre efter hvert opslag? (Hvis du ikke kan svare, kunne kunden heller ikke.)$x$
where not exists (select 1 from video_opgaver where titel like $x$6.2 %$x$);
update video_opgaver set manus_tekst = $x$Jeg vil i denne lektion introducere jer for Energidas Contentmodel — en model, der er bygget til virksomheder på de sociale medier.
Der findes to overordnede indholdstyper for detail:
1. Indhold der skaber behov
2. Indhold der danner relation
Og de to indholdstyper bliver til fire faste indholdssøjler.
SKABE BEHOV handler om at få kunden til at forstå, hvorfor de har brug for det, I tilbyder. Her arbejder I med to søjler:
Søjle 1 — Kundens behov og situation. Denne søjle tager udgangspunkt i målgruppen fra jeres brandstrategi. Hvad står kunden i lige nu? Hvad har de brug for hjælp til? Hvad spørger de om? Hvad sker der i kalenderen, sæsonen eller hverdagen, som gør jeres indhold relevant?
Kundens reaktion skal være: "Wow — de ser mig og giver mig det, jeg har brug for."
Søjle 2 — Produktet. Denne søjle tager udgangspunkt i de produkter, I gerne vil sætte fokus på. Her viser I ikke bare varen — I viser, hvorfor varen er relevant, værdifuld og værd at vælge. Produktindholdet skal hænge sammen med jeres USP, så kunderne forstår, hvorfor netop jeres udvalg, kvalitet, service eller måde at vælge varer på gør en forskel.
Kundens reaktion skal være: "Den vil jeg have."
DANNE RELATION handler om at få kunden til at forstå, hvorfor de skal købe hos JER. Her arbejder I med to søjler:
Søjle 3 — Branding. Denne søjle tager udgangspunkt i jeres drivkraft — og tager kunden med bagom forretningen. Her viser I, hvordan jeres hvorfor afspejler sig i hverdagen: Hvordan driver I forretning? Hvad går I op i? Hvad står bag jeres valg, jeres sortiment, jeres service og jeres måde at møde kunderne på — alt det, kunden aldrig ser fra butiksgulvet?
Og denne søjle har noget særligt: formatet ligger fast — altid Story. Stories er bygget til behind the scenes: råt, ægte og væk efter 24 timer, så der er nul produktionspres. Og stories når netop dem, der allerede følger jer — præcis dem, relationen skal bygges med. Gem de bedste som highlights, så ligger "hvem er I?" permanent øverst på jeres profil.
Kundens reaktion skal være: "Okay — det vidste jeg ikke om dem. Nu forstår jeg, hvorfor de gør det."
Søjle 4 — Community & værdier. Denne søjle tager udgangspunkt i jeres værdier. Her viser I værdierne i praksis: gennem inddragelse, lokale fællesskaber, holdninger, kundernes spørgsmål, små hverdagsøjeblikke — og måden, I skaber stemning omkring forretningen på.
Kundens reaktion skal være: "Dem kan jeg godt lide — dem vil jeg være kunde hos."
Kan I se broen? Brandstrategien har fire byggesten (målsætningen er jeres kompas — mål, ikke byggesten) — og indholdet har fire søjler. Én byggesten pr. søjle: målgruppen → kundens behov og situation · USP'en → produktet · drivkraften → branding · værdierne → community. Intet skal opfindes. Alt skal oversættes.
Den vigtige regel: alle skal lave 4 indholdssøjler. Tre af dem bor i feedet — kundens situation, produktet og community — og når man kigger ned over feedet, skal alle tre være repræsenteret. Den fjerde, branding, bor i stories og highlights. Så viser profilen det hele: hvem kunden er · hvad I sælger · hvorfor I gør det · hvad man bliver en del af, når man handler hos jer.
Hvorfor er det så vigtigt at vælge formålet, FØR man laver opslaget? Fordi formålet bestemmer alt: hvad man viser, hvordan man slutter — og hvad kunden skal gøre bagefter.
Der findes fire handlinger, I kan bede om — og de er alle sammen konkrete:
• Kommer ind i forretningen — selve målet: "Kom forbi og prøv den."
• Gemmer opslaget — behovet er plantet: "Gem den til din næste bytur."
• Sender til en ven: "Send til én, der har brug for det her."
• Kommenterer eller skriver til jer — relationen bliver stærkere: "Hvilken ville du vælge?" Og husk: mange svarer privat. Et svar på jeres story eller en besked i DM tæller mindst lige så meget som en kommentar.
Som tommelfingerregel: produkt-søjlen → gem eller kom ind. Situations-søjlen → gem eller send. Relations-søjlerne → kommentér eller skriv. Og vælg altid kun ÉN pr. opslag. Og de handlinger er algoritmens valuta: hver gang nogen gemmer, sender eller kommenterer, fortæller de algoritmen "det her er værdifuldt" — og så viser den jer til flere.
Og så en vigtig frihed, inden nogen misforstår: produktindhold må gerne fylde meget — når det giver værdi, inspiration eller beslutningshjælp. Det er kun den rene tilbudsavis ("Køb. 799 kr.") der skal holdes under 10 %.
I de næste tre lektioner lærer du først behovets to søjler — og så relationens to.
📱 ØVELSE I APPEN — Kend typerne (ca. 5 min.)
Appen stiller dig disse spørgsmål:
1. Kig på jeres seneste fem opslag: hvad gjorde hvert af dem — skabte det behov, dannede det relation, eller ingen af delene?
2. Hvad skulle kunden gøre efter hvert opslag? (Hvis du ikke kan svare, kunne kunden heller ikke.)$x$ where titel like $x$6.2 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$6.3 · Skabe behov — produkt-søjlen$x$, $x$Modul 6 · Content-strategien$x$, $x$KLIPPE-BRIEF · Lektion 6.3 · Skabe behov — produkt-søjlen
Modul: Modul 6 · Content-strategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 6-3-skabe-behov-produkt-soejlen.mp4
Kernen: M6-L3-skabe-behov-produkt-soejlen-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M6-L3-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M6-L3-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Behovets første søjle: produkterne. I starter i varen — og oversætter den til det, kunden føler.
Værktøjet hedder EFU: Egenskab. Fordel. Udbytte. Folk køber ikke en boremaskine, fordi de drømmer om at eje en boremaskine — de køber den, fordi de vil have et hul i væggen.
Egenskaben er fakta: "cardigan i 100 % uld". Fordelen er, hvad den gør: "holder dig varm og ånder". Udbyttet er, hvad kunden føler: "du ser samlet ud på ti sekunder — også de morgener, hvor alt roder".
De fleste laver indhold i egenskabs-sproget: "Nyhed! Fås i tre farver. 599 kr." Men ingen har nogensinde fået hjertebanken af en varedeklaration. Behov skabes i udbytte-sproget.
Og sælger I ikke varer fra hylder, virker EFU præcis lige så godt på ydelser: "Gratis boligvurdering" er en egenskab. "Du kender din boligs værdi" er fordelen. "Ro i maven om familiens største beslutning" — DET er udbyttet.
Hvordan finder man udbyttet? Med "og hvad så?"-testen: Sig egenskaben højt. Spørg "og hvad så?" — og bliv ved, til du rammer en følelse. "Den er i 100 % uld." Og hvad så? "Den holder længe." Og hvad så? "Du skal ikke købe en ny til næste vinter." Og hvad så? "Du kan købe færre, bedre ting — og have ro i maven over dine valg." DÉR er dit opslag.
Fra nu af gælder reglen: hver gang I vil fortælle en egenskab, oversætter I den til et udbytte først.
Handlingen for behovs-indhold: gem ("gem den til din næste bytur") — eller den helt direkte: "kom ind i forretningen og prøv den." Et gem betyder: behovet er plantet. Et besøg: mål.
📱 ØVELSE I APPEN — Skab behov (ca. 10 min.)
Appen stiller dig disse spørgsmål:
1. Tag to varer fra forretningen — gerne dem, I er mest stolte af — og oversæt hver: egenskab → fordel → udbytte (brug "og hvad så?"-testen)
2. Skriv én opslags-idé for hver — med udbyttet som overskrift$x$
where not exists (select 1 from video_opgaver where titel like $x$6.3 %$x$);
update video_opgaver set manus_tekst = $x$Behovets første søjle: produkterne. I starter i varen — og oversætter den til det, kunden føler.
Værktøjet hedder EFU: Egenskab. Fordel. Udbytte. Folk køber ikke en boremaskine, fordi de drømmer om at eje en boremaskine — de køber den, fordi de vil have et hul i væggen.
Egenskaben er fakta: "cardigan i 100 % uld". Fordelen er, hvad den gør: "holder dig varm og ånder". Udbyttet er, hvad kunden føler: "du ser samlet ud på ti sekunder — også de morgener, hvor alt roder".
De fleste laver indhold i egenskabs-sproget: "Nyhed! Fås i tre farver. 599 kr." Men ingen har nogensinde fået hjertebanken af en varedeklaration. Behov skabes i udbytte-sproget.
Og sælger I ikke varer fra hylder, virker EFU præcis lige så godt på ydelser: "Gratis boligvurdering" er en egenskab. "Du kender din boligs værdi" er fordelen. "Ro i maven om familiens største beslutning" — DET er udbyttet.
Hvordan finder man udbyttet? Med "og hvad så?"-testen: Sig egenskaben højt. Spørg "og hvad så?" — og bliv ved, til du rammer en følelse. "Den er i 100 % uld." Og hvad så? "Den holder længe." Og hvad så? "Du skal ikke købe en ny til næste vinter." Og hvad så? "Du kan købe færre, bedre ting — og have ro i maven over dine valg." DÉR er dit opslag.
Fra nu af gælder reglen: hver gang I vil fortælle en egenskab, oversætter I den til et udbytte først.
Handlingen for behovs-indhold: gem ("gem den til din næste bytur") — eller den helt direkte: "kom ind i forretningen og prøv den." Et gem betyder: behovet er plantet. Et besøg: mål.
📱 ØVELSE I APPEN — Skab behov (ca. 10 min.)
Appen stiller dig disse spørgsmål:
1. Tag to varer fra forretningen — gerne dem, I er mest stolte af — og oversæt hver: egenskab → fordel → udbytte (brug "og hvad så?"-testen)
2. Skriv én opslags-idé for hver — med udbyttet som overskrift$x$ where titel like $x$6.3 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$6.4 · Skabe behov — situations-søjlen$x$, $x$Modul 6 · Content-strategien$x$, $x$KLIPPE-BRIEF · Lektion 6.4 · Skabe behov — situations-søjlen
Modul: Modul 6 · Content-strategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 6-4-skabe-behov-situations-soejlen.mp4
Kernen: M6-L4-skabe-behov-situations-soejlen-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M6-L4-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M6-L4-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Behovets anden søjle starter ikke i varen — den starter i kundens situation. Kunden står med et problem, et valg eller en tvivl. Og I er den, der løser det. Samme formål som produkt-søjlen — behovet — men den modsatte vej ind: dér startede I i varen og endte hos kunden; her starter I hos kunden og ender (måske) ved varen.
Vejen ind til udfordringen hedder en indsigt: et 100 % ærligt svar på, hvad kunden tænker eller føler. Testen er nådesløst simpel: ville kunden sige "kender du det?!" — så har I den. Og pas på forskellen: en sandhed kan googles ("folk køber gaver i december"). En indsigt kan mærkes ("kunden udskyder gavekøbet af frygt for at vælge forkert"). Kan du google det, er det ikke en indsigt.
I kender allerede kundens hverdag og situationer fra modul 5. Så spørg: hvad har de brug for hjælp til lige nu? Har de travlt → "Tre looks til en travl uge." Er det december → "Fem gaver til den, der har alt." Står de med et valg → "Sådan vælger du den rigtige pasform."
Situations-indhold kommer i tre former:
Beslutningshjælpen. "Sådan vælger du..." "Forskellen på X og Y." "Hvis du kun skal købe én ting denne måned..."
Friktionsfjerneren. Alt det, der fjerner grunden til IKKE at komme ind: "Ja, vi har også større størrelser hjemme." "Ja, du kan parkere lige udenfor." "Ja, du kan bytte."
Guldkornene fra butiksgulvet. De spørgsmål, kunderne stiller igen og igen henne ved disken — hvert eneste af dem er et opslag. I svarer jo allerede på dem hver dag.
(Og er I en bank, en mægler eller en klinik: så er det her jeres vigtigste indholdstype — rådgivning ER jeres vare.)
Handlingen for situations-indhold: gem ("gem den til når du skal vælge") eller send — "send til én, der har brug for det her." Dét er den fineste anbefaling, der findes.
📱 ØVELSE I APPEN — Løs en udfordring (ca. 10 min.)
Appen stiller dig disse spørgsmål:
1. Skriv én indsigt om jeres kernekunde, der består "kender du det?!"-testen
2. Hvilke tre spørgsmål stiller kunderne oftest i forretningen? (= jeres tre næste opslag)
3. Skriv én friktionsfjerner: "Ja, vi..."$x$
where not exists (select 1 from video_opgaver where titel like $x$6.4 %$x$);
update video_opgaver set manus_tekst = $x$Behovets anden søjle starter ikke i varen — den starter i kundens situation. Kunden står med et problem, et valg eller en tvivl. Og I er den, der løser det. Samme formål som produkt-søjlen — behovet — men den modsatte vej ind: dér startede I i varen og endte hos kunden; her starter I hos kunden og ender (måske) ved varen.
Vejen ind til udfordringen hedder en indsigt: et 100 % ærligt svar på, hvad kunden tænker eller føler. Testen er nådesløst simpel: ville kunden sige "kender du det?!" — så har I den. Og pas på forskellen: en sandhed kan googles ("folk køber gaver i december"). En indsigt kan mærkes ("kunden udskyder gavekøbet af frygt for at vælge forkert"). Kan du google det, er det ikke en indsigt.
I kender allerede kundens hverdag og situationer fra modul 5. Så spørg: hvad har de brug for hjælp til lige nu? Har de travlt → "Tre looks til en travl uge." Er det december → "Fem gaver til den, der har alt." Står de med et valg → "Sådan vælger du den rigtige pasform."
Situations-indhold kommer i tre former:
Beslutningshjælpen. "Sådan vælger du..." "Forskellen på X og Y." "Hvis du kun skal købe én ting denne måned..."
Friktionsfjerneren. Alt det, der fjerner grunden til IKKE at komme ind: "Ja, vi har også større størrelser hjemme." "Ja, du kan parkere lige udenfor." "Ja, du kan bytte."
Guldkornene fra butiksgulvet. De spørgsmål, kunderne stiller igen og igen henne ved disken — hvert eneste af dem er et opslag. I svarer jo allerede på dem hver dag.
(Og er I en bank, en mægler eller en klinik: så er det her jeres vigtigste indholdstype — rådgivning ER jeres vare.)
Handlingen for situations-indhold: gem ("gem den til når du skal vælge") eller send — "send til én, der har brug for det her." Dét er den fineste anbefaling, der findes.
📱 ØVELSE I APPEN — Løs en udfordring (ca. 10 min.)
Appen stiller dig disse spørgsmål:
1. Skriv én indsigt om jeres kernekunde, der består "kender du det?!"-testen
2. Hvilke tre spørgsmål stiller kunderne oftest i forretningen? (= jeres tre næste opslag)
3. Skriv én friktionsfjerner: "Ja, vi..."$x$ where titel like $x$6.4 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$6.5 · Danne relation & community$x$, $x$Modul 6 · Content-strategien$x$, $x$KLIPPE-BRIEF · Lektion 6.5 · Danne relation & community
Modul: Modul 6 · Content-strategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 6-5-danne-relation-community.mp4
Kernen: M6-L5-danne-relation-community-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M6-L5-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M6-L5-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Den anden indholdstype er den, de fleste forretninger glemmer — og den, der gør, at folk køber hos JER og ikke hos konkurrenten: relation & community.
Husk hvorfor: mennesker køber fra mennesker, de kender. Og husk lektion 6.1 — i en verden, hvor AI kan lave alt det perfekte, er det ægte det eneste, der ikke kan kopieres.
Ligesom behovet har relationen to indholdssøjler:
SØJLE 3 — BRANDING. Råstoffet er jeres drivkraft: her tager I kunden med bagom forretningen og viser, hvordan drivkraften afspejles i hverdagen — menneskene og måden, I driver forretning på. Formatet ligger fast: altid Story — råt, ægte, uperfekt, og de bedste gemmes som highlights. Kunden skal tænke: "Okay — det vidste jeg ikke om dem. Nu forstår jeg, hvorfor de gør det."
• Menneskene bag. Ejeren. Medarbejderne. Morgenrutinen inden forretningen åbner. Dagens lille grin bag disken.
• Jeres drivkraft og holdninger. Den ærlige anmeldelse — også når noget IKKE er pengene værd. "Det her sælger vi ikke — og her er hvorfor." Holdninger skaber forbindelse; glathed skaber ingenting.
SØJLE 4 — COMMUNITY & VÆRDIER. Råstoffet er jeres værdier, levet udadtil gennem serierne. Kunden skal tænke: "Dem kan jeg godt lide — dem vil jeg være kunde hos."
• Inddragelse. Spørg dem til råds: "Skal indpakningen være grøn eller blå?" "Hvad vil I se mere af?" Folk elsker at blive taget med i beslutningerne — det er DET, der bygger community.
• Det lokale. Fejr byen, stamkunderne, naboerne. I er ikke en webshop — brug det.
(Og er I en klub, forening eller et kulturhus: så er relation & community næsten HELE jeres indhold — fællesskabet er jo selve produktet. Behovs-indholdet er så invitationen: kampdagen, forestillingen, prøvetræningen.)
Og husk: relations-indhold må gerne være uperfekt. Perfektion uden personlighed er ikke strategien.
Handlingen for relations-indhold: kommentér eller skriv til jer — "svar i kommentarerne", "send til hende, der...". Og et svar på jeres story eller en DM er mindst lige så meget værd: dér begynder de rigtige samtaler. Hver kommentar og hver besked er en relation, der lige er blevet stærkere.
📱 ØVELSE I APPEN — Byg relation (ca. 10 min.)
Appen stiller dig disse spørgsmål:
1. Skriv én opslags-idé om menneskene bag forretningen
2. Skriv én idé, hvor I deler en holdning (brug jeres drivkraft fra modul 5)
3. Skriv én idé, der inddrager følgerne med et spørgsmål$x$
where not exists (select 1 from video_opgaver where titel like $x$6.5 %$x$);
update video_opgaver set manus_tekst = $x$Den anden indholdstype er den, de fleste forretninger glemmer — og den, der gør, at folk køber hos JER og ikke hos konkurrenten: relation & community.
Husk hvorfor: mennesker køber fra mennesker, de kender. Og husk lektion 6.1 — i en verden, hvor AI kan lave alt det perfekte, er det ægte det eneste, der ikke kan kopieres.
Ligesom behovet har relationen to indholdssøjler:
SØJLE 3 — BRANDING. Råstoffet er jeres drivkraft: her tager I kunden med bagom forretningen og viser, hvordan drivkraften afspejles i hverdagen — menneskene og måden, I driver forretning på. Formatet ligger fast: altid Story — råt, ægte, uperfekt, og de bedste gemmes som highlights. Kunden skal tænke: "Okay — det vidste jeg ikke om dem. Nu forstår jeg, hvorfor de gør det."
• Menneskene bag. Ejeren. Medarbejderne. Morgenrutinen inden forretningen åbner. Dagens lille grin bag disken.
• Jeres drivkraft og holdninger. Den ærlige anmeldelse — også når noget IKKE er pengene værd. "Det her sælger vi ikke — og her er hvorfor." Holdninger skaber forbindelse; glathed skaber ingenting.
SØJLE 4 — COMMUNITY & VÆRDIER. Råstoffet er jeres værdier, levet udadtil gennem serierne. Kunden skal tænke: "Dem kan jeg godt lide — dem vil jeg være kunde hos."
• Inddragelse. Spørg dem til råds: "Skal indpakningen være grøn eller blå?" "Hvad vil I se mere af?" Folk elsker at blive taget med i beslutningerne — det er DET, der bygger community.
• Det lokale. Fejr byen, stamkunderne, naboerne. I er ikke en webshop — brug det.
(Og er I en klub, forening eller et kulturhus: så er relation & community næsten HELE jeres indhold — fællesskabet er jo selve produktet. Behovs-indholdet er så invitationen: kampdagen, forestillingen, prøvetræningen.)
Og husk: relations-indhold må gerne være uperfekt. Perfektion uden personlighed er ikke strategien.
Handlingen for relations-indhold: kommentér eller skriv til jer — "svar i kommentarerne", "send til hende, der...". Og et svar på jeres story eller en DM er mindst lige så meget værd: dér begynder de rigtige samtaler. Hver kommentar og hver besked er en relation, der lige er blevet stærkere.
📱 ØVELSE I APPEN — Byg relation (ca. 10 min.)
Appen stiller dig disse spørgsmål:
1. Skriv én opslags-idé om menneskene bag forretningen
2. Skriv én idé, hvor I deler en holdning (brug jeres drivkraft fra modul 5)
3. Skriv én idé, der inddrager følgerne med et spørgsmål$x$ where titel like $x$6.5 %$x$ and coalesce(manus_tekst,'') = '';

insert into video_opgaver (titel, modul, brief, status, kode, manus_tekst)
select $x$6.6 · Jeres fire indholdssøjler — fra strategi til hverdag$x$, $x$Modul 6 · Content-strategien$x$, $x$KLIPPE-BRIEF · Lektion 6.6 · Jeres fire indholdssøjler — fra strategi til hverdag
Modul: Modul 6 · Content-strategien
Vises i: KUN YOU GOT THIS (kursister) — Business ser aldrig modul 5-6
Råfil (optagelsen): 6-6-jeres-fire-indholdssoejler-fra-strategi-til-hverdag.mp4
Kernen: M6-L6-jeres-fire-indholdssoejler-fra-strategi-til-hverdag-v1.mp4 — klippes REN, ingen bookends eller B-klip bagt ind
Bookends: M6-L6-bookend-{produkt}-v1.mp4 — separate filer, sættes for og bag kernen
B-klip: M6-L6-B1-v1.mp4, -B2 … — passagerne markeret som B-klip i manus
OBS: lektionen har 1 øvelsesspørgsmål i appen — de skal IKKE med i videoen.
Idas noter: —$x$, 'Brief klar', 'THOMAS2026', $x$Prøv at åbne jeres egen Instagram-profil og kig ned over gitteret — som en fremmed, der lander der for første gang. Kan man på ti sekunder se: hvad I sælger? Hvem I er? Hvem I taler til? Det er testen. Det er det, hele denne lektion bygger — for de tre spørgsmål er præcis de tre søjler, I nu skal lave.
Og nu er det nemt. For her kommer den vigtigste sætning i hele modulet: Der findes to slags indhold for detail — det, der skaber behov, og det, der danner relation. Hver type har to søjler. Fire søjler i alt — og jeres brandstrategi har allerede skrevet manuskriptet for alle fire.
TYPE 1: SKABE BEHOV · Hvorfor købe?
• Søjle 1 — Kundens behov og situation. Fra målgruppen i jeres brandstrategi: hvad står kunden i lige nu — deres valg, deres "kender du det?!" (kalenderen er motoren).
• Søjle 2 — Produktet. Fra USP'en i jeres brandstrategi: de produkter, I vil sætte fokus på — og som beviser, hvad I står for (EFU er sproget).
TYPE 2: DANNE RELATION & COMMUNITY · Hvorfor købe hos JER? Energien i forretningen.
• Søjle 3 — Branding. Fra drivkraften i jeres brandstrategi: bagom forretningen — menneskene og måden, I driver forretning på. Formatet ligger fast: altid Story.
• Søjle 4 — Community & værdier. Fra værdierne i jeres brandstrategi: værdierne vist i praksis — inddragelsen, det lokale, stemningen omkring forretningen.
Kan I se broen? Brandstrategien har fire byggesten — og indholdet har fire søjler. Én byggesten pr. søjle. Målgruppen → kundens behov og situation. USP'en → produktet. Drivkraften → branding. Værdierne → community. I har allerede svarene fra modul 5 — I skal ikke vælge noget. I skal oversætte.
Søjle
Fra brandstrategien
Jobbet
Kundens reaktion
1 · Kundens behov og situation
Målgruppen
Hjælper — guider og giver kunden noget, de har brug for lige nu
"Wow — de ser mig og giver mig det, jeg har brug for"
2 · Produktet
USP'en
Frister — viser via EFU, hvorfor varen er relevant, værdifuld og værd at vælge
"Den vil jeg have"
3 · Branding (altid Story)
Drivkraften
Tager kunden med bagom forretningen — drivkraften vist i hverdagen
"Okay — det vidste jeg ikke om dem. Nu forstår jeg, hvorfor de gør det"
4 · Community & værdier
Værdierne
Samler — inddrager og fejrer dem, der står for det samme
"Dem kan jeg godt lide — dem vil jeg være kunde hos"
Og fordi de to behovs-søjler ender samme sted, er der ingen grænse at bevogte: blander et opslag varen og situationen, er det stadig bare behovs-indhold. Det eneste, I skal passe på, er balancen mellem de to TYPER — for fristelsen er at lave rent behovs-indhold ("vi skal jo sælge!"). Men en profil uden relation er en reklamestander, og reklamestandere bliver unfollowet. Relationen er grunden til, at behovs-indholdet overhovedet virker: folk køber fra folk, de kender. Tommelfingerreglen: giv flere gange, end I beder.
Og her kommer den regel, der binder det hele sammen — husk profil-testen: tre søjler bor i feedet (kundens situation · produktet · community), og alle tre skal kunne ses ned over gitteret. Branding-søjlen bor i stories — og de bedste gemmes som highlights, så "hvem er I?" ligger permanent øverst på profilen. Så viser profilen: hvem kunden er · hvad I sælger · hvorfor I gør det · hvad man bliver en del af, når man handler hos jer. Med tre opslag om ugen — én fra hver feed-søjle — går rytmen op af sig selv.
Og tre om ugen er min anbefaling. Vil I op eller ned i mængde, må I gerne — men så skal fordelingen holdes, så alle søjler bevares. Skalerings-modellen er enkel: rækkefølgen ligger fast — kundens situation → produktet → community — og I ruller bare videre i den, uanset tempo:
• Ét opslag om ugen: alle tre søjler dækkes på tre uger.
• To om ugen: alle tre dækkes på halvanden uge.
• Tre om ugen (anbefalingen): én fra hver søjle, hver uge.
• Seks om ugen: to fra hver — aldrig seks produktopslag.
Og branding-søjlen kører i stories uanset tempo — den skalerer med hverdagen, ikke med kalenderen. Og læg mærke til: de seneste 9 opslag, hvor alle tre feed-søjler skal kunne ses, er de samme 9 opslag, I måler jeres interaktionsrate på. Gitteret er både jeres udstillingsvindue og jeres målestation.
Fra søjle til serie — vælg fra menuen
Søjlen er skelettet — serien er JERES udgave af søjlen: et fast format med jeres eget navn og en fast rytme. Og her er den gode nyhed: I skal ikke opfinde serierne. I vælger fra menuen og gør formatet til jeres eget — én serie pr. søjle, fire i alt. Det er NU, I træffer valget — én gang. Bagefter kører serierne af sig selv.
Og én ting skal siges højt, inden I vælger: serien er genvejen, ikke reglen. Kravet er søjlerne — at alle fire kan ses i feedet. Serien er bare den letteste måde at leve op til det på: "hvem er ugens Mød os mandag?" er et nemmere spørgsmål end "hvad skal vi poste om branding?". Men glipper en uge, er intet ødelagt — serien venter bare på næste afsnit. En serie er en hjælp, ikke en kontrakt.
SØJLE 1 — Kundens behov og situation (hjælper). Målgruppebeskrivelsen og kalenderen driver serierne:
• "Ugens spørgsmål" — det, kunderne faktisk spurgte om i forretningen i denne uge.
• "Guiden" — sådan vælger du X til Y: pasformen, gaven, størrelsen.
• "Klar til …" — sæsonen eller begivenheden lige om hjørnet: skolestart, konfirmation, efterårskulden. (Kig også tilbage: hvad var der efterspørgsel på samme tid sidste år? Det, de spurgte om sidste år, spørger nye kunder om i år.)
• "Kender du det?" — situationen først, løsningen bagefter.
SØJLE 2 — Produktet (frister). Vælg det format, der bedst beviser jeres USP (det er her, USP'en arbejder — I skal aldrig tænke på den igen i hverdagen):
• "Ugens fund" — nyheden, ærligt fortalt. Serien vælger selv varen: det, der kom hjem i denne uge.
• "Umagen bag" — historien om, hvorfor I købte netop dén vare ind.
• "Style den på 3 måder" — inspirationen: samme vare, tre liv.
• "Sæsonens must" — varen, kunden får brug for om 14 dage. Kalenderen vælger varen.
Læg mærke til tricket: formatet vælger selv ugens vare. "Ugens fund" peger altid på nyheden. "Sæsonens must" peger altid på kalenderen. I skal aldrig stå søndag aften og vælge vare fra nul. (Og EFU-sproget fra 6.3 er værktøjet, når afsnittet skrives: udbyttet, ikke egenskaberne. Lyst, ikke leksikon.)
SØJLE 3 — Branding (bagom forretningen — altid Story).
• "Behind the scenes" — bagom-serien: alt det, kunden aldrig ser fra butiksgulvet.
• "Mød os mandag" — personale-serien, ét menneske ad gangen.
• "Bag disken" — hverdagsøjeblikkene: morgenklargøringen, udpakningen, overvejelserne bag et indkøb.
• "Det sælger vi ikke" — holdningerne: den ærlige anmeldelse, også når noget ikke er pengene værd.
SØJLE 4 — Community & værdier (værdierne vist i praksis).
• "Glade kunder" — kundecases og anmeldelser, altid med samtykke — så er de guld.
• "I bestemmer" — inddragelsen: afstemninger, "hvad vil I se mere af?".
• "Vores by" — det lokale: byen, stamkunderne, naboerne. I er ikke en webshop — brug det.
Vælg én serie fra hver søjle — og I må selvfølgelig også opfinde jeres egen; menuen er starthjælp, ikke et krav. Gør så hver serie færdig i appen med fire felter:
1. Målgruppen (kun hvis I har flere). Hvem taler serien mest til? Appen viser jeres egne målgrupper fra modul 5 — og holder selv øje med, at alle er dækket. Har I to verdener (fx mode OG interiør), kan produkt-serien deles i to — men de andre søjler er fælles for det hele.
2. Handlingen: hvad vil I gerne have, kunderne GØR? Én af de fire: kommer ind i forretningen · gemmer opslaget · sender til en ven · kommenterer/skriver til jer. Den følger naturligt af søjlen: produktet → gem/kom ind. Situationen → gem/send til én, der har brug for det. Branding → svar på storyen/skriv. Community → kommentér/skriv.
3. Jeres eget navn + en fast rytme. Fx "Ugens fund" — ét afsnit hver uge. I behøver ikke låse serien til en bestemt ugedag; det vigtige er rytmen (hvor ofte), ikke dagen. En serie med fast rytme er dét, folk kommer tilbage til.
4. De tre første afsnit. Kan I ikke nævne tre, er formatet forkert til jer — vælg et andet fra menuen.
Og så er hverdagen nem — ét spørgsmål pr. serie
Søndag aften skal I IKKE åbne brandstrategien. Ikke kigge på USP'en. Ikke tænke strategisk. Alt det er allerede bygget IND i serierne — det var dét, I gjorde ovenfor. I stiller kun ét spørgsmål pr. serie: "Hvad er ugens afsnit?"
• Guiden: hvad spurgte kunderne om i forretningen — og hvad siger kalenderen?
• Ugens fund: hvilken vare kom hjem i denne uge?
• Mød os mandag: hvem — eller hvilket øjeblik — i denne uge?
• I bestemmer: hvad skal følgerne være med til at vælge?
Tre feed-serier, tre opslag om ugen — og branding-serien kører løbende i stories, når hverdagen alligevel sker ("hvad sker der bag disken i dag?"). Og så det sidste tjek, inden I trykker: ville jeres kernekunde stoppe op ved det her? Det er hele jeres søndag aften.
Og én ting til, inden I går i gang: jeres rytme og jeres søjler er to forskellige ting. Rytmen fra modul 5 siger, HVOR OFTE I poster. Søjlerne siger, HVAD I poster. Poster I to gange om ugen, skiftes søjlerne bare. Poster I fem gange, kommer nogle søjler to gange. Der er ingen regel om "én fra hver søjle om ugen" — det vigtige er balancen over en måned: begge typer skal være i spil.
Og når ugens afsnit skal skrives, er der ét spørgsmål, der gør det levende: hvad er aktuelt lige nu? Serien er kassen — aktualiteten er ugens krydderi. Spørg: Hvad siger kalenderen — højtider, ferier, lokale begivenheder? Hvad spørger kunderne om i forretningen lige nu? Hvad solgte godt på denne tid sidste år? Hvad er vejret overhovedet? "Ugens nyhed — ærligt anmeldt" bliver til regnjakke-anmeldelsen i september og gavehittet i december. I skal aldrig finde på fra nul — I skal bare krydse søjle med aktualitet.
Og så den vigtigste indpakning af det hele: alt pakkes ind i storytelling. I poster aldrig varen — I fortæller historien om varen. Ikke "ny skjorte hjemme", men "derfor faldt vi for den her". Ikke "vi har åbent lørdag", men "det her sker bag disken lørdag morgen". En søjle uden fortælling er et katalog, og kataloger scroller man forbi — historier stopper man ved. Det gælder alle tre serier: varen fortælles (umagen bag den), situationen fortælles ("kender du det?!"-øjeblikket), og relationen fortælles helt af sig selv (menneskene ER historien).
Konkret vælger I pr. opslag, hvordan historien fortælles: skal den underholde, uddanne eller inspirere? Det vælges i appen, og der er naturlige makkere: en udfordring undervises tit bedst ("sådan vælger du pasformen"), et behov inspireres frem ("tre måder at style den samme blazer"), og relation må gerne underholde (dagens grin bag disken). Men byt frit — en udfordring fortalt med humor kan være det stærkeste af alt.
Det gode indholds 3-trinsraket
Og uanset søjle, serie og fortællemåde bygges selve opslaget altid efter samme raket — det er den, briefen i appen fører jer igennem, trin for trin:
Trin 1 — Stop scrollet. De første sekunder afgør alt — hook, coverbillede, bevægelse. Springer folk over, ser ingen resten, og så er trin 2 og 3 ligegyldige.
Trin 2 — Hold på dem. Én pointe, ingen steder at kede sig, og klip FØR det bliver kedeligt.
Trin 3 — Få dem til at handle. Én stærk CTA: gem, send, kom ind eller skriv. Et opslag uden handling er underholdning — et opslag med handling er forretning. Det er de tre trin, jeres Content Brief bygger på — og i Værktøjskassen lærer du præcis, hvordan du arbejder med hooks, fastholdelse og CTA i praksis.
Og til sidst fire hurtige tests: Profil-testen — kig ned over gitteret: kan en fremmed se, hvad I sælger, hvem I er, og hvem I taler til? Værditesten — hold hånden over mærket: kan man stadig mærke, det er jer? Kernekundetesten — ville Katrine stoppe op? Energitesten — kan I lave den serie i seks måneder uden at miste gnisten? Hvis du hader at filme dig selv, skal "daglig video af dig" ikke være en serie.
En sidste klassiker: en vareliste er ikke en serie. "Nyheder" er ikke en serie — det er en varelevering. Men "ugens nyhed, ærligt anmeldt"? DET er en serie — fordi jeres USP (den ærlige, håndplukkede vurdering) er med i kassen.
📱 ØVELSE I APPEN — Jeres fire indholdssøjler (ca. 25 min. — modulets vigtigste)
Appen stiller de fire søjler op — KUNDENS BEHOV & SITUATION (fra jeres målgruppe) · PRODUKTET (fra jeres USP) · BRANDING (fra jeres drivkraft — altid Story) · COMMUNITY & VÆRDIER (fra jeres værdier) — og viser jeres egne svar fra modul 5 ved siden af som råstof. For HVER søjle:
1. Vælg serie-format — eller skriv jeres eget
2. Målgruppe — hvis I har flere (appen tjekker, at alle er dækket)
3. Handlingen — kommer ind i forretningen / gemmer / sender til en ven / kommenterer-skriver til jer
4. Jeres eget navn + fast rytme — fx "Ugens fund", ét afsnit hver uge
5. De tre første afsnit (kan I ikke nævne tre, vælger I et andet format)
Til sidst kører appen de fire tests med dig: profil-testen · værditesten · kernekundetesten · energitesten.
Og inden I trykker på noget som helst — fem hold-jer-fri-regler. Resten af juraen behøver I aldrig lære, men de her fem skal sidde fast: 1) Musik: brug KUN musikken fra Instagrams erhvervs-bibliotek — den musik, private bruger, er ikke lovlig for virksomheder, og musik er det, botterne fanger hurtigst. 2) Mennesker: kan man genkende personer, skal de have sagt ja. (Og husk: kundefotos og anmeldelser MED samtykke er guld — social proof virker!) 3) Andres ting: andres logoer, kunst, film og memes er ikke gratis for en forretning at bruge. 4) AI: er indholdet AI-genereret, skal det deklareres. 5) I tvivl? Lad være — eller spørg.
Og så er der kun ét tryk tilbage: "Byg min strategi." Appen samler nu alt, hvad I har svaret gennem modul 5 og 6 — jeres drivkraft, værdier, USP, kernekunde, målsætning, indholdstyper og søjler — og bygger det sammen til jeres færdige strategi. Én side. Jeres.
Det var strategien. Og husk, inden du går: perfekt uperfekt slår perfekt, der aldrig blev postet. Hver gang. Vi ses. 💛
 
GEMT TIL SENERE — Content Studio-onboarding
(Bruges IKKE i strategimodulet. Dette manus gemmes til onboarding-videoen, når kunden til allersidst i forløbet får 30 dages prøveadgang til Content Studio.)
ONBOARDING-VIDEO — Velkommen til dit Content Studio
Du har nu en strategi. Men en strategi i en skuffe er lige så meget værd som ingen strategi. Så nu viser jeg dig, hvor din bor — og hvordan den arbejder for dig hver dag.
Velkommen hjem — til dit Content Studio. Lad mig vise dig rundt.
Det her er dit overblik. Øverst: din målsætning. Din interaktionsrate — dit relations-tal. Og ugens fremdrift: hvor mange opslag har du postet af dit ugemål. Ikke for at give dig dårlig samvittighed — men for at give dig ro: du er på sporet.
Her bor din idébank og din kalender. Hver gang du får en idé — i bilen, bag disken, i badet — smider du den ind her. Og læg mærke til: hver idé hører til én af dine fire indholdssøjler. Kan idéen ikke bo i et af jeres søjler? Så er det nok ikke din idé — det er bare noget, du har set en anden gøre.
Og her er så min gave til dig: content-briefen. Det her er den præcise skabelon, jeg selv bruger med mine private kunder. Ni trin fra idé til færdigt opslag: Vinklen — og husk: den handler aldrig om produktet, den handler om personen, der ser med. Formålet. Indholdet, lyden, coverbilledet. Hooket — de første tre sekunder, der afgør alt. Captionen — med opskriften indbygget. Og din CTA — én, ikke fem.
Og til sidst tjeklisten før upload — elleve spørgsmål, der fanger de klassiske fejl, før du poster.
Du skal ikke udfylde hele briefen for hvert opslag — en story fra hverdagen kræver ikke ni trin. Men til dine vigtige opslag går du gennem briefen. Det er forskellen på at poste noget og at bygge noget.
Nu er der kun én ting tilbage: at trykke post. Vi ses derinde. 💛$x$
where not exists (select 1 from video_opgaver where titel like $x$6.6 %$x$);
update video_opgaver set manus_tekst = $x$Prøv at åbne jeres egen Instagram-profil og kig ned over gitteret — som en fremmed, der lander der for første gang. Kan man på ti sekunder se: hvad I sælger? Hvem I er? Hvem I taler til? Det er testen. Det er det, hele denne lektion bygger — for de tre spørgsmål er præcis de tre søjler, I nu skal lave.
Og nu er det nemt. For her kommer den vigtigste sætning i hele modulet: Der findes to slags indhold for detail — det, der skaber behov, og det, der danner relation. Hver type har to søjler. Fire søjler i alt — og jeres brandstrategi har allerede skrevet manuskriptet for alle fire.
TYPE 1: SKABE BEHOV · Hvorfor købe?
• Søjle 1 — Kundens behov og situation. Fra målgruppen i jeres brandstrategi: hvad står kunden i lige nu — deres valg, deres "kender du det?!" (kalenderen er motoren).
• Søjle 2 — Produktet. Fra USP'en i jeres brandstrategi: de produkter, I vil sætte fokus på — og som beviser, hvad I står for (EFU er sproget).
TYPE 2: DANNE RELATION & COMMUNITY · Hvorfor købe hos JER? Energien i forretningen.
• Søjle 3 — Branding. Fra drivkraften i jeres brandstrategi: bagom forretningen — menneskene og måden, I driver forretning på. Formatet ligger fast: altid Story.
• Søjle 4 — Community & værdier. Fra værdierne i jeres brandstrategi: værdierne vist i praksis — inddragelsen, det lokale, stemningen omkring forretningen.
Kan I se broen? Brandstrategien har fire byggesten — og indholdet har fire søjler. Én byggesten pr. søjle. Målgruppen → kundens behov og situation. USP'en → produktet. Drivkraften → branding. Værdierne → community. I har allerede svarene fra modul 5 — I skal ikke vælge noget. I skal oversætte.
Søjle
Fra brandstrategien
Jobbet
Kundens reaktion
1 · Kundens behov og situation
Målgruppen
Hjælper — guider og giver kunden noget, de har brug for lige nu
"Wow — de ser mig og giver mig det, jeg har brug for"
2 · Produktet
USP'en
Frister — viser via EFU, hvorfor varen er relevant, værdifuld og værd at vælge
"Den vil jeg have"
3 · Branding (altid Story)
Drivkraften
Tager kunden med bagom forretningen — drivkraften vist i hverdagen
"Okay — det vidste jeg ikke om dem. Nu forstår jeg, hvorfor de gør det"
4 · Community & værdier
Værdierne
Samler — inddrager og fejrer dem, der står for det samme
"Dem kan jeg godt lide — dem vil jeg være kunde hos"
Og fordi de to behovs-søjler ender samme sted, er der ingen grænse at bevogte: blander et opslag varen og situationen, er det stadig bare behovs-indhold. Det eneste, I skal passe på, er balancen mellem de to TYPER — for fristelsen er at lave rent behovs-indhold ("vi skal jo sælge!"). Men en profil uden relation er en reklamestander, og reklamestandere bliver unfollowet. Relationen er grunden til, at behovs-indholdet overhovedet virker: folk køber fra folk, de kender. Tommelfingerreglen: giv flere gange, end I beder.
Og her kommer den regel, der binder det hele sammen — husk profil-testen: tre søjler bor i feedet (kundens situation · produktet · community), og alle tre skal kunne ses ned over gitteret. Branding-søjlen bor i stories — og de bedste gemmes som highlights, så "hvem er I?" ligger permanent øverst på profilen. Så viser profilen: hvem kunden er · hvad I sælger · hvorfor I gør det · hvad man bliver en del af, når man handler hos jer. Med tre opslag om ugen — én fra hver feed-søjle — går rytmen op af sig selv.
Og tre om ugen er min anbefaling. Vil I op eller ned i mængde, må I gerne — men så skal fordelingen holdes, så alle søjler bevares. Skalerings-modellen er enkel: rækkefølgen ligger fast — kundens situation → produktet → community — og I ruller bare videre i den, uanset tempo:
• Ét opslag om ugen: alle tre søjler dækkes på tre uger.
• To om ugen: alle tre dækkes på halvanden uge.
• Tre om ugen (anbefalingen): én fra hver søjle, hver uge.
• Seks om ugen: to fra hver — aldrig seks produktopslag.
Og branding-søjlen kører i stories uanset tempo — den skalerer med hverdagen, ikke med kalenderen. Og læg mærke til: de seneste 9 opslag, hvor alle tre feed-søjler skal kunne ses, er de samme 9 opslag, I måler jeres interaktionsrate på. Gitteret er både jeres udstillingsvindue og jeres målestation.
Fra søjle til serie — vælg fra menuen
Søjlen er skelettet — serien er JERES udgave af søjlen: et fast format med jeres eget navn og en fast rytme. Og her er den gode nyhed: I skal ikke opfinde serierne. I vælger fra menuen og gør formatet til jeres eget — én serie pr. søjle, fire i alt. Det er NU, I træffer valget — én gang. Bagefter kører serierne af sig selv.
Og én ting skal siges højt, inden I vælger: serien er genvejen, ikke reglen. Kravet er søjlerne — at alle fire kan ses i feedet. Serien er bare den letteste måde at leve op til det på: "hvem er ugens Mød os mandag?" er et nemmere spørgsmål end "hvad skal vi poste om branding?". Men glipper en uge, er intet ødelagt — serien venter bare på næste afsnit. En serie er en hjælp, ikke en kontrakt.
SØJLE 1 — Kundens behov og situation (hjælper). Målgruppebeskrivelsen og kalenderen driver serierne:
• "Ugens spørgsmål" — det, kunderne faktisk spurgte om i forretningen i denne uge.
• "Guiden" — sådan vælger du X til Y: pasformen, gaven, størrelsen.
• "Klar til …" — sæsonen eller begivenheden lige om hjørnet: skolestart, konfirmation, efterårskulden. (Kig også tilbage: hvad var der efterspørgsel på samme tid sidste år? Det, de spurgte om sidste år, spørger nye kunder om i år.)
• "Kender du det?" — situationen først, løsningen bagefter.
SØJLE 2 — Produktet (frister). Vælg det format, der bedst beviser jeres USP (det er her, USP'en arbejder — I skal aldrig tænke på den igen i hverdagen):
• "Ugens fund" — nyheden, ærligt fortalt. Serien vælger selv varen: det, der kom hjem i denne uge.
• "Umagen bag" — historien om, hvorfor I købte netop dén vare ind.
• "Style den på 3 måder" — inspirationen: samme vare, tre liv.
• "Sæsonens must" — varen, kunden får brug for om 14 dage. Kalenderen vælger varen.
Læg mærke til tricket: formatet vælger selv ugens vare. "Ugens fund" peger altid på nyheden. "Sæsonens must" peger altid på kalenderen. I skal aldrig stå søndag aften og vælge vare fra nul. (Og EFU-sproget fra 6.3 er værktøjet, når afsnittet skrives: udbyttet, ikke egenskaberne. Lyst, ikke leksikon.)
SØJLE 3 — Branding (bagom forretningen — altid Story).
• "Behind the scenes" — bagom-serien: alt det, kunden aldrig ser fra butiksgulvet.
• "Mød os mandag" — personale-serien, ét menneske ad gangen.
• "Bag disken" — hverdagsøjeblikkene: morgenklargøringen, udpakningen, overvejelserne bag et indkøb.
• "Det sælger vi ikke" — holdningerne: den ærlige anmeldelse, også når noget ikke er pengene værd.
SØJLE 4 — Community & værdier (værdierne vist i praksis).
• "Glade kunder" — kundecases og anmeldelser, altid med samtykke — så er de guld.
• "I bestemmer" — inddragelsen: afstemninger, "hvad vil I se mere af?".
• "Vores by" — det lokale: byen, stamkunderne, naboerne. I er ikke en webshop — brug det.
Vælg én serie fra hver søjle — og I må selvfølgelig også opfinde jeres egen; menuen er starthjælp, ikke et krav. Gør så hver serie færdig i appen med fire felter:
1. Målgruppen (kun hvis I har flere). Hvem taler serien mest til? Appen viser jeres egne målgrupper fra modul 5 — og holder selv øje med, at alle er dækket. Har I to verdener (fx mode OG interiør), kan produkt-serien deles i to — men de andre søjler er fælles for det hele.
2. Handlingen: hvad vil I gerne have, kunderne GØR? Én af de fire: kommer ind i forretningen · gemmer opslaget · sender til en ven · kommenterer/skriver til jer. Den følger naturligt af søjlen: produktet → gem/kom ind. Situationen → gem/send til én, der har brug for det. Branding → svar på storyen/skriv. Community → kommentér/skriv.
3. Jeres eget navn + en fast rytme. Fx "Ugens fund" — ét afsnit hver uge. I behøver ikke låse serien til en bestemt ugedag; det vigtige er rytmen (hvor ofte), ikke dagen. En serie med fast rytme er dét, folk kommer tilbage til.
4. De tre første afsnit. Kan I ikke nævne tre, er formatet forkert til jer — vælg et andet fra menuen.
Og så er hverdagen nem — ét spørgsmål pr. serie
Søndag aften skal I IKKE åbne brandstrategien. Ikke kigge på USP'en. Ikke tænke strategisk. Alt det er allerede bygget IND i serierne — det var dét, I gjorde ovenfor. I stiller kun ét spørgsmål pr. serie: "Hvad er ugens afsnit?"
• Guiden: hvad spurgte kunderne om i forretningen — og hvad siger kalenderen?
• Ugens fund: hvilken vare kom hjem i denne uge?
• Mød os mandag: hvem — eller hvilket øjeblik — i denne uge?
• I bestemmer: hvad skal følgerne være med til at vælge?
Tre feed-serier, tre opslag om ugen — og branding-serien kører løbende i stories, når hverdagen alligevel sker ("hvad sker der bag disken i dag?"). Og så det sidste tjek, inden I trykker: ville jeres kernekunde stoppe op ved det her? Det er hele jeres søndag aften.
Og én ting til, inden I går i gang: jeres rytme og jeres søjler er to forskellige ting. Rytmen fra modul 5 siger, HVOR OFTE I poster. Søjlerne siger, HVAD I poster. Poster I to gange om ugen, skiftes søjlerne bare. Poster I fem gange, kommer nogle søjler to gange. Der er ingen regel om "én fra hver søjle om ugen" — det vigtige er balancen over en måned: begge typer skal være i spil.
Og når ugens afsnit skal skrives, er der ét spørgsmål, der gør det levende: hvad er aktuelt lige nu? Serien er kassen — aktualiteten er ugens krydderi. Spørg: Hvad siger kalenderen — højtider, ferier, lokale begivenheder? Hvad spørger kunderne om i forretningen lige nu? Hvad solgte godt på denne tid sidste år? Hvad er vejret overhovedet? "Ugens nyhed — ærligt anmeldt" bliver til regnjakke-anmeldelsen i september og gavehittet i december. I skal aldrig finde på fra nul — I skal bare krydse søjle med aktualitet.
Og så den vigtigste indpakning af det hele: alt pakkes ind i storytelling. I poster aldrig varen — I fortæller historien om varen. Ikke "ny skjorte hjemme", men "derfor faldt vi for den her". Ikke "vi har åbent lørdag", men "det her sker bag disken lørdag morgen". En søjle uden fortælling er et katalog, og kataloger scroller man forbi — historier stopper man ved. Det gælder alle tre serier: varen fortælles (umagen bag den), situationen fortælles ("kender du det?!"-øjeblikket), og relationen fortælles helt af sig selv (menneskene ER historien).
Konkret vælger I pr. opslag, hvordan historien fortælles: skal den underholde, uddanne eller inspirere? Det vælges i appen, og der er naturlige makkere: en udfordring undervises tit bedst ("sådan vælger du pasformen"), et behov inspireres frem ("tre måder at style den samme blazer"), og relation må gerne underholde (dagens grin bag disken). Men byt frit — en udfordring fortalt med humor kan være det stærkeste af alt.
Det gode indholds 3-trinsraket
Og uanset søjle, serie og fortællemåde bygges selve opslaget altid efter samme raket — det er den, briefen i appen fører jer igennem, trin for trin:
Trin 1 — Stop scrollet. De første sekunder afgør alt — hook, coverbillede, bevægelse. Springer folk over, ser ingen resten, og så er trin 2 og 3 ligegyldige.
Trin 2 — Hold på dem. Én pointe, ingen steder at kede sig, og klip FØR det bliver kedeligt.
Trin 3 — Få dem til at handle. Én stærk CTA: gem, send, kom ind eller skriv. Et opslag uden handling er underholdning — et opslag med handling er forretning. Det er de tre trin, jeres Content Brief bygger på — og i Værktøjskassen lærer du præcis, hvordan du arbejder med hooks, fastholdelse og CTA i praksis.
Og til sidst fire hurtige tests: Profil-testen — kig ned over gitteret: kan en fremmed se, hvad I sælger, hvem I er, og hvem I taler til? Værditesten — hold hånden over mærket: kan man stadig mærke, det er jer? Kernekundetesten — ville Katrine stoppe op? Energitesten — kan I lave den serie i seks måneder uden at miste gnisten? Hvis du hader at filme dig selv, skal "daglig video af dig" ikke være en serie.
En sidste klassiker: en vareliste er ikke en serie. "Nyheder" er ikke en serie — det er en varelevering. Men "ugens nyhed, ærligt anmeldt"? DET er en serie — fordi jeres USP (den ærlige, håndplukkede vurdering) er med i kassen.
📱 ØVELSE I APPEN — Jeres fire indholdssøjler (ca. 25 min. — modulets vigtigste)
Appen stiller de fire søjler op — KUNDENS BEHOV & SITUATION (fra jeres målgruppe) · PRODUKTET (fra jeres USP) · BRANDING (fra jeres drivkraft — altid Story) · COMMUNITY & VÆRDIER (fra jeres værdier) — og viser jeres egne svar fra modul 5 ved siden af som råstof. For HVER søjle:
1. Vælg serie-format — eller skriv jeres eget
2. Målgruppe — hvis I har flere (appen tjekker, at alle er dækket)
3. Handlingen — kommer ind i forretningen / gemmer / sender til en ven / kommenterer-skriver til jer
4. Jeres eget navn + fast rytme — fx "Ugens fund", ét afsnit hver uge
5. De tre første afsnit (kan I ikke nævne tre, vælger I et andet format)
Til sidst kører appen de fire tests med dig: profil-testen · værditesten · kernekundetesten · energitesten.
Og inden I trykker på noget som helst — fem hold-jer-fri-regler. Resten af juraen behøver I aldrig lære, men de her fem skal sidde fast: 1) Musik: brug KUN musikken fra Instagrams erhvervs-bibliotek — den musik, private bruger, er ikke lovlig for virksomheder, og musik er det, botterne fanger hurtigst. 2) Mennesker: kan man genkende personer, skal de have sagt ja. (Og husk: kundefotos og anmeldelser MED samtykke er guld — social proof virker!) 3) Andres ting: andres logoer, kunst, film og memes er ikke gratis for en forretning at bruge. 4) AI: er indholdet AI-genereret, skal det deklareres. 5) I tvivl? Lad være — eller spørg.
Og så er der kun ét tryk tilbage: "Byg min strategi." Appen samler nu alt, hvad I har svaret gennem modul 5 og 6 — jeres drivkraft, værdier, USP, kernekunde, målsætning, indholdstyper og søjler — og bygger det sammen til jeres færdige strategi. Én side. Jeres.
Det var strategien. Og husk, inden du går: perfekt uperfekt slår perfekt, der aldrig blev postet. Hver gang. Vi ses. 💛
 
GEMT TIL SENERE — Content Studio-onboarding
(Bruges IKKE i strategimodulet. Dette manus gemmes til onboarding-videoen, når kunden til allersidst i forløbet får 30 dages prøveadgang til Content Studio.)
ONBOARDING-VIDEO — Velkommen til dit Content Studio
Du har nu en strategi. Men en strategi i en skuffe er lige så meget værd som ingen strategi. Så nu viser jeg dig, hvor din bor — og hvordan den arbejder for dig hver dag.
Velkommen hjem — til dit Content Studio. Lad mig vise dig rundt.
Det her er dit overblik. Øverst: din målsætning. Din interaktionsrate — dit relations-tal. Og ugens fremdrift: hvor mange opslag har du postet af dit ugemål. Ikke for at give dig dårlig samvittighed — men for at give dig ro: du er på sporet.
Her bor din idébank og din kalender. Hver gang du får en idé — i bilen, bag disken, i badet — smider du den ind her. Og læg mærke til: hver idé hører til én af dine fire indholdssøjler. Kan idéen ikke bo i et af jeres søjler? Så er det nok ikke din idé — det er bare noget, du har set en anden gøre.
Og her er så min gave til dig: content-briefen. Det her er den præcise skabelon, jeg selv bruger med mine private kunder. Ni trin fra idé til færdigt opslag: Vinklen — og husk: den handler aldrig om produktet, den handler om personen, der ser med. Formålet. Indholdet, lyden, coverbilledet. Hooket — de første tre sekunder, der afgør alt. Captionen — med opskriften indbygget. Og din CTA — én, ikke fem.
Og til sidst tjeklisten før upload — elleve spørgsmål, der fanger de klassiske fejl, før du poster.
Du skal ikke udfylde hele briefen for hvert opslag — en story fra hverdagen kræver ikke ni trin. Men til dine vigtige opslag går du gennem briefen. Det er forskellen på at poste noget og at bygge noget.
Nu er der kun én ting tilbage: at trykke post. Vi ses derinde. 💛$x$ where titel like $x$6.6 %$x$ and coalesce(manus_tekst,'') = '';

-- Tjek bagefter: select titel, (manus_tekst is not null) as har_manus from video_opgaver order by titel;