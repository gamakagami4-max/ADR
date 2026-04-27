import { useT } from "../../context/ThemeContext";

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
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

export default function Navbar({ onLogoClick }) {
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
