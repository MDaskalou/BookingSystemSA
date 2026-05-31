# GMed Consulting AB — ECT/rTMS Remiss- och prioriteringssystem
### Komplett projektdokumentation · Sahlgrenska Universitetssjukhuset · VGR

---

## Om projektet

**Vad:** Ett digitalt remiss- och prioriteringssystem för ECT- och rTMS-enheten på Sahlgrenska Universitetssjukhuset.

**Varför:** Alla behandlingsremisser hanteras idag via telefon, prioriteringsbeslut fattas muntligt utan dokumentation och hälsodeklarationer skrivs på papper. Det är ett patientsäkerhetsproblem, en juridisk risk för ÖL och en kapacitetsbegränsning som hindrar enheten från att nå sitt mål att öka från 12 till 25 patienter per dag.

**Vem:** Initierat av [Ditt namn], sjuksköterska med erfarenhet från ECT-enheten och systemutvecklare under utbildning (.NET). Projektet drivs via GMed Consulting AB.

---

## Klinisk bakgrund

### ECT-enheten idag
- 3–4 sjuksköterskor hanterar all samordning i överenskommelse med ansvarig överläkare (ÖL)
- Förmiddagsblock ECT: 09:00–12:00, max 12 patienter, 15 min/slot
- Eftermiddagsblock rTMS: 13:00–, 8–10 patienter
- Rast: 12:15–12:45 eller 12:30–13:00 (koordinatorn väljer dag för dag)
- Bufferttid: 12:00–13:00

### Det kliniska flödet (nuläge — manuellt)
1. Psykiatrisk avdelning ringer ECT-ssk för att anmäla patient
2. Ssk antecknar, lägger på minnet eller i Excel
3. Muntligt samråd med ÖL om prioriteringsordning — ingen dokumentation
4. Hälsodeklaration faxas eller lämnas fysiskt
5. Vid anestesibehov: ssk ringer anestesiavdelningen separat (Orbit-systemet)
6. Thymatron-data (EEG/dos) noteras på papper → manuellt in i Melior

### Det kliniska flödet (nytt system)
1. Avdelningen skickar digital remiss med hälsodeklaration via webformulär
2. ECT-ssk ser alla remisser i prioriteringslista, sorterade efter urgensgrad
3. Ssk föreslår schema → ÖL godkänner digitalt med tidsstamp (spårbart)
4. Ssk bekräftar bokning → avdelningen får automatisk notifiering
5. Anestesistatus synlig i dashboarden (Orbit-integration)
6. Thymatron-data flödar automatiskt till Melior/Millennium via FHIR R4

### Roller i systemet
| Roll | Behörighet |
|------|-----------|
| Psykiatrisk avdelning | Skicka remiss, fylla i hälsodeklaration, se status på egna remisser |
| ECT-ssk (3–4 st) | Prioriteringslista, granska remisser, schemalägga, standby-lista |
| ÖL på ECT | Godkänna/ändra schema, beslut loggas med tidsstamp |
| Koordinator | Akutlarm, standby-lista, TESSA-status, rasthantering |

### Akut-spår
Vid vitalindikation (t.ex. suicidrisk) triggas ett systemlarm som når ssk, ÖL och anestesijour simultant — förbigår normalt prioriteringsflöde.

### Kapacitetsmål
Läkarna på ECT-enheten diskuterar en ökning från 12 till 25 patienter per dag, baserat på erfarenheter från Danmark och en enhet i Stockholm (5–10 min/slot). Ett digitalt system är en förutsättning för att detta ska vara koordinerbart.

---

## Teknisk arkitektur

### Produktionsstack (VGR-godkänd)
| Komponent | Val | Motivering |
|-----------|-----|-----------|
| Backend | C# .NET 8 Web API | VGR:s enterprise-standard |
| Frontend | React 18 + TypeScript | VGR IT-standard för gränssnitt |
| Databas | SQL Server on-premise | VGR:s egna servrar — inga amerikanska molntjänster |
| Autentisering | SITHS-kort via VGR LDAP/AD | Regionens befintliga identitetssystem |
| API-standard | FHIR R4 | Millennium-kompatibel från dag ett |
| Hosting | VGR:s egna datahallar | Patientdatalagen, OSL, US CLOUD Act |

### Externa integrationer
| System | Syfte | Status |
|--------|-------|--------|
| Melior | Journalanteckningar, Thymatron-data | FHIR R4-integration |
| Millennium | Framtida ersättare för Melior | FHIR R4 förberedd |
| TESSA | Personalschema → justerar ECT-kapacitet automatiskt | API-läsning |
| Blåappen | MADRS-S skattningsstatus per patient | API-poll |
| Thymatron System IV | EEG-kramptid och dos (mC) | Script-integration |
| Orbit (anestesi) | Anestesibedömning och bekräftelse | Notifiering via funktionsbrevlåda → FHIR på sikt |
| Elvis | Personnummersökning (VGR) | API-anrop i remissformulär |

### Anestesi och Orbit — viktig systemskillnad
ECT-personalen jobbar i Melior. Anestesipersonalen jobbar i Orbit. Det finns ingen automatisk kommunikation mellan systemen idag. Systemet löser detta genom att:
- Flagga patienter som kräver anestesibedömning
- Visa Orbit-status i dashboarden: `ej skickad / inväntar / bekräftad`
- Skicka notifiering direkt till anestesiavdelningen
- När Millennium rullas ut ersätter det både Melior och Orbit — FHIR R4-arkitekturen är redan förberedd

### Databasmodell (förenklad ER)
```
REMISS
  id, pnr (FK→PATIENT), avdelning, behandlingstyp,
  urgensgrad (elektiv/halvakut/akut),
  status (inkommen/granskas/godkänd/avvisad/bokad),
  öl_godkänt, öl_kommentar, inskickad_tid

HÄLSODEKLARATION
  remiss_id (FK), fasta_ok, blodtryck, vikt_kg,
  allergi, läkemedel, extra_info, ifylld_av, tidpunkt

BOKNING
  id, remiss_id (FK), pnr (FK), datum, tidslot,
  status, anestesi_behövs, orbit_status,
  dubbel_pair_id (self-ref, för accelererad rTMS)

PATIENT
  pnr (PK), namn, födelsedat, diagnoskod,
  aktuell_avdelning, standby_prio

THYMATRON_DATA
  bokning_id (FK), kramptid_motor, kramptid_eeg,
  dos_mC, synkad_melior, synk_tidpunkt

TESSA_STATUS
  datum, narkos_tillg, narkos_krav, ssk_tillg, ect_kapacitet

BLÅAPPEN_STATUS
  pnr (FK), datum, madrs_ok, uppdaterad

DOKUMENT
  id, titel, typ, version, giltig_från, giltig_till,
  ansvarig (FK→PERSONAL), dokumentId, verksamhet

PERSONAL
  id, namn, roll (ssk/öl/avdelning/koordinator), tessa_id
```

### FHIR R4-mappning
| Intern entitet | FHIR R4-resurs |
|---------------|---------------|
| REMISS | Appointment (status: proposed → booked) |
| PATIENT | Patient (identifier: SE-personnummer) |
| HÄLSODEKLARATION | QuestionnaireResponse |
| THYMATRON_DATA | Procedure + Observation (LOINC-koder) |
| BLÅAPPEN (MADRS-S) | Observation (LOINC 89206-7) |
| TESSA_STATUS | Schedule + Slot |

---

## Design och UX

### Färgpalett
| Token | HEX | Användning |
|-------|-----|-----------|
| Grön | `#1A9E5F` | Klar — alla förutsättningar uppfyllda |
| Gul | `#D4860A` | Obs — saknad skattning, extra anestesi |
| Röd | `#C42B2B` | Akut, bruten fasta, kritisk varning |
| Blå | `#2563EB` | Slutförd behandling |
| Lila | `#7C3AED` | Dubbelbehandling (accelererad rTMS) |
| Navy | `#0F62A8` | TESSA-topbar, primärknappar |
| Grå (streckad) | `#8494AA` | Personalens rast — ej bokningsbar |

### Systemets tre vyer
1. **Koordinator-dashboard** — realtidsvy 12 ECT-slottar + 8 rTMS-slottar, TESSA-topbar, Orbit-status, rastblock, standby-lista, Thymatron-panel
2. **Remissformulär (avdelning)** — 3-stegsguide: personnummersökning → behandlingstyp + urgensgrad → hälsodeklaration med validering
3. **Styrdokument** — sökbar lista med alla rutiner, riktlinjer och remissvägar med automatisk flaggning vid utgångna dokument

### Rasthantering
- Fast rast varje dag: antingen 12:15–12:45 eller 12:30–13:00
- Koordinatorn väljer aktuellt rastfönster i dashboarden
- Rasten visas som synlig men blockerar inte bokning (koordinatorn behåller möjligheten vid akut)
- Aktuellt rastfönster visas i TESSA-topbaren

---

## Juridik och regelefterlevnad

### Patientdatalagen + OSL
- All patientdata lagras uteslutande på VGR:s egna servrar
- Inga amerikanska molntjänster (AWS, Azure, GCP) — US CLOUD Act-problematiken eliminerad
- KLASSA-klassning genomförs (troligen klass 3 — känsliga personuppgifter)

### GDPR
- Rollbaserad behörighet via SITHS — varje användare ser bara det de behöver
- Full revisionslogg för alla händelser, bokningar och ÖL-beslut
- Automatisk notis 30 dagar innan styrande dokument löper ut

### Jäv och IP
- Projektet ägs av GMed Consulting AB — inte av VGR eller privatpersonen
- Timanställning via bemanningsservice = ingen fast anställning = enklare jävssituation än fastanställd
- All kod, dokumentation och prototyp är bolagets egendom (styrelseprotokoll rekommenderas)

---

## Affärsstrategi

### Marknad
- 46 sjukhus i Sverige erbjuder ECT (Kvalitetsregister ECT, 2021)
- 20 sjukhus erbjuder rTMS
- Alla anslutna till Kvalitetsregistret — ett etablerat nationellt nätverk
- Samma manuella problem finns på alla enheter

### Ingångsstrategi
1. **Sahlgrenska som pilotsite** — ger referenskund som öppnar alla andra dörrar
2. **Nationell spridning** via Kvalitetsregister ECT och Svenska Psykiatriska Föreningen
3. **Vitalis** (Nordens största e-hälsokonferens, Göteborg) — presentationskanal
4. **Övriga regioner** — Stockholm/Karolinska, Uppsala/Akademiska, SUS/Lund

### Vägar in i VGR

#### Rekommenderad ordning
1. **Ring Max Rindby** (verksamhetsutvecklare, Psykiatri Affektiva, chef avd. 80) — varm kontakt, validerar behovet från remittentens sida, kan introducera till rätt personer
2. **Kontakta Andreas Gremyr** (enhetschef ePsykiatrienheten, andreas.gremyr@vgregion.se) — deras uppdrag är exakt detta
3. **Innovationsfonden** — VGR avsätter 20 mkr/år, 44% beviljandegrad, kräver intern medsökande
4. **LIA på ePsykiatrienheten** (september) — löser mandatproblemet, ger intern status

#### Finansieringsalternativ
| Källa | Typ | Kräver |
|-------|-----|--------|
| Innovationsfonden VGR | Bidrag upp till ~500 kkr | Intern VGR-medsökande |
| Sahlgrenska Science Park CO-AX | Accelerator + kapital | Registrerat bolag |
| Vinnova "Hälsa" | Bidrag upp till 300 kkr | Bolag, ansökan |
| Almi Innovationslån | Lån tidigt skede | Bolag, affärsplan |
| Medtech4Health | Bidrag, medicinsk teknik | Bolag, klinisk partner |

#### Juridisk ingång — LOU kap. 19 (innovationsupphandling)
VGR kan upphandla FoU och innovation med speciellt undantag för innovativa lösningar. Mindre konkurrens, VGR kan finansiera utvecklingen medan GMed Consulting AB behåller IP.

---

## Nyckelkontakter

| Person | Roll | Relevans |
|--------|------|---------|
| Max Rindby | Verksamhetsutvecklare, chef avd. 80, Psykiatri Affektiva | Varm kontakt, validerar behovet inifrån, remittentperspektiv |
| Andreas Gremyr | Enhetschef ePsykiatrienheten (PhD, leg. psykolog) | Rätt organisation för samarbete |
| Mathias Alvidius | Verksamhetschef Psykiatri Affektiva | Max Rindbys chef, kan medsöka Innovationsfonden |
| Zuzana Polievka | Utbildningsledare NBI Handelsakademin Göteborg | LIA-samordning, zuzana.polievka@nbi-handelsakademin.se |
| innovationsfonden@vgregion.se | Innovationsfonden VGR | Förcoachning och ansökan |

---

## Nästa steg (prioriterad ordning)

- [ ] **Denna vecka:** Ring Max Rindby — be om råd och introduktion
- [ ] **Denna vecka:** Registrera i styrelseprotokoll att GMed Consulting AB äger systemet
- [ ] **Nästa vecka:** Ring Andreas Gremyr på ePsykiatrienheten
- [ ] **Parallellt:** Kontakta Zuzana Polievka om LIA-möjlighet på ePsykiatrienheten
- [ ] **Parallellt:** Kontakta innovationsfonden@vgregion.se för förcoachning
- [ ] **Inför möten:** Polera prototypen — visa med riktiga VGR-dokument (Max Rindbys dokument är redan inlagt)
- [ ] **Ladda upp repot:** Följ GitHub-guiden och strukturera koden

---

## Vad du säger i en intervju

### Din berättelse (30 sekunder)
> "Jag är sjuksköterska med erfarenhet från ECT-enheten på Sahlgrenska och håller på att utbilda mig till .NET-utvecklare. Jag såg ett konkret problem — all remisshantering sker via telefon, prioriteringsbeslut fattas muntligt utan dokumentation, och vid akut ECT finns inget systemlarm. Jag har byggt en prototyp av ett digitalt remiss- och prioriteringssystem anpassat för VGR:s tekniska krav — C# .NET 8, FHIR R4, on-premise. Systemet ägs av mitt bolag GMed Consulting AB."

### Tekniska nyckelord att nämna
- C# .NET 8, React/TypeScript, SQL Server
- FHIR R4, HL7, API-first-arkitektur
- SITHS-autentisering, VGR LDAP/AD
- Patientdatalagen, KLASSA-klassning
- Melior, Orbit, TESSA, Blåappen, Millennium
- Innovationsupphandling LOU kap. 19

### Varför kombinationen ssk + utvecklare är unik
Det finns i Sverige ett fåtal personer som har klinisk ssk-bakgrund inom ECT OCH håller på att bli systemutvecklare. Det eliminerar behovet av en mellanhand för att översätta kliniska krav till tekniska specifikationer — du är båda personerna.

---

## Levererade filer

| Fil | Innehåll |
|-----|---------|
| `prototype/ect_rtms_dashboard.jsx` | Interaktiv React-prototyp — koordinator-dashboard, remissguide, styrdokumentflik |
| `docs/VGR_Behovsanalys_ECT_rTMS_v2.docx` | Komplett behovsanalys för VGR IT-beställning |
| `presentations/ECT_rTMS_Enhetschef_Presentation_v2.pptx` | 8-sidig presentation för enhetschef |
| `architecture/database_schema.sql` | Fullständig databasmodell |
| `architecture/fhir_mapping.md` | FHIR R4-mappning mot VGR-system |
| `PROJECT_OVERVIEW.md` | Detta dokument |

---

*Senast uppdaterad: 2026-05-31 · GMed Consulting AB · Konfidentiellt*
