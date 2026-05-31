import { useState, useEffect } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const TODAY = new Date().toLocaleDateString("sv-SE");

const TESSA_STATUS = {
  narkos: { available: 3, required: 3, ok: true },
  sjukskoterska: { available: 4, required: 4, ok: true },
  lastFetch: "07:42",
};

const STANDBY_LIST = [
  { id: "196504231234", name: "Andersson, Britta", ward: "Avd 361", urgency: "hög" },
  { id: "197812054567", name: "Lindqvist, Göran", ward: "Avd 362", urgency: "medel" },
  { id: "200103127890", name: "Svensson, Klara", ward: "Avd 360", urgency: "medel" },
];

const initialEctSlots = [
  { id: 1,  time: "09:00", patient: "Johansson, Erik",   pnr: "196701234567", status: "klar",    blaaappen: true,  halsodekl: true,  anestesi: false, orbitStatus: null,         note: "" },
  { id: 2,  time: "09:15", patient: "Magnusson, Sara",   pnr: "198503127891", status: "klar",    blaaappen: true,  halsodekl: true,  anestesi: true,  orbitStatus: "bekraftad",  note: "Anestesibedömning bekräftad" },
  { id: 3,  time: "09:30", patient: "Nilsson, Per",      pnr: "195908234512", status: "varning", blaaappen: false, halsodekl: true,  anestesi: false, orbitStatus: null,         note: "MADRS-S ej ifylld" },
  { id: 4,  time: "09:45", patient: "Karlsson, Anna",    pnr: "197205281234", status: "klar",    blaaappen: true,  halsodekl: true,  anestesi: false, orbitStatus: null,         note: "" },
  { id: 5,  time: "10:00", patient: "Lindberg, Olle",    pnr: "196312041234", status: "klar",    blaaappen: true,  halsodekl: true,  anestesi: false, orbitStatus: null,         note: "" },
  { id: 6,  time: "10:15", patient: "Gustafsson, Maria", pnr: "199001157891", status: "slutford",blaaappen: true,  halsodekl: true,  anestesi: false, orbitStatus: null,         note: "" },
  { id: 7,  time: "10:30", patient: "Pettersson, Lars",  pnr: "197506234512", status: "klar",    blaaappen: true,  halsodekl: true,  anestesi: true,  orbitStatus: "inväntar",   note: "Väntar på Orbit-bekräftelse" },
  { id: 8,  time: "10:45", patient: "Eriksson, Ingrid",  pnr: "195804121234", status: "akut",    blaaappen: false, halsodekl: false, anestesi: true,  orbitStatus: "ej_skickad", note: "AKUT – suicidrisk" },
  { id: 9,  time: "11:00", patient: "Håkansson, Björn",  pnr: "198812074567", status: "varning", blaaappen: true,  halsodekl: false, anestesi: false, orbitStatus: null,         note: "Bruten fasta" },
  { id: 10, time: "11:15", patient: "Henriksson, Eva",   pnr: "197103234512", status: "klar",    blaaappen: true,  halsodekl: true,  anestesi: false, orbitStatus: null,         note: "" },
  { id: 11, time: "11:30", patient: "Persson, Johan",    pnr: "196508121234", status: "klar",    blaaappen: true,  halsodekl: true,  anestesi: false, orbitStatus: null,         note: "" },
  { id: 12, time: "11:45", patient: "Svensson, Maj",     pnr: "195212041234", status: "ledig",   blaaappen: false, halsodekl: false, anestesi: false, orbitStatus: null,         note: "" },
];

const initialRtmsSlots = [
  { id: 101, time: "13:00", patient: "Holm, Cecilia", pnr: "199205234512", dubbel: true, dubbelPair: 102, status: "klar", blaaappen: true },
  { id: 102, time: "13:30", patient: "Holm, Cecilia", pnr: "199205234512", dubbel: true, dubbelPair: 101, status: "klar", blaaappen: true },
  { id: 103, time: "13:15", patient: "Lund, Stig", pnr: "196710041234", dubbel: false, dubbelPair: null, status: "klar", blaaappen: false },
  { id: 104, time: "14:00", patient: "Bergström, Lisa", pnr: "199812157891", dubbel: false, dubbelPair: null, status: "klar", blaaappen: true },
  { id: 105, time: "14:30", patient: "Fransson, Kurt", pnr: "197405234512", dubbel: true, dubbelPair: 106, status: "klar", blaaappen: true },
  { id: 106, time: "15:00", patient: "Fransson, Kurt", pnr: "197405234512", dubbel: true, dubbelPair: 105, status: "klar", blaaappen: true },
  { id: 107, time: "15:30", patient: "Åberg, Nina", pnr: "198612041234", dubbel: false, dubbelPair: null, status: "klar", blaaappen: true },
  { id: 108, time: "16:00", patient: "", pnr: "", dubbel: false, dubbelPair: null, status: "ledig", blaaappen: false },
];

// ─── DOKUMENT DATA ────────────────────────────────────────────────────────────
const DOKUMENT = [
  {
    id: 1, titel: "ECT – elektrokonvulsiv behandling",
    typ: "rutin", verksamhet: "Psykiatri Affektiva",
    version: "8.0", ansvarig: "Max Rindby",
    giltigFran: "2024-09-27", giltigTill: "2026-09-27",
    dokumentId: "SU9806-1988473940-272",
    status: "giltig",
    beskrivning: "Rutin för ECT-behandling inkl. indikationer, kontraindikationer, anestesiprotokoll och uppföljning.",
    lank: "https://mellanarkiv-offentlig.vgregion.se",
  },
  {
    id: 2, titel: "rTMS – remisshantering och prioritering",
    typ: "rutin", verksamhet: "Psykiatri Affektiva",
    version: "3.2", ansvarig: "Max Rindby",
    giltigFran: "2024-03-01", giltigTill: "2026-03-01",
    dokumentId: "SU9806-1988473940-318",
    status: "giltig",
    beskrivning: "Rutin för remisshantering, urvalskriterier och prioriteringsordning vid rTMS-behandling.",
    lank: "#",
  },
  {
    id: 3, titel: "Hälsodeklaration inför ECT – checklista",
    typ: "checklista", verksamhet: "Psykiatri Affektiva",
    version: "5.1", ansvarig: "Max Rindby",
    giltigFran: "2023-11-01", giltigTill: "2025-11-01",
    dokumentId: "SU9806-1988473940-201",
    status: "utgangen",
    beskrivning: "Checklista för hälsodeklaration inkl. fastekrav, läkemedel, allergi och anestesibedömning.",
    lank: "#",
  },
  {
    id: 4, titel: "Akut ECT – vitalindikation och larmrutin",
    typ: "rutin", verksamhet: "Psykiatri Affektiva",
    version: "2.0", ansvarig: "Max Rindby",
    giltigFran: "2024-01-15", giltigTill: "2026-01-15",
    dokumentId: "SU9806-1988473940-290",
    status: "giltig",
    beskrivning: "Rutin för akut ECT vid vitalindikation, inkl. larmkedja, anestesijour och dokumentationskrav.",
    lank: "#",
  },
  {
    id: 5, titel: "Kliniska riktlinjer ECT – Svenska Psykiatriska Föreningen",
    typ: "riktlinje", verksamhet: "Nationell",
    version: "2017", ansvarig: "SPF",
    giltigFran: "2017-01-01", giltigTill: "2027-01-01",
    dokumentId: "SPF-ECT-2017",
    status: "giltig",
    beskrivning: "Nationella kliniska riktlinjer för ECT. Indikatorer, indikationer och kvalitetskrav.",
    lank: "http://www.svenskpsykiatri.se/wp-content/uploads/2017/02/SPF-kliniska-riktlinjer-om-ECT.pdf",
  },
  {
    id: 6, titel: "Remissvägar till ECT från Psykiatri Affektiva",
    typ: "remissvag", verksamhet: "Psykiatri Affektiva",
    version: "1.3", ansvarig: "Mathias Alvidius",
    giltigFran: "2024-06-01", giltigTill: "2026-06-01",
    dokumentId: "SU9806-1988473940-355",
    status: "utgarsSnart",
    beskrivning: "Beskriver behöriga remittenter, remisskriterier och ansvar vid remittering från Psykiatri Affektiva till ECT.",
    lank: "#",
  },
  {
    id: 7, titel: "Thymatron System IV – driftrutin och underhåll",
    typ: "rutin", verksamhet: "ECT-enheten",
    version: "4.0", ansvarig: "ECT-koordinator",
    giltigFran: "2023-05-01", giltigTill: "2025-05-01",
    dokumentId: "SU9806-1988473940-189",
    status: "utgangen",
    beskrivning: "Driftrutin för Thymatron System IV inkl. daglig kontroll, felhantering och servicekontakter.",
    lank: "#",
  },
  {
    id: 8, titel: "Kvalitetsregister ECT – rapporteringsrutin",
    typ: "rutin", verksamhet: "ECT-enheten",
    version: "2.1", ansvarig: "ECT-koordinator",
    giltigFran: "2024-01-01", giltigTill: "2026-01-01",
    dokumentId: "SU9806-1988473940-412",
    status: "giltig",
    beskrivning: "Rutin för rapportering till Nationellt Kvalitetsregister ECT inkl. tidpunkter och ansvarig.",
    lank: "https://ect.registercentrum.se",
  },
];

// ─── COLOUR TOKENS ────────────────────────────────────────────────────────────
const C = {
  ok:      "#1A9E5F",
  okBg:    "#E8F7F1",
  warn:    "#D4860A",
  warnBg:  "#FEF3DC",
  akut:    "#C42B2B",
  akutBg:  "#FDEAEA",
  ledigt:  "#6B7280",
  ledigBg: "#F3F4F6",
  slutford:"#2563EB",
  slutfordBg:"#EFF6FF",
  bg:      "#F0F4F8",
  surface: "#FFFFFF",
  border:  "#DDE3EC",
  text:    "#1A2332",
  textMid: "#4B5770",
  textSub: "#8494AA",
  dubbel:  "#7C3AED",
  dubbelBg:"#F5F0FF",
  tessa:   "#0F62A8",
  blue:    "#1A4F8A",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function statusColor(s) {
  if (s === "akut") return { bg: C.akutBg, border: C.akut, dot: C.akut, label: "AKUT", labelColor: C.akut };
  if (s === "varning") return { bg: C.warnBg, border: C.warn, dot: C.warn, label: "Obs", labelColor: C.warn };
  if (s === "klar") return { bg: C.okBg, border: C.ok, dot: C.ok, label: "Klar", labelColor: C.ok };
  if (s === "slutford") return { bg: C.slutfordBg, border: C.slutford, dot: C.slutford, label: "Slutförd", labelColor: C.slutford };
  return { bg: C.ledigBg, border: C.border, dot: C.ledigt, label: "Ledig", labelColor: C.ledigt };
}

function Icon({ name, size = 14, color = "currentColor" }) {
  const icons = {
    check: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
    warn: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 2L14.5 13H1.5L8 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 6v3.5M8 11v.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 3h3l1 3-1.5 1.5c.9 1.8 2.2 3.1 4 4L11 10l3 1v3a1 1 0 01-1 1C5.4 15 1 10.6 1 4a1 1 0 011-1z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    bolt: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M9 1L3 9h5l-1 6 6-8H8L9 1z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    link: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M7 9a3 3 0 004.24.24l2-2a3 3 0 00-4.24-4.24L7.5 4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M9 7a3 3 0 00-4.24-.24l-2 2a3 3 0 004.24 4.24l1.5-1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke={color} strokeWidth="1.3"/><path d="M2 14c0-3 2.686-5 6-5s6 2 6 5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.3"/><path d="M8 4.5V8l2.5 2" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>,
    swap: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 5h10M11 3l2 2-2 2M13 11H3M5 9l-2 2 2 2" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };
  return icons[name] || null;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Pill({ text, color, bg }) {
  return (
    <span style={{
      background: bg, color, fontSize: 10, fontWeight: 700,
      padding: "2px 7px", borderRadius: 99, letterSpacing: "0.04em",
      textTransform: "uppercase", whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

function TessaBar({ slots, tessa, rast }) {
  const narOk = tessa.narkos.ok;
  return (
    <div style={{
      background: C.tessa, color: "#fff",
      padding: "8px 20px", display: "flex", gap: 32, alignItems: "center",
      fontSize: 12, fontFamily: "'DM Mono', monospace",
    }}>
      <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.06em" }}>
        TESSA <span style={{ opacity: 0.6, fontWeight: 400 }}>{tessa.lastFetch}</span>
      </span>
      <span>
        Narkos: <b style={{ color: narOk ? "#7EFFC0" : "#FFB4B4" }}>
          {tessa.narkos.available}/{tessa.narkos.required}
        </b>
      </span>
      <span>
        Ssk: <b style={{ color: tessa.sjukskoterska.ok ? "#7EFFC0" : "#FFB4B4" }}>
          {tessa.sjukskoterska.available}/{tessa.sjukskoterska.required}
        </b>
      </span>
      <span style={{ opacity: 0.7 }}>
        ☕ Rast: <b style={{ color: "#FFE599" }}>
          {rast === "A" ? "12:15–12:45" : "12:30–13:00"}
        </b>
      </span>
      <span style={{ marginLeft: "auto" }}>
        ECT-kapacitet: <b>{slots.filter(s => s.status !== "ledig").length}/12</b>
      </span>
      <span>
        Akuta: <b style={{ color: slots.some(s => s.status === "akut") ? "#FFB4B4" : "#7EFFC0" }}>
          {slots.filter(s => s.status === "akut").length}
        </b>
      </span>
    </div>
  );
}

function BlaaappenDot({ ok }) {
  return (
    <span title={ok ? "Blåappen: skattning klar" : "Blåappen: saknas"} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 18, height: 18, borderRadius: "50%",
      background: ok ? C.ok : C.warn, flexShrink: 0,
    }}>
      {ok
        ? <Icon name="check" size={10} color="#fff" />
        : <Icon name="x" size={10} color="#fff" />}
    </span>
  );
}

function HalsoDot({ ok }) {
  return (
    <span title={ok ? "Hälsodeklaration klar" : "Hälsodeklaration saknas"} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 18, height: 18, borderRadius: "50%",
      background: ok ? C.ok : C.akut, flexShrink: 0,
    }}>
      {ok
        ? <Icon name="check" size={10} color="#fff" />
        : <Icon name="warn" size={10} color="#fff" />}
    </span>
  );
}

function OrbitDot({ status }) {
  if (!status) return null;
  const cfg = {
    bekraftad:  { bg: C.ok,   label: "Orbit: Anestesibedömning bekräftad",   text: "✓" },
    inväntar:   { bg: C.warn, label: "Orbit: Väntar på anestesibekräftelse",  text: "…" },
    ej_skickad: { bg: C.akut, label: "Orbit: Anmälan EJ skickad till Orbit",  text: "!" },
  }[status];
  if (!cfg) return null;
  return (
    <span
      title={cfg.label}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        background: cfg.bg, fontSize: 10, fontWeight: 700, color: "#fff",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {cfg.text}
    </span>
  );
}

function EctSlot({ slot, onCancel, onFill, onOrbit }) {
  const col = statusColor(slot.status);
  const isEmpty = slot.status === "ledig";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 12px", borderRadius: 8, marginBottom: 4,
      background: col.bg,
      border: `1.5px solid ${isEmpty ? C.border : col.border}`,
      transition: "box-shadow 0.15s",
      cursor: isEmpty ? "default" : "pointer",
      position: "relative",
    }}>
      {/* Status stripe */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        borderRadius: "8px 0 0 8px",
        background: isEmpty ? C.border : col.dot,
      }} />

      {/* Time */}
      <span style={{
        minWidth: 40, fontSize: 12, fontWeight: 700,
        color: C.textSub, fontFamily: "'DM Mono', monospace", marginLeft: 6,
      }}>{slot.time}</span>

      {/* Patient info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {isEmpty ? (
          <span style={{ color: C.ledigt, fontSize: 12, fontStyle: "italic" }}>Ledig slot</span>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {slot.patient}
            </div>
            {slot.note ? (
              <div style={{ fontSize: 11, color: col.labelColor, marginTop: 1 }}>{slot.note}</div>
            ) : null}
          </>
        )}
      </div>

      {/* Badges */}
      {!isEmpty && (
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <BlaaappenDot ok={slot.blaaappen} />
          <HalsoDot ok={slot.halsodekl} />
          {slot.anestesi && <OrbitDot status={slot.orbitStatus || "ej_skickad"} />}
          <Pill text={col.label} color={col.labelColor} bg={col.bg} />
        </div>
      )}

      {/* Orbit-knapp: visa om anestesi behövs men ej skickad */}
      {!isEmpty && slot.anestesi && slot.orbitStatus === "ej_skickad" && (
        <button
          onClick={() => onOrbit(slot.id)}
          title="Skicka anmälan till Orbit (anestesi)"
          style={{
            border: `1px solid ${C.warn}`, background: C.warnBg,
            color: C.warn, cursor: "pointer", padding: "3px 7px",
            borderRadius: 4, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
          }}
        >
          → Orbit
        </button>
      )}

      {/* Actions */}
      {!isEmpty && slot.status !== "slutford" && (
        <button onClick={() => onCancel(slot.id)} style={{
          border: "none", background: "transparent", cursor: "pointer",
          color: C.textSub, padding: "2px 4px", borderRadius: 4,
          fontSize: 10, transition: "color 0.1s",
        }} title="Avboka">✕</button>
      )}
      {isEmpty && (
        <button onClick={() => onFill(slot.id)} style={{
          border: `1px dashed ${C.ok}`, background: "transparent",
          color: C.ok, cursor: "pointer", padding: "3px 8px",
          borderRadius: 4, fontSize: 11, fontWeight: 600,
        }}>+ Fyll</button>
      )}
    </div>
  );
}

function RtmsSlot({ slot }) {
  const col = statusColor(slot.status);
  const isEmpty = slot.status === "ledig";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 12px", borderRadius: 8, marginBottom: 4,
      background: slot.dubbel ? C.dubbelBg : col.bg,
      border: `1.5px solid ${slot.dubbel ? C.dubbel : (isEmpty ? C.border : col.border)}`,
      position: "relative",
    }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        borderRadius: "8px 0 0 8px",
        background: slot.dubbel ? C.dubbel : (isEmpty ? C.border : col.dot),
      }} />
      <span style={{ minWidth: 40, fontSize: 12, fontWeight: 700, color: C.textSub, fontFamily: "'DM Mono', monospace", marginLeft: 6 }}>
        {slot.time}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {isEmpty ? (
          <span style={{ color: C.ledigt, fontSize: 12, fontStyle: "italic" }}>Ledig slot</span>
        ) : (
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{slot.patient}</div>
        )}
      </div>
      {!isEmpty && (
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <BlaaappenDot ok={slot.blaaappen} />
          {slot.dubbel && (
            <span title="Dubbelbehandling" style={{ color: C.dubbel }}>
              <Icon name="link" size={14} color={C.dubbel} />
            </span>
          )}
          {slot.dubbel && <Pill text="Dubbel" color={C.dubbel} bg={C.dubbelBg} />}
        </div>
      )}
    </div>
  );
}

function StandbyModal({ onClose, onBook }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,18,32,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{
        background: C.surface, borderRadius: 16, padding: 28,
        width: 480, boxShadow: "0 24px 60px rgba(10,18,32,0.22)",
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: "'DM Serif Display', serif" }}>
              Sista-minuten: Standby-lista
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: C.textSub }}>
              Välj patient från inneliggande avdelningar
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.textSub }}>×</button>
        </div>
        {STANDBY_LIST.map(p => (
          <div key={p.id} onClick={() => setSelected(p.id)}
            style={{
              padding: "12px 16px", borderRadius: 8, marginBottom: 8, cursor: "pointer",
              border: `2px solid ${selected === p.id ? C.ok : C.border}`,
              background: selected === p.id ? C.okBg : C.surface,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{p.name}</div>
              <div style={{ fontSize: 11, color: C.textSub }}>{p.ward} · {p.pnr}</div>
            </div>
            <Pill
              text={p.urgency === "hög" ? "Hög prio" : "Medel"}
              color={p.urgency === "hög" ? C.akut : C.warn}
              bg={p.urgency === "hög" ? C.akutBg : C.warnBg}
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 18px", borderRadius: 8, border: `1px solid ${C.border}`,
            background: "none", cursor: "pointer", fontSize: 13, color: C.textMid,
          }}>Avbryt</button>
          <button disabled={!selected} onClick={() => onBook(STANDBY_LIST.find(p => p.id === selected))} style={{
            padding: "8px 18px", borderRadius: 8, border: "none",
            background: selected ? C.ok : C.border, color: "#fff",
            cursor: selected ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 700,
          }}>Boka in patient</button>
        </div>
      </div>
    </div>
  );
}

function AkutModal({ onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,18,32,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{
        background: C.surface, borderRadius: 16, padding: 28, width: 440,
        boxShadow: "0 24px 60px rgba(196,43,43,0.3)", border: `2px solid ${C.akut}`,
      }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ background: C.akutBg, borderRadius: 10, padding: 10, flexShrink: 0 }}>
            <Icon name="bolt" size={22} color={C.akut} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: C.akut, fontFamily: "'DM Serif Display', serif" }}>
              AKUT ECT – Systemlarm
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: C.textSub }}>
              Larm har skickats till koordinator och anestesijouren
            </p>
          </div>
        </div>
        <div style={{ background: C.akutBg, borderRadius: 8, padding: 14, fontSize: 12, color: C.text, lineHeight: 1.6 }}>
          <b>Patient:</b> Eriksson, Ingrid · 195804121234<br/>
          <b>Indikation:</b> Vitalindikation – suicidrisk<br/>
          <b>Typ:</b> Akut ECT (eftermiddagsblock)<br/>
          <b>Tid:</b> Snarast möjligt<br/>
          <b>Anestesijour:</b> Notifierad 10:48
        </div>
        <button onClick={onClose} style={{
          marginTop: 18, width: "100%", padding: "10px", borderRadius: 8,
          background: C.akut, border: "none", color: "#fff",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>Bekräfta larm mottaget</button>
      </div>
    </div>
  );
}

function LegendRow({ color, bg, label, desc }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}</span>
      <span style={{ fontSize: 11, color: C.textSub }}>{desc}</span>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// Rastblock komponent
function RastBlock({ rast, onByt }) {
  return (
    <div style={{
      margin: "6px 0", borderRadius: 8,
      border: `1.5px dashed ${C.textSub}`,
      background: "#F8F9FB",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 4, height: 36, borderRadius: 2,
            background: "repeating-linear-gradient(180deg, #8494AA 0px, #8494AA 4px, transparent 4px, transparent 8px)",
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid }}>
              ☕ Rast personal
            </div>
            <div style={{ fontSize: 11, color: C.textSub, fontFamily: "'DM Mono', monospace" }}>
              {rast === "A" ? "12:15 – 12:45" : "12:30 – 13:00"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
            background: "#EEF0F3", color: C.textSub,
            textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            Ej bokningsbar
          </span>
          <button
            onClick={onByt}
            title="Byt rastfönster"
            style={{
              background: "none", border: `1px solid ${C.border}`,
              borderRadius: 6, cursor: "pointer", padding: "3px 8px",
              fontSize: 10, color: C.textSub, fontWeight: 600,
            }}
          >
            {rast === "A" ? "→ 12:30" : "→ 12:15"}
          </button>
        </div>
      </div>
      {/* Tidslinje */}
      <div style={{
        margin: "0 12px 8px",
        height: 4, borderRadius: 2, background: C.border, position: "relative",
      }}>
        <div style={{
          position: "absolute", left: rast === "A" ? "25%" : "50%",
          width: "50%", height: "100%", borderRadius: 2,
          background: C.textSub,
        }} />
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between",
        padding: "0 12px 8px", fontSize: 10, color: C.textSub,
        fontFamily: "'DM Mono', monospace",
      }}>
        <span>12:00</span>
        <span>12:15</span>
        <span>12:30</span>
        <span>12:45</span>
        <span>13:00</span>
      </div>
    </div>
  );
}

export default function App() {
  const [ectSlots, setEctSlots] = useState(initialEctSlots);
  const [showStandby, setShowStandby] = useState(false);
  const [vacantSlotId, setVacantSlotId] = useState(null);
  const [showAkut, setShowAkut] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [rastFonster, setRastFonster] = useState("A"); // "A" = 12:15-12:45, "B" = 12:30-13:00

  // Check if akut exists on load
  useEffect(() => {
    if (ectSlots.some(s => s.status === "akut")) {
      setTimeout(() => setShowAkut(true), 900);
    }
  }, []);

  function triggerToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleCancel(id) {
    setEctSlots(prev => prev.map(s =>
      s.id === id ? { ...s, status: "ledig", patient: "", pnr: "", note: "", blaaappen: false, halsodekl: false, anestesi: false } : s
    ));
    setVacantSlotId(id);
    triggerToast("Slot avbokad – öppna standby-listan för att fylla platsen.", "warn");
    setTimeout(() => setShowStandby(true), 600);
  }

  function handleFill(id) {
    setVacantSlotId(id);
    setShowStandby(true);
  }

  function handleBook(patient) {
    if (!vacantSlotId) return;
    setEctSlots(prev => prev.map(s =>
      s.id === vacantSlotId
        ? { ...s, status: "klar", patient: patient.name, pnr: patient.id, note: `${patient.ward}`, blaaappen: false, halsodekl: true, anestesi: false }
        : s
    ));
    setShowStandby(false);
    setVacantSlotId(null);
    triggerToast(`${patient.name} inbokad från standby-listan.`, "ok");
  }

  const ectCount = ectSlots.filter(s => s.status !== "ledig").length;
  const rtmsSlots = initialRtmsSlots;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #DDE3EC; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, height: 56 }}>
          <div style={{
            background: "#0F62A8", borderRadius: 8, width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="bolt" size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: C.text, lineHeight: 1 }}>
              ECT & rTMS Enheten
            </div>
            <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>
              Sahlgrenska Universitetssjukhuset · {TODAY}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {[
              { id: "dashboard", label: "Koordinator" },
              { id: "bokning",   label: "Ny bokning" },
              { id: "dokument",  label: "Styrdokument" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: activeTab === tab.id ? C.tessa : "transparent",
                color: activeTab === tab.id ? "#fff" : C.textMid,
                position: "relative",
              }}>
                {tab.label}
                {tab.id === "dokument" && DOKUMENT.some(d => d.status === "utgangen" || d.status === "utgarsSnart") && (
                  <span style={{
                    position: "absolute", top: 2, right: 2,
                    width: 7, height: 7, borderRadius: "50%",
                    background: C.warn, display: "inline-block",
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TESSA Bar */}
      <TessaBar slots={ectSlots} tessa={TESSA_STATUS} rast={rastFonster} />

      {activeTab === "dashboard" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, padding: 20, maxWidth: 1200, margin: "0 auto" }}>

          {/* ECT Column */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: "'DM Serif Display', serif", fontSize: 20, color: C.text }}>
                  ECT – Förmiddagsblock
                </h2>
                <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>
                  09:00–12:00 · Kapacitet: {ectCount}/12 · Rast: {rastFonster === "A" ? "12:15–12:45" : "12:30–13:00"}
                </div>
              </div>
              <div style={{
                background: ectCount >= 12 ? C.akutBg : C.okBg,
                color: ectCount >= 12 ? C.akut : C.ok,
                border: `1px solid ${ectCount >= 12 ? C.akut : C.ok}`,
                borderRadius: 8, padding: "4px 12px", fontSize: 14, fontWeight: 700,
              }}>
                {ectCount}/12
              </div>
            </div>

            <div>
              {ectSlots.map(slot => (
                <EctSlot key={slot.id} slot={slot} onCancel={handleCancel} onFill={handleFill} />
              ))}
            </div>

            {/* Rastblock */}
            <RastBlock rast={rastFonster} onByt={() => setRastFonster(r => r === "A" ? "B" : "A")} />

            {/* Legend */}
            <div style={{ marginTop: 16, background: C.surface, borderRadius: 10, padding: 14, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Färgkoder
              </div>
              <LegendRow color={C.ok} label="Grön (#1A9E5F)" desc="Klar – alla förutsättningar uppfyllda" />
              <LegendRow color={C.warn} label="Gul (#D4860A)" desc="Obs – saknad skattning / extra anestesi" />
              <LegendRow color={C.akut} label="Röd (#C42B2B)" desc="Akut / Bruten fasta / Kritisk varning" />
              <LegendRow color={C.slutford} label="Blå (#2563EB)" desc="Slutförd behandling" />
              <LegendRow color={C.dubbel} label="Lila (#7C3AED)" desc="Dubbelbehandling (accelererad rTMS)" />
              <LegendRow color={C.textSub} label="Grå (streckad)" desc="Personalens rast – ej bokningsbar" />
            </div>
          </div>

          {/* rTMS Column */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: "'DM Serif Display', serif", fontSize: 20, color: C.text }}>
                  rTMS – Eftermiddagsblock
                </h2>
                <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>
                  13:00– · Kapacitet: {rtmsSlots.filter(s => s.status !== "ledig").length}/8
                </div>
              </div>
              <div style={{
                background: C.okBg, color: C.ok,
                border: `1px solid ${C.ok}`,
                borderRadius: 8, padding: "4px 12px", fontSize: 14, fontWeight: 700,
              }}>
                {rtmsSlots.filter(s => s.status !== "ledig").length}/8
              </div>
            </div>

            {/* Dubbel group visual */}
            <div style={{ background: C.dubbelBg, border: `1px dashed ${C.dubbel}`, borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: C.dubbel, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="link" size={12} color={C.dubbel} /> Dubbelbehandling – Holm, Cecilia
              </div>
              {rtmsSlots.filter(s => s.pnr === "199205234512").map(slot => (
                <RtmsSlot key={slot.id} slot={slot} />
              ))}
            </div>

            {/* Dubbel group 2 */}
            <div style={{ background: C.dubbelBg, border: `1px dashed ${C.dubbel}`, borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: C.dubbel, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="link" size={12} color={C.dubbel} /> Dubbelbehandling – Fransson, Kurt
              </div>
              {rtmsSlots.filter(s => s.pnr === "197405234512").map(slot => (
                <RtmsSlot key={slot.id} slot={slot} />
              ))}
            </div>

            {/* Single slots */}
            <div>
              {rtmsSlots.filter(s => !s.dubbel).map(slot => (
                <RtmsSlot key={slot.id} slot={slot} />
              ))}
            </div>

            {/* Thymatron panel */}
            <div style={{ marginTop: 16, background: C.surface, borderRadius: 10, padding: 14, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Thymatron System IV – senaste data
              </div>
              {[
                { name: "Johansson, Erik", tid: "09:12", motorisk: "28 s", eeg: "42 s", dos: "147 mC", status: "ok" },
                { name: "Gustafsson, Maria", tid: "10:18", motorisk: "31 s", eeg: "47 s", dos: "162 mC", status: "ok" },
              ].map((t, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0", borderBottom: i === 0 ? `1px solid ${C.border}` : "none",
                  fontSize: 12,
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ color: C.textSub }}>Behandlad {t.tid}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, color: C.textMid }}>
                    <span><b>Motorisk:</b> {t.motorisk}</span>
                    <span><b>EEG:</b> {t.eeg}</span>
                    <span><b>Dos:</b> {t.dos}</span>
                    <Icon name="check" size={14} color={C.ok} />
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 11, color: C.textSub, marginTop: 8 }}>
                Data synkroniseras till Melior vid behandlingsmarkering
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "bokning" ? (
        <BookingWizard />
      ) : (
        <DokumentView />
      )}

      {/* Modals */}
      {showStandby && <StandbyModal onClose={() => setShowStandby(false)} onBook={handleBook} />}
      {showAkut && <AkutModal onClose={() => setShowAkut(false)} />}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: toast.type === "ok" ? C.ok : C.warn,
          color: "#fff", padding: "12px 20px", borderRadius: 10,
          fontSize: 13, fontWeight: 600, zIndex: 2000,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          maxWidth: 340, lineHeight: 1.4,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── BOOKING WIZARD ──────────────────────────────────────────────────────────
function BookingWizard() {
  const [step, setStep] = useState(1);
  const [pnr, setPnr] = useState("");
  const [patient, setPatient] = useState(null);
  const [treatType, setTreatType] = useState(null);
  const [urgency, setUrgency] = useState(null);
  const [form, setForm] = useState({ fasta: false, anestesiJa: false, blodtryck: "", vikt: "", allergi: "", info: "" });
  const [done, setDone] = useState(false);

  function searchPatient() {
    if (pnr.length >= 10) {
      setPatient({ name: "Testsson, Anna", pnr, ward: "Avd 362", diagnos: "F32.2 – Svår depressiv episod" });
      setStep(2);
    }
  }

  const formComplete = form.fasta && form.blodtryck && form.vikt;

  if (done) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ background: C.surface, borderRadius: 16, padding: 40, textAlign: "center", maxWidth: 420, border: `2px solid ${C.ok}` }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.ok }}>Bokning bekräftad</h2>
        <p style={{ color: C.textMid, fontSize: 14 }}>
          {patient?.name} är nu bokad för {treatType} ({urgency}).
          Hälsodeklaration mottagen och sparad.
        </p>
        <button onClick={() => { setStep(1); setPnr(""); setPatient(null); setTreatType(null); setUrgency(null); setDone(false); }}
          style={{ marginTop: 16, padding: "10px 24px", background: C.ok, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          Ny bokning
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "28px 20px" }}>
      {/* Steps */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
        {["Sök patient", "Välj behandling", "Hälsodeklaration"].map((label, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 13, fontWeight: 700, zIndex: 1,
              background: step > i + 1 ? C.ok : step === i + 1 ? C.tessa : C.border,
              color: step >= i + 1 ? "#fff" : C.textSub,
              border: `2px solid ${step === i + 1 ? C.tessa : step > i + 1 ? C.ok : C.border}`,
            }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <div style={{ fontSize: 11, color: step === i + 1 ? C.tessa : C.textSub, marginTop: 6, fontWeight: step === i + 1 ? 700 : 400 }}>
              {label}
            </div>
            {i < 2 && <div style={{ position: "absolute", top: 16, left: "60%", right: "-10%", height: 2, background: step > i + 1 ? C.ok : C.border }} />}
          </div>
        ))}
      </div>

      <div style={{ background: C.surface, borderRadius: 14, padding: 24, border: `1px solid ${C.border}` }}>
        {step === 1 && (
          <div>
            <h3 style={{ margin: "0 0 16px", fontFamily: "'DM Serif Display', serif" }}>Sök patient via personnummer</h3>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={pnr}
                onChange={e => setPnr(e.target.value)}
                placeholder="YYYYMMDDNNNN"
                style={{ flex: 1, padding: "12px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "'DM Mono', monospace" }}
              />
              <button onClick={searchPatient} style={{
                padding: "12px 20px", background: C.tessa, color: "#fff",
                border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14,
              }}>Sök</button>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: C.textSub }}>Hämtar data via Elvis-API (VGR)</div>
          </div>
        )}
        {step === 2 && patient && (
          <div>
            <div style={{ background: C.okBg, border: `1px solid ${C.ok}`, borderRadius: 8, padding: 12, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{patient.name}</div>
              <div style={{ fontSize: 12, color: C.textMid }}>{patient.pnr} · {patient.ward}</div>
              <div style={{ fontSize: 12, color: C.textSub }}>{patient.diagnos}</div>
            </div>
            <h3 style={{ margin: "0 0 14px", fontFamily: "'DM Serif Display', serif" }}>Välj behandlingstyp</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {["ECT", "rTMS", "Akut ECT"].map(t => (
                <button key={t} onClick={() => setTreatType(t)} style={{
                  padding: 16, borderRadius: 10, border: `2px solid ${treatType === t ? C.tessa : C.border}`,
                  background: treatType === t ? "#EEF5FF" : C.surface, cursor: "pointer",
                  fontWeight: 700, fontSize: 14, color: treatType === t ? C.tessa : C.textMid,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <Icon name={t === "Akut ECT" ? "bolt" : t === "ECT" ? "clock" : "link"} size={16} color={treatType === t ? C.tessa : C.textSub} />
                  {t}
                </button>
              ))}
            </div>
            <h3 style={{ margin: "0 0 10px", fontFamily: "'DM Serif Display', serif" }}>Urgensgrad</h3>
            <div style={{ display: "flex", gap: 10 }}>
              {["Elektiv", "Halvakut", "Akut"].map(u => (
                <button key={u} onClick={() => setUrgency(u)} style={{
                  flex: 1, padding: "12px 0", borderRadius: 8,
                  border: `2px solid ${urgency === u ? (u === "Akut" ? C.akut : u === "Halvakut" ? C.warn : C.ok) : C.border}`,
                  background: urgency === u ? (u === "Akut" ? C.akutBg : u === "Halvakut" ? C.warnBg : C.okBg) : C.surface,
                  cursor: "pointer", fontWeight: 700, fontSize: 13,
                  color: u === "Akut" ? C.akut : u === "Halvakut" ? C.warn : C.ok,
                }}>
                  {u}
                </button>
              ))}
            </div>
            <button disabled={!treatType || !urgency} onClick={() => setStep(3)} style={{
              marginTop: 20, width: "100%", padding: 14, borderRadius: 8,
              background: treatType && urgency ? C.tessa : C.border,
              color: "#fff", border: "none", fontWeight: 700, fontSize: 14,
              cursor: treatType && urgency ? "pointer" : "not-allowed",
            }}>Nästa →</button>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 style={{ margin: "0 0 16px", fontFamily: "'DM Serif Display', serif" }}>Hälsodeklaration</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={form.fasta} onChange={e => setForm(f => ({ ...f, fasta: e.target.checked }))} style={{ width: 18, height: 18 }} />
                Patient har fastat minst 6 timmar (obligatorisk) *
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={form.anestesiJa} onChange={e => setForm(f => ({ ...f, anestesiJa: e.target.checked }))} style={{ width: 18, height: 18 }} />
                Extra anestesibedömning behövs
              </label>
              <div>
                <label style={{ fontSize: 13, color: C.textMid, fontWeight: 600, display: "block", marginBottom: 4 }}>Blodtryck (mmHg) *</label>
                <input value={form.blodtryck} onChange={e => setForm(f => ({ ...f, blodtryck: e.target.value }))}
                  placeholder="120/80"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: C.textMid, fontWeight: 600, display: "block", marginBottom: 4 }}>Vikt (kg) *</label>
                <input value={form.vikt} onChange={e => setForm(f => ({ ...f, vikt: e.target.value }))}
                  placeholder="70"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: C.textMid, fontWeight: 600, display: "block", marginBottom: 4 }}>Kända allergier</label>
                <input value={form.allergi} onChange={e => setForm(f => ({ ...f, allergi: e.target.value }))}
                  placeholder="Ingen känd allergi"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: C.textMid, fontWeight: 600, display: "block", marginBottom: 4 }}>Övrig information</label>
                <textarea value={form.info} onChange={e => setForm(f => ({ ...f, info: e.target.value }))}
                  rows={2}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, resize: "vertical" }} />
              </div>
            </div>
            {!formComplete && (
              <div style={{ background: C.warnBg, border: `1px solid ${C.warn}`, borderRadius: 8, padding: "10px 14px", marginTop: 14, fontSize: 12, color: C.warn, fontWeight: 600 }}>
                ⚠ Obligatoriska fält saknas – formuläret är ej komplett
              </div>
            )}
            <button disabled={!formComplete} onClick={() => setDone(true)} style={{
              marginTop: 16, width: "100%", padding: 14, borderRadius: 8,
              background: formComplete ? C.ok : C.border,
              color: "#fff", border: "none", fontWeight: 700, fontSize: 14,
              cursor: formComplete ? "pointer" : "not-allowed",
            }}>
              {formComplete ? "✓ Bekräfta bokning" : "Fyll i alla obligatoriska fält (*)"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DOKUMENT VIEW ────────────────────────────────────────────────────────────
function DokumentView() {
  const [filter, setFilter] = useState("alla");
  const [sok, setSok] = useState("");
  const [vald, setVald] = useState(null);

  const dagFran = (datumStr) => {
    const d = new Date(datumStr);
    const nu = new Date();
    return Math.floor((d - nu) / (1000 * 60 * 60 * 24));
  };

  const statusInfo = (doc) => {
    if (doc.status === "utgangen")    return { label: "Utgången",      color: C.akut,    bg: C.akutBg };
    if (doc.status === "utgarsSnart") return { label: "Utgår snart",   color: C.warn,    bg: C.warnBg };
    return                                   { label: "Giltig",        color: C.ok,      bg: C.okBg };
  };

  const typFarg = (typ) => {
    if (typ === "rutin")     return { color: C.tessa, bg: "#E1F5EE" };
    if (typ === "riktlinje") return { color: C.dubbel, bg: "#F5F0FF" };
    if (typ === "checklista")return { color: C.warn,   bg: C.warnBg };
    if (typ === "remissvag") return { color: C.blue,   bg: "#EEF5FF" };
    return { color: C.ledigt, bg: C.ledigBg };
  };

  const filtered = DOKUMENT.filter(d => {
    const matchFilter =
      filter === "alla" ? true :
      filter === "utgangna" ? (d.status === "utgangen" || d.status === "utgarsSnart") :
      d.typ === filter;
    const matchSok = sok === "" ||
      d.titel.toLowerCase().includes(sok.toLowerCase()) ||
      d.verksamhet.toLowerCase().includes(sok.toLowerCase()) ||
      d.ansvarig.toLowerCase().includes(sok.toLowerCase());
    return matchFilter && matchSok;
  });

  const utgangna = DOKUMENT.filter(d => d.status === "utgangen").length;
  const utgarsSnart = DOKUMENT.filter(d => d.status === "utgarsSnart").length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.text }}>
            Styrdokument
          </h2>
          <div style={{ fontSize: 12, color: C.textSub, marginTop: 3 }}>
            ECT & rTMS · Psykiatri Sahlgrenska · {DOKUMENT.length} dokument
          </div>
        </div>
        {(utgangna > 0 || utgarsSnart > 0) && (
          <div style={{
            background: C.warnBg, border: `1px solid ${C.warn}`,
            borderRadius: 8, padding: "8px 14px", fontSize: 12, color: C.warn, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            ⚠ {utgangna > 0 && `${utgangna} utgångna`}{utgangna > 0 && utgarsSnart > 0 && ", "}{utgarsSnart > 0 && `${utgarsSnart} utgår snart`}
          </div>
        )}
      </div>

      {/* Sökfält + filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={sok}
          onChange={e => setSok(e.target.value)}
          placeholder="Sök på titel, verksamhet eller ansvarig..."
          style={{
            flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 8,
            border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            background: C.surface, color: C.text,
          }}
        />
        {[
          { id: "alla",      label: "Alla" },
          { id: "utgangna",  label: `Behöver åtgärd (${utgangna + utgarsSnart})` },
          { id: "rutin",     label: "Rutiner" },
          { id: "riktlinje", label: "Riktlinjer" },
          { id: "remissvag", label: "Remissvägar" },
          { id: "checklista",label: "Checklistor" },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
            background: filter === f.id ? C.tessa : C.surface,
            color: filter === f.id ? "#fff" : C.textMid,
            border: filter === f.id ? "none" : `1px solid ${C.border}`,
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Dokumentlista */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(doc => {
          const st = statusInfo(doc);
          const tf = typFarg(doc.typ);
          const dagar = dagFran(doc.giltigTill);
          const erVald = vald === doc.id;

          return (
            <div key={doc.id}>
              <div
                onClick={() => setVald(erVald ? null : doc.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", borderRadius: erVald ? "8px 8px 0 0" : 8,
                  background: erVald ? C.surface : C.surface,
                  border: `1.5px solid ${erVald ? C.tessa : (doc.status !== "giltig" ? st.color : C.border)}`,
                  cursor: "pointer", transition: "border-color 0.15s",
                }}
              >
                {/* Statusstripe */}
                <div style={{
                  width: 4, height: 40, borderRadius: 2, flexShrink: 0,
                  background: st.color,
                }} />

                {/* Typbadge */}
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99,
                  background: tf.bg, color: tf.color,
                  textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap",
                  minWidth: 72, textAlign: "center",
                }}>
                  {doc.typ}
                </span>

                {/* Titel + verksamhet */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {doc.titel}
                  </div>
                  <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>
                    {doc.verksamhet} · Ansvarig: {doc.ansvarig} · v{doc.version}
                  </div>
                </div>

                {/* Datum */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: C.textSub }}>Giltig till</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: st.color, fontFamily: "'DM Mono', monospace" }}>
                    {doc.giltigTill}
                  </div>
                  {doc.status !== "giltig" && (
                    <div style={{ fontSize: 10, color: st.color, marginTop: 2 }}>
                      {dagar < 0 ? `${Math.abs(dagar)} dagar sedan` : `${dagar} dagar kvar`}
                    </div>
                  )}
                </div>

                {/* Statusbadge */}
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99,
                  background: st.bg, color: st.color,
                  textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap",
                }}>
                  {st.label}
                </span>

                {/* Chevron */}
                <span style={{ color: C.textSub, fontSize: 14, transform: erVald ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
              </div>

              {/* Expanderad detaljvy */}
              {erVald && (
                <div style={{
                  background: C.bg, border: `1.5px solid ${C.tessa}`, borderTop: "none",
                  borderRadius: "0 0 8px 8px", padding: "14px 20px",
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: C.textSub, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Beskrivning</div>
                      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{doc.beskrivning}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        ["Dokument-ID", doc.dokumentId],
                        ["Giltig från", doc.giltigFran],
                        ["Giltig till", doc.giltigTill],
                        ["Version", doc.version],
                        ["Innehållsansvarig", doc.ansvarig],
                        ["Verksamhet", doc.verksamhet],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: C.textSub }}>{k}</span>
                          <span style={{ color: C.text, fontWeight: 600, fontFamily: k === "Dokument-ID" || k.includes("från") || k.includes("till") ? "'DM Mono', monospace" : "inherit" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
                    {doc.status !== "giltig" && (
                      <div style={{
                        background: st.bg, border: `1px solid ${st.color}`,
                        borderRadius: 6, padding: "6px 12px", fontSize: 11, color: st.color, fontWeight: 700,
                      }}>
                        ⚠ {doc.status === "utgangen" ? "Dokumentet är utgånget och behöver förnyas" : "Dokumentet utgår inom 90 dagar"}
                      </div>
                    )}
                    {doc.lank !== "#" && (
                      <a href={doc.lank} target="_blank" rel="noreferrer" style={{
                        padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.tessa}`,
                        background: C.surface, color: C.tessa, fontSize: 12, fontWeight: 600,
                        textDecoration: "none", cursor: "pointer",
                      }}>
                        Öppna dokument ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.textSub, fontSize: 13 }}>
          Inga dokument matchar sökningen.
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 20, padding: "12px 16px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 11, color: C.textSub }}>
        Dokument hämtas från VGR:s dokumenthanteringssystem · Uppdateras automatiskt vid ny version · Ansvarig notifieras 30 dagar innan utgångsdatum
      </div>
    </div>
  );
}
