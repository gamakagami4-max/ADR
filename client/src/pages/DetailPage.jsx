import { useState } from "react";
import StatusBadge from "../components/common/StatusBadge";
import Tag from "../components/common/Tag";
import { InfoRow, SectionCard, SectionTitle } from "../components/layout/SectionBlocks";
import { useT } from "../context/ThemeContext";

export default function DetailPage({ app, onBack, isAdmin, onDeleteApp, onEditApp }) {
  const { t } = useT();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const hasImageIcon = typeof app.icon === "string" && (app.icon.startsWith("data:image/") || app.icon.startsWith("http"));
  const features = Array.isArray(app.features) ? app.features : [];
  const screenshots = Array.isArray(app.screenshots) ? app.screenshots : [];

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${app.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeleteError("");
    setDeleting(true);
    try {
      await onDeleteApp(app.id);
    } catch (error) {
      setDeleteError(error?.message || "Failed to delete app.");
      setDeleting(false);
    }
  };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
      <button
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: t.textHint, background: "none", border: "none", cursor: "pointer", marginBottom: 24, padding: 0 }}
      >
        ← Back to App Directory
      </button>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ height: 3, background: t.red }} />
        <div style={{ padding: 28 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 68, height: 68, borderRadius: 16, background: t.redLight, border: `1px solid ${t.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
              {hasImageIcon ? <img src={app.icon} alt={`${app.name} icon`} style={{ width: "100%", height: "100%", borderRadius: 16, objectFit: "cover" }} /> : app.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: 0 }}>{app.name}</h1>
                <StatusBadge status={app.status} />
                <span style={{ fontSize: 10, fontFamily: "monospace", color: t.textHint, background: t.tag, border: `1px solid ${t.border}`, padding: "2px 6px", borderRadius: 5 }}>{app.version}</span>
              </div>
              <p style={{ fontSize: 13, color: t.textSub, lineHeight: 1.6, marginBottom: 16 }}>{app.desc}</p>
              {isAdmin && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => onEditApp(app)}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${t.border}`,
                      background: t.tag,
                      color: t.text,
                      cursor: "pointer",
                    }}
                  >
                    Edit App
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${t.redBorder}`,
                      background: t.redLight,
                      color: t.red,
                      cursor: deleting ? "not-allowed" : "pointer",
                      opacity: deleting ? 0.8 : 1,
                    }}
                  >
                    {deleting ? "Deleting..." : "Delete App"}
                  </button>
                  {deleteError && <span style={{ fontSize: 12, color: t.red }}>{deleteError}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard>
            <SectionTitle>About this app</SectionTitle>
            <p style={{ fontSize: 13, color: t.textSub, lineHeight: 1.65, margin: 0 }}>{app.about}</p>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Key features</SectionTitle>
            {features.length > 0 ? (
              <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 0, margin: 0, listStyle: "none" }}>
                {features.map((feature, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: t.textSub, lineHeight: 1.45 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.red, flexShrink: 0 }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: 12, color: t.textHint }}>No key features have been added for this app yet.</p>
            )}
          </SectionCard>

          <SectionCard>
            <SectionTitle>Screenshots</SectionTitle>
            {screenshots.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                {screenshots.map((src, index) => (
                  <img
                    key={`${index}-${src.slice(0, 24)}`}
                    src={src}
                    alt={`${app.name} screenshot ${index + 1}`}
                    style={{ width: "100%", borderRadius: 12, border: `1px solid ${t.border}`, aspectRatio: "9/16", objectFit: "cover", background: t.tag }}
                  />
                ))}
              </div>
            ) : (
              <div style={{ background: t.tag, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20, fontSize: 12, color: t.textHint }}>
                No screenshots have been uploaded for this app yet.
              </div>
            )}
          </SectionCard>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionCard>
            <SectionTitle>App info</SectionTitle>
            {[
              ["Version", app.version],
              ["Division", app.division],
              ["Category", app.category],
              ["Platform", app.platform],
              ["Access", app.access],
              ["Size", app.size],
              ["Updated", app.updated],
              ["Active Users", app.users],
            ].map(([label, value]) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </SectionCard>

          <SectionCard>
            <SectionTitle>Tags</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {app.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Support</SectionTitle>
            <InfoRow label="Contact" value="apps@adr-group.co.id" valueStyle={{ color: t.red }} />
            <InfoRow label="Hours" value="Mon-Fri, 08-17 WIB" />
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
