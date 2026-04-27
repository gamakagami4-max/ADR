import { useT } from "../../context/ThemeContext";

export function SectionCard({ children, style }) {
  const { t } = useT();

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20, ...style }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  const { t } = useT();

  return (
    <h2 style={{ fontSize: 11, fontWeight: 600, color: t.textHint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12, margin: "0 0 12px 0" }}>
      {children}
    </h2>
  );
}

export function InfoRow({ label, value, valueStyle }) {
  const { t } = useT();

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: `1px solid ${t.divider}`, fontSize: 12 }}>
      <span style={{ color: t.textHint }}>{label}</span>
      <span style={{ fontWeight: 600, color: t.text, textAlign: "right", ...valueStyle }}>{value}</span>
    </div>
  );
}
