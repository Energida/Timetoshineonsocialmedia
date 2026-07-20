-- ================================================================
-- MANUS-SYNK: jobs→formål + Succesraketten ind i Tip Top Studio
-- Kør ÉN gang i Supabase SQL-editoren. Idempotent + sikker:
-- REPLACE rører KUN tekst der matcher; findes den ikke, sker intet.
-- (18.–19. juli 2026 — spejler rettelserne i strategimodulets manus)
-- ================================================================

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'indholdets to jobs', 'indholdets to formål');

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'begge jobs', 'begge formål');

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'vælge formålet, FØR man laver opslaget? Fordi formålet bestemmer alt', 'vælge handlingen, FØR man laver opslaget? Fordi handlingen bestemmer alt');

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'Det gode indholds 3-trinsraket', 'Succesraketten — sådan bygges selve opslaget');

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'Og uanset søjle, serie og fortællemåde bygges selve opslaget altid efter samme raket — det er den, briefen i appen fører jer igennem, trin for trin:', 'Og uanset søjle, serie og fortællemåde bygges selve opslaget altid efter den samme raket. Jeg kalder den Succesraketten — for et opslag skal lette i tre trin, og springer du ét af dem, når raketten aldrig op. Det er den, briefen i appen fører jer igennem, trin for trin — og hvert trin har sit eget lille mål, I kan måle på bagefter.');

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'Trin 1 — Stop scrollet.', 'Trin 1 — Skab nysgerrighed.');

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'Trin 2 — Hold på dem.', 'Trin 2 — Skab følelser.');

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'Trin 3 — Få dem til at handle.', 'Trin 3 — Skab engagement.');

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'Målet: en overspringsfrekvens under 40. De første 0-3 sekunder afgør alt — hook, coverbillede, bevægelse. Springer folk over, ser ingen resten, og så er trin 2 og 3 ligegyldige.', 'Målet: over 60% skal se videre efter de første 3 sekunder. Det er her, scrollet stoppes — med hook''et, coverbilledet, bevægelsen, det uventede spørgsmål. Tænk "kender du det?!". Vækker de første 3 sekunder ikke nysgerrighed, ser ingen resten — og så er trin 2 og 3 ligegyldige.');

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'Målet: så lang visningstid som muligt. Én pointe, ingen steder at kede sig, og klip FØR det bliver kedeligt. Visningstiden er algoritmens stærkeste signal — det er den, der afgør, hvor mange flere der får opslaget vist.', 'Målet: fasthold dem længst muligt. Her sætter I ord på det, kunden føler — genkendelsen, situationen, det der rammer. For husk den vigtigste sætning om salg: folk køber ikke på logik, de køber på følelser. Én pointe, ingen steder at kede sig, klip FØR det bliver kedeligt. Visningstiden er algoritmens stærkeste signal — og det er følelsen, der holder på dem.');

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'Én stærk CTA: gem, send, kom ind eller skriv. Et opslag uden handling er underholdning — et opslag med handling er forretning.', 'Målet: at kunden handler på jeres CTA. Én stærk opfordring — gem, send, kom ind eller skriv — aldrig fem. Det er her, følelsen bliver til handling: et gem, en deling, en besked, en kunde ind ad døren. Et opslag uden handling er underholdning — et opslag med handling er forretning.

Tre trin, tre mål: nysgerrighed → følelse → handling. Det er hele raketten. Og det smukke er, at I allerede kender den — det er præcis den vej, jeres eget indhold tager jer igennem, hver gang det virker.');

UPDATE video_opgaver SET manus_tekst = REPLACE(manus_tekst, 'Hooket — de første tre sekunder, der afgør alt.', 'Hooket — de første tre sekunder, der afgør alt, og de tre trin, der får opslaget til at lette: nysgerrighed, følelse, handling.');

-- Tjek bagefter (skal returnere 0):
SELECT COUNT(*) AS gamle_forekomster FROM video_opgaver
WHERE manus_tekst LIKE '%Stop scrollet%' OR manus_tekst LIKE '%indholdets to jobs%' OR manus_tekst LIKE '%Hold på dem%';
