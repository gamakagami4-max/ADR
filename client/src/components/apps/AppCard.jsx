import { useState } from "react";
import { useT } from "../../context/ThemeContext";
import Tag from "../common/Tag";

function IconButton({ label, onClick, children, style }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        border: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 14,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export default function AppCard({ app, onViewDetail, isAdmin, onEditApp, onDeleteApp }) {
  const { t, locale } = useT();
  const [hovered, setHovered] = useState(false);
  const hasImageIcon = typeof app.icon === "string" && (app.icon.startsWith("data:image/") || app.icon.startsWith("http"));

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
              {hasImageIcon ? <img src={app.icon} alt={`${app.name} icon`} style={{ width: "100%", height: "100%", borderRadius: 10, objectFit: "cover" }} /> : app.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{app.name}</div>
              <div style={{ fontSize: 11, color: t.textHint, marginTop: 2 }}>{locale === "id" ? `Divisi ${app.division}` : `${app.division} Division`}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isAdmin && (
              <>
                <IconButton
                  label={`Edit ${app.name}`}
                  onClick={() => onEditApp(app)}
                  style={{ background: t.tag, color: t.textSub, border: `1px solid ${t.border}` }}
                >
                  ✎
                </IconButton>
                <IconButton
                  label={`Delete ${app.name}`}
                  onClick={() => onDeleteApp(app)}
                  style={{ background: t.redLight, color: t.red, border: `1px solid ${t.redBorder}` }}
                >
                  🗑
                </IconButton>
              </>
            )}
          </div>
        </div>

        <p style={{ fontSize: 12, color: t.textSub, lineHeight: 1.55, flex: 1, margin: 0 }}>{app.tagline}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {app.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${t.divider}`, paddingTop: 10, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => onViewDetail(app)}
            style={{ fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 8, background: t.red, color: "#fff", border: "none", cursor: "pointer" }}
          >
            {locale === "id" ? "Lihat Detail →" : "View Detail →"}
          </button>
        </div>
      </div>
    </div>
  );
}
