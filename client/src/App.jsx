import { useState, useMemo, useContext, createContext } from "react";

// ─── Theme ────────────────────────────────────────────────────────────────────

const LIGHT = {
  bg:           "#f9fafb",
  surface:      "#ffffff",
  border:       "#e5e7eb",
  text:         "#111827",
  textSub:      "#6b7280",
  textHint:     "#9ca3af",
  tag:          "#f3f4f6",
  tagText:      "#374151",
  tagBorder:    "#e5e7eb",
  divider:      "#f3f4f6",
  input:        "#ffffff",
  navBg:        "#ffffff",
  red:          "#dc2626",
  redLight:     "#fef2f2",
  redBorder:    "#fecaca",
  stableText:   "#065f46",
  stableBg:     "#ecfdf5",
  stableBorder: "#a7f3d0",
  betaText:     "#92400e",
  betaBg:       "#fffbeb",
  betaBorder:   "#fcd34d",
};

const DARK = {
  bg:           "#0f172a",
  surface:      "#1e293b",
  border:       "#334155",
  text:         "#f1f5f9",
  textSub:      "#94a3b8",
  textHint:     "#64748b",
  tag:          "#1e293b",
  tagText:      "#cbd5e1",
  tagBorder:    "#334155",
  divider:      "#1e293b",
  input:        "#1e293b",
  navBg:        "#0f172a",
  red:          "#ef4444",
  redLight:     "#1c1010",
  redBorder:    "#3b1515",
  stableText:   "#6ee7b7",
  stableBg:     "#022c22",
  stableBorder: "#065f46",
  betaText:     "#fbbf24",
  betaBg:       "#2d1a00",
  betaBorder:   "#78350f",
};

const ThemeContext = createContext({ t: LIGHT, dark: false, toggle: () => {} });
const useT = () => useContext(ThemeContext);

// ─── Data ─────────────────────────────────────────────────────────────────────

const apps = [
  {
    id: "automotive", icon: "🔧", name: "ADR Auto Portal", division: "Automotive",
    version: "v3.2.1", platform: "iOS & Android", access: "Internal", status: "stable",
    rating: "4.8", ratingCount: "124", stars: 5, tags: ["Manufacturing", "OEM", "QC"],
    tagline: "End-to-end management for automotive component production, OEM orders, and quality control.",
    desc: "End-to-end management for automotive component production, OEM orders, and quality control across all manufacturing plants.",
    about: "ADR Auto Portal is the central digital hub for ADR Group's Automotive Division. Used by production supervisors, QC teams, and procurement managers across the Kapuk and Tangerang plants, it brings together purchase orders, quality inspection logs, OEM delivery schedules, and supplier communications in a single, mobile-first platform. Integrated with the ERP system, it provides live production data and automated KPI alerts.",
    category: "Manufacturing", size: "48.2 MB", updated: "12 Apr 2026", users: "1,200+ active",
  },
  {
    id: "agro", icon: "🌿", name: "ADR Agro Manager", division: "Agribusiness",
    version: "v1.5.0", platform: "Android", access: "Field Use", status: "beta",
    rating: "4.3", ratingCount: "68", stars: 4, tags: ["Palm Oil", "MDF", "Forestry"],
    tagline: "Plantation monitoring, MDF mill operations, and harvest tracking for ADR Agribusiness division.",
    desc: "Plantation monitoring, MDF mill operations, and harvest tracking for ADR's agribusiness division across Kalimantan and Sumatra.",
    about: "ADR Agro Manager empowers field officers and mill supervisors to record, track, and report on plantation activities in real time. Designed for use in low-connectivity environments, the app supports offline data capture that syncs automatically when a connection is available. It covers palm oil harvest logging, MDF production batch reporting, and industrial forestry compliance documentation.",
    category: "Agribusiness", size: "32.7 MB", updated: "3 Mar 2026", users: "420+ active",
  },
  {
    id: "property", icon: "🏙️", name: "ADR Property Hub", division: "Property",
    version: "v2.0.4", platform: "Web & Mobile", access: "Enterprise", status: "stable",
    rating: "4.7", ratingCount: "41", stars: 5, tags: ["Tenant CRM", "Pipeline", "Finance"],
    tagline: "Property project pipeline, tenant management, and investment tracking across Jakarta, Bali, and Batam.",
    desc: "Property project pipeline, tenant management, and investment tracking across ADR's portfolio in Jakarta, Bali, and Batam.",
    about: "ADR Property Hub serves the Property Division's development and asset management teams. It provides a complete view of ongoing construction projects, tenant lease agreements, maintenance scheduling, and financial performance per asset. The app integrates with the accounting system to surface occupancy rates, rental income, and CAPEX tracking on a single dashboard available to executives and site managers alike.",
    category: "Property", size: "61.4 MB", updated: "28 Mar 2026", users: "380+ active",
  },
  {
    id: "distribution", icon: "📦", name: "ADR Distribusi", division: "Distribution",
    version: "v4.0.2", platform: "iOS & Android", access: "Logistics", status: "stable",
    rating: "4.5", ratingCount: "209", stars: 4, tags: ["Warehouse", "Logistics", "Inventory"],
    tagline: "Real-time distribution tracking, warehouse inventory, and logistics coordination across 5 regional offices.",
    desc: "Real-time distribution tracking, warehouse inventory, and logistics coordination across 5 regional distribution offices throughout Indonesia.",
    about: "ADR Distribusi connects the group's five regional distribution companies — from Surabaya to Riau — under one logistics management platform. Warehouse staff use it to manage incoming and outgoing stock, dispatch personnel use it to coordinate deliveries, and management uses the analytics dashboard to monitor fulfilment rates, slow-moving inventory, and inter-branch transfers.",
    category: "Logistics", size: "54.9 MB", updated: "10 Apr 2026", users: "2,100+ active",
  },
  {
    id: "hr", icon: "👥", name: "ADR People", division: "HR",
    version: "v2.3.0", platform: "Web", access: "Internal", status: "stable",
    rating: "4.6", ratingCount: "312", stars: 5, tags: ["Payroll", "Attendance", "Recruitment"],
    tagline: "Unified HR management covering payroll, attendance, and employee lifecycle for all ADR entities.",
    desc: "Unified HR management platform covering payroll processing, attendance tracking, leave management, and end-to-end recruitment.",
    about: "ADR People is the group-wide human resources platform used by HR managers and employees across all divisions. It handles monthly payroll runs, leave approvals, attendance reconciliation, and new hire onboarding workflows. Integrated with the biometric attendance systems at each site.",
    category: "Human Resources", size: "22.1 MB", updated: "1 Apr 2026", users: "4,000+ active",
  },
  {
    id: "finance", icon: "💹", name: "ADR Finance", division: "Finance",
    version: "v3.0.1", platform: "Web", access: "Enterprise", status: "stable",
    rating: "4.9", ratingCount: "87", stars: 5, tags: ["Accounting", "Reporting", "Budget"],
    tagline: "Group-wide financial reporting, budget tracking, and inter-company consolidation.",
    desc: "Group-wide financial reporting, budget planning, and inter-company consolidation across all ADR business entities.",
    about: "ADR Finance is the consolidation and reporting hub for the group's finance teams. It pulls data from each business unit's accounting system to generate consolidated P&L, balance sheets, and cash flow reports. Budget vs actual tracking and approval workflows are built in.",
    category: "Finance", size: "18.6 MB", updated: "8 Apr 2026", users: "650+ active",
  },
];

const ALL_DIVISIONS = ["All", ...Array.from(new Set(apps.map((a) => a.division)))];
const ALL_PLATFORMS = ["All", ...Array.from(new Set(apps.map((a) => a.platform)))];

const FEATURES = [
  "Real-time dashboard with live operational data and KPI tracking",
  "Automated workflow approvals with multi-level sign-off support",
  "Integrated document management with version control",
  "Push notifications and alerts for critical operational updates",
  "Offline mode support for field operations without connectivity",
  "Role-based access control with enterprise SSO integration",
];

const REVIEWS = [
  { initials: "BS", name: "Budi Santoso", role: "Operations Manager", stars: 5, text: "This app has significantly improved how our team handles day-to-day operations. The interface is clean and easy to navigate even for non-technical staff." },
  { initials: "RP", name: "Rina Pratiwi", role: "QC Supervisor", stars: 4, text: "Solid application with useful reporting features. Would love to see more export options in a future update, but overall very satisfied with the performance." },
  { initials: "AW", name: "Ahmad Wijaya", role: "Site Coordinator", stars: 5, text: "Offline mode is a game changer for our field teams. Data syncs seamlessly once we're back in range. Highly recommended for remote operations." },
];

// ─── Shared components ────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const { t } = useT();
  if (status === "stable")
    return (
      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: t.stableBg, color: t.stableText, border: `1px solid ${t.stableBorder}`, whiteSpace: "nowrap" }}>
        Stable
      </span>
    );
  if (status === "beta")
    return (
      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: t.betaBg, color: t.betaText, border: `1px solid ${t.betaBorder}`, whiteSpace: "nowrap" }}>
        Beta
      </span>
    );
  return null;
}

function Stars({ count, size = "sm" }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: size === "lg" ? 15 : 11, letterSpacing: -0.5 }}>
      {Array.from({ length: 5 }, (_, i) => (i < count ? "★" : "☆")).join("")}
    </span>
  );
}

function Tag({ children }) {
  const { t } = useT();
  return (
    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: t.tag, color: t.tagText, border: `1px solid ${t.tagBorder}`, fontWeight: 500 }}>
      {children}
    </span>
  );
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
    </svg>
  );
}

// ─── Layout components ────────────────────────────────────────────────────────

function Navbar({ onLogoClick }) {
  const { t, dark, toggle } = useT();
  return (
    <header style={{ background: t.navBg, borderBottom: `1px solid ${t.border}`, position: "sticky", top: 0, zIndex: 30, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          onClick={onLogoClick}
          style={{ fontSize: 17, fontWeight: 800, letterSpacing: "0.12em", color: t.red, cursor: "pointer", userSelect: "none" }}
        >
          ADR
        </span>
        <button
          onClick={toggle}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 8, border: `1px solid ${t.border}`, color: t.textSub, background: t.surface, cursor: "pointer" }}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  const { t } = useT();
  return (
    <footer style={{ borderTop: `1px solid ${t.border}`, marginTop: 64, padding: "20px 24px", textAlign: "center", fontSize: 11, color: t.textHint, background: t.navBg }}>
      <span style={{ fontWeight: 600, color: t.textSub }}>ADR Group of Companies</span>
      {" "}· Wisma ADR, Jl. Pluit Raya I No. 1, North Jakarta · Internal use only · © 2026
    </footer>
  );
}

function SectionCard({ children, style }) {
  const { t } = useT();
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  const { t } = useT();
  return (
    <h2 style={{ fontSize: 11, fontWeight: 600, color: t.textHint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12, margin: "0 0 12px 0" }}>
      {children}
    </h2>
  );
}

function InfoRow({ label, value, valueStyle }) {
  const { t } = useT();
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: `1px solid ${t.divider}`, fontSize: 12 }}>
      <span style={{ color: t.textHint }}>{label}</span>
      <span style={{ fontWeight: 600, color: t.text, textAlign: "right", ...valueStyle }}>{value}</span>
    </div>
  );
}

// ─── App Card ─────────────────────────────────────────────────────────────────

function AppCard({ app, onViewDetail }) {
  const { t } = useT();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: t.surface,
        border: `1px solid ${hovered ? t.red : t.border}`,
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.15s, box-shadow 0.15s",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <div style={{ height: 2, background: t.red, opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }} />
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: t.redLight, border: `1px solid ${t.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>
              {app.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{app.name}</div>
              <div style={{ fontSize: 11, color: t.textHint, marginTop: 2 }}>{app.division} Division</div>
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <p style={{ fontSize: 12, color: t.textSub, lineHeight: 1.55, flex: 1, margin: 0 }}>{app.tagline}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {app.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </div>

        <div style={{ borderTop: `1px solid ${t.divider}`, paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Stars count={app.stars} />
            <span style={{ fontSize: 11, color: t.textHint }}>{app.rating} ({app.ratingCount})</span>
          </div>
          <button
            onClick={() => onViewDetail(app)}
            style={{ fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 8, background: t.red, color: "#fff", border: "none", cursor: "pointer" }}
          >
            View Detail →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Directory Page ───────────────────────────────────────────────────────────

function DirectoryPage({ onViewDetail }) {
  const { t } = useT();
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      const q = search.toLowerCase();
      const matchSearch = !q || app.name.toLowerCase().includes(q) || app.division.toLowerCase().includes(q) || app.tags.some((tg) => tg.toLowerCase().includes(q)) || app.tagline.toLowerCase().includes(q);
      return matchSearch && (divisionFilter === "All" || app.division === divisionFilter) && (platformFilter === "All" || app.platform === platformFilter);
    });
  }, [search, divisionFilter, platformFilter]);

  const inputStyle = {
    background: t.input, border: `1px solid ${t.border}`, borderRadius: 8,
    padding: "8px 32px", fontSize: 13, color: t.text, outline: "none", width: "100%",
  };
  const selectStyle = {
    background: t.input, border: `1px solid ${t.border}`, borderRadius: 8,
    padding: "8px 12px", fontSize: 13, color: t.textSub, outline: "none", cursor: "pointer",
  };

  return (
    <main style={{ maxWidth: 1152, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: "0 0 4px 0" }}>Application Directory</h1>
        <p style={{ fontSize: 13, color: t.textHint, margin: 0 }}>Find and access internal tools across all ADR divisions.</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: t.textHint, fontSize: 14, pointerEvents: "none" }}>⌕</span>
          <input type="text" placeholder="Search by name, division, or tag…" value={search} onChange={(e) => setSearch(e.target.value)} style={inputStyle} />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: t.textHint, fontSize: 12 }}>✕</button>
          )}
        </div>
        <select value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)} style={selectStyle}>
          {ALL_DIVISIONS.map((d) => <option key={d} value={d}>{d === "All" ? "All Divisions" : d}</option>)}
        </select>
        <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} style={selectStyle}>
          {ALL_PLATFORMS.map((p) => <option key={p} value={p}>{p === "All" ? "All Platforms" : p}</option>)}
        </select>
      </div>

      <p style={{ fontSize: 11, color: t.textHint, marginBottom: 20 }}>
        {filtered.length === apps.length ? `Showing all ${apps.length} apps` : `${filtered.length} of ${apps.length} apps`}
        {search && <span> for <strong style={{ color: t.text }}>&ldquo;{search}&rdquo;</strong></span>}
      </p>

      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {filtered.map((app) => <AppCard key={app.id} app={app} onViewDetail={onViewDetail} />)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: 36, opacity: 0.2, marginBottom: 12 }}>⊘</div>
          <div style={{ fontSize: 13, color: t.textSub }}>No apps match your search.</div>
          <button onClick={() => { setSearch(""); setDivisionFilter("All"); setPlatformFilter("All"); }} style={{ marginTop: 10, fontSize: 12, color: t.red, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}

// ─── Detail Page ──────────────────────────────────────────────────────────────

function DetailPage({ app, onBack }) {
  const { t } = useT();

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
      <button
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: t.textHint, background: "none", border: "none", cursor: "pointer", marginBottom: 24, padding: 0 }}
      >
        ← Back to App Directory
      </button>

      {/* Hero */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ height: 3, background: t.red }} />
        <div style={{ padding: 28 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 68, height: 68, borderRadius: 16, background: t.redLight, border: `1px solid ${t.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
              {app.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: 0 }}>{app.name}</h1>
                <StatusBadge status={app.status} />
                <span style={{ fontSize: 10, fontFamily: "monospace", color: t.textHint, background: t.tag, border: `1px solid ${t.border}`, padding: "2px 6px", borderRadius: 5 }}>{app.version}</span>
              </div>
              <p style={{ fontSize: 13, color: t.textSub, lineHeight: 1.6, marginBottom: 16 }}>{app.desc}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={{ fontSize: 13, fontWeight: 600, padding: "9px 18px", borderRadius: 9, background: t.red, color: "#fff", border: "none", cursor: "pointer" }}>⬇ Download App</button>
                <button style={{ fontSize: 13, padding: "9px 18px", borderRadius: 9, background: t.surface, color: t.text, border: `1px solid ${t.border}`, cursor: "pointer" }}>Request Access</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>

        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard>
            <SectionTitle>About this app</SectionTitle>
            <p style={{ fontSize: 13, color: t.textSub, lineHeight: 1.65, margin: 0 }}>{app.about}</p>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Key features</SectionTitle>
            <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 0, margin: 0, listStyle: "none" }}>
              {FEATURES.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: t.textSub, lineHeight: 1.45 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.red, flexShrink: 0, marginTop: 4 }} />
                  {f}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Screenshots</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ background: t.tag, border: `1px solid ${t.border}`, borderRadius: 12, aspectRatio: "9/16", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 10, color: t.textHint }}>
                  <span style={{ fontSize: 22, opacity: 0.2 }}>📱</span>
                  Screen {n}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <SectionTitle>User reviews</SectionTitle>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Stars count={app.stars} size="lg" />
                <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{app.rating}</span>
                <span style={{ fontSize: 11, color: t.textHint }}>({app.ratingCount})</span>
              </div>
            </div>
            {REVIEWS.map((review, i) => (
              <div key={i} style={{ padding: "14px 0", borderTop: i === 0 ? "none" : `1px solid ${t.divider}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    {review.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{review.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Stars count={review.stars} />
                      <span style={{ fontSize: 10, color: t.textHint }}>{review.role}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: t.textSub, lineHeight: 1.55, margin: 0 }}>{review.text}</p>
              </div>
            ))}
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionCard>
            <SectionTitle>App info</SectionTitle>
            {[["Version", app.version], ["Division", app.division], ["Category", app.category], ["Platform", app.platform], ["Access", app.access], ["Size", app.size], ["Updated", app.updated], ["Active Users", app.users]].map(([label, val]) => (
              <InfoRow key={label} label={label} value={val} />
            ))}
          </SectionCard>

          <SectionCard>
            <SectionTitle>Tags</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {app.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            </div>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Support</SectionTitle>
            <InfoRow label="Contact" value="apps@adr-group.co.id" valueStyle={{ color: t.red }} />
            <InfoRow label="Hours" value="Mon–Fri, 08–17 WIB" />
          </SectionCard>

          <SectionCard style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button style={{ width: "100%", fontSize: 13, fontWeight: 600, padding: "9px 0", borderRadius: 9, background: t.red, color: "#fff", border: "none", cursor: "pointer" }}>⬇ Download for iOS</button>
            <button style={{ width: "100%", fontSize: 13, padding: "9px 0", borderRadius: 9, background: t.surface, color: t.text, border: `1px solid ${t.border}`, cursor: "pointer" }}>Download for Android</button>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("directory");
  const [selectedApp, setSelectedApp] = useState(null);

  const theme = { t: dark ? DARK : LIGHT, dark, toggle: () => setDark((d) => !d) };

  const goToDetail = (app) => { setSelectedApp(app); setPage("detail"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goToDirectory = () => { setPage("directory"); setSelectedApp(null); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ minHeight: "100vh", background: theme.t.bg, color: theme.t.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <Navbar onLogoClick={goToDirectory} />
        {page === "directory" && <DirectoryPage onViewDetail={goToDetail} />}
        {page === "detail" && selectedApp && <DetailPage app={selectedApp} onBack={goToDirectory} />}
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}