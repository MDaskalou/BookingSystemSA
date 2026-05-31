# ROADMAP — GMed Consulting AB
### ECT/rTMS Remiss- och prioriteringssystem
> Levande arbetslogg · Uppdatera när något är klart eller förändras · Senast justerad: 2026-05-31

---

## Hur du använder den här filen

- Kryssa i `- [x]` när något är klart
- Lägg till datum i parentes när du slutfört något: `- [x] Ringde Max Rindby *(2026-06-03)*`
- Lägg till nya uppgifter löpande under rätt fas
- Skriv anteckningar under varje punkt om du vill komma ihåg detaljer

---

## 🔴 Just nu — denna vecka

- [ ] Registrera i styrelseprotokoll att GMed Consulting AB äger systemet och all kod
- [ ] Ring Max Rindby (chef avd. 80, Psykiatri Affektiva) — be om råd och introduktion
- [ ] Ladda ner alla projektfiler från Claude-konversationen
- [ ] Skapa GitHub-repo `gmed-ect-rtms-system` (privat)
- [ ] Ladda upp alla filer till rätt mappar i repot

---

## 📋 Fas 1 — Förankring och mandat

### Kontakter att ta
- [ ] Ring Max Rindby *(innan möte med Andreas)*
  - Fråga: validera behovet från remittentens sida
  - Fråga: be om introduktion till Andreas Gremyr eller enhetschefen
  - Anteckning: _________________________
- [ ] Kontakta Andreas Gremyr, ePsykiatrienheten (andreas.gremyr@vgregion.se)
  - Nämn: projektet + Innovationsfonden + LIA-förfrågan
  - Anteckning: _________________________
- [ ] Kontakta Zuzana Polievka, NBI (zuzana.polievka@nbi-handelsakademin.se)
  - Fråga: kan jag ordna LIA-plats utanför banken? Kan jag LIA i eget bolag?
  - Anteckning: _________________________
- [ ] Kontakta Innovationsfonden för förcoachning (innovationsfonden@vgregion.se)
  - Anteckning: _________________________

### Dokument att förbereda
- [ ] Fyll i ditt namn i behovsanalysen (v2.docx)
- [ ] Fyll i enhetschefens namn i behovsanalysen
- [ ] Skriv styrelseprotokoll för GMed Consulting AB (IP-ägarskap)
- [ ] Polera prototypen inför första mötet

### Möten att boka
- [ ] 30 min med Max Rindby — råd och introduktion
- [ ] 30 min med Andreas Gremyr — projektpitch + LIA-förfrågan
- [ ] Möte med enhetschefen ECT (om Max kan introducera)

---

## 📋 Fas 2 — VGR IT-processen

- [ ] IT-beställning inlämnad via VGR:s ärendesystem
  - Kräver: enhetschef eller verksamhetschef som beställare
- [ ] Informationssäkerhetsklassning (KLASSA) genomförd
  - Trolig klass: 3 (känsliga personuppgifter)
- [ ] Arkitekturrådet genomfört teknisk granskning
  - Ha redo: UML-diagram, FHIR-mappning, .NET-stack, on-premise-lösning
- [ ] Finansiering beslutad
  - [ ] Förvaltningsbudget
  - [ ] Innovationsfonden (ansökan skickad)
  - [ ] Annat: _________________________

---

## 📋 Fas 3 — LIA och teknisk partner

### LIA-alternativ (september)
- [ ] ePsykiatrienheten — svar från Andreas Gremyr
  - Status: _________________________
- [ ] Sahlgrenska Science Park — undersökt som alternativ
- [ ] Eget bolag (GMed Consulting AB) med extern handledare
  - Möjlig handledare: _________________________
- [ ] NBI bekräftat LIA-platsen formellt

### Teknisk partner (om behövs)
- [ ] Alternativ A: Intern VGR-resurs via IT-beställning
- [ ] Alternativ B: Upphandling via Kammarkollegiets ramavtal
- [ ] Alternativ C: Chalmers/GU akademisk samverkan
  - Kontaktad: _________________________

---

## 📋 Fas 4 — MVP

### Scope (håll det litet)
- [ ] Remissformulär för avdelningar
- [ ] Prioriteringslista för ECT-ssk
- [ ] ÖL-godkännande (digitalt, spårbart)
- [ ] Standby-lista vid avbokningar
- [ ] Koordinator-dashboard med rasthantering
- [ ] Anestesistatus (Orbit-notifiering)
- [ ] Styrdokumentflik

### Lämna till fas 5
- TESSA-integration
- Thymatron-integration
- Blåappen-integration
- Full Melior/Millennium-synk

### Pilotpilotering
- [ ] Testmiljö uppsatt på VGR:s servrar
- [ ] Kör parallellt med manuellt system 4–6 veckor
- [ ] Samla feedback från koordinatorer och avdelningspersonal
- [ ] Dokumentera tidsvinster (mål: visa ROI)
- [ ] Dataskyddsombudet godkänt (starta tidigt — tar 2–4 månader)

---

## 📋 Fas 5 — Produktion och integrationer

- [ ] SITHS-autentisering i produktion
- [ ] TESSA-integration (kapacitetsjustering)
- [ ] Thymatron System IV-integration (EEG/dos → Melior)
- [ ] Blåappen API-integration (MADRS-S status)
- [ ] Full Melior-synk via FHIR R4
- [ ] Millennium-förberedelse (endpoint-byte)
- [ ] Orbit-integration formaliserad

---

## 📋 Fas 6 — Nationell spridning

- [ ] Sahlgrenska = referenskund (klar)
- [ ] Kontaktat Kvalitetsregister ECT (registercentrum.se)
- [ ] Kontaktat Svenska Psykiatriska Föreningen
- [ ] Ansökt till Vitalis-konferensen (Göteborg, årligen)
- [ ] Kontakt med annan region:
  - [ ] Karolinska / Region Stockholm
  - [ ] Akademiska / Region Uppsala
  - [ ] SUS / Region Skåne
  - [ ] Annat: _________________________

---

## 📋 GitHub-repo

- [ ] Repo skapat: `gmed-ect-rtms-system` (privat)
- [ ] Mappstruktur skapad (docs, prototype, presentations, architecture)
- [ ] Filer uppladdade:
  - [ ] `prototype/ect_rtms_dashboard.jsx`
  - [ ] `docs/VGR_Behovsanalys_ECT_rTMS_v2.docx`
  - [ ] `presentations/ECT_rTMS_Enhetschef_Presentation_v2.pptx`
  - [ ] `PROJECT_OVERVIEW.md`
  - [ ] `ROADMAP.md` (den här filen)
  - [ ] `architecture/database_schema.sql`
  - [ ] `architecture/fhir_mapping.md`
  - [ ] `architecture/README_arkitektur.md`
- [ ] README.md skriven och uppladdad
- [ ] Initial commit + push gjord

---

## 📓 Möteslogg

> Fyll i efter varje möte

### Mall
```
**Datum:** YYYY-MM-DD
**Person:** Namn, roll
**Plats:** Telefon / Teams / Fysiskt
**Vad diskuterades:**
**Vad de sa:**
**Nästa steg:**
```

### Möten

*(inga möten ännu)*

---

## 💡 Idéer och tillägg att utvärdera

> Lägg till idéer här utan att de behöver vara beslutade

- [ ] Patientportal (avdelning ser behandlingshistorik)
- [ ] Statistikmodul för enhetschef (kapacitet, väntetider, avvikelser)
- [ ] Automatisk påminnelse till patient/avdelning dagen innan behandling
- [ ] Exportfunktion till Kvalitetsregister ECT
- [ ] Mobilanpassning för koordinatorn
- [ ] Notifieringar via SMS till avdelningen (inte bara e-post)

---

## ⚠️ Risker att hålla koll på

| Risk | Sannolikhet | Åtgärd |
|------|------------|--------|
| VGR IT-process tar för lång tid | Hög | Parallell Chalmers/GU-kontakt |
| Ingen intern champion hittas | Medel | Bredda kontaktnät, fler avdelningar |
| Jävsfråga uppstår | Låg (timanställd) | Transparent hantering, dokumentera |
| Millennium-migrationen tar alla IT-resurser | Medel | Positionera som Millennium-förberedelse |
| Orbit-integration komplicerad | Medel | Notifiering via e-post som MVP-fallback |
| LIA-plats inte godkänd på ePsykiatrienheten | Medel | Science Park eller eget bolag som alternativ |

---

*GMed Consulting AB · Konfidentiellt · Uppdatera filen regelbundet*
