import StatusBadge from "../components/common/StatusBadge";
import Tag from "../components/common/Tag";
import { InfoRow, SectionCard, SectionTitle } from "../components/layout/SectionBlocks";
import { useT } from "../context/ThemeContext";
import { FEATURES } from "../data/apps";

export default function DetailPage({ app, onBack }) {
  const { t } = useT();
  const hasImageIcon = typeof app.icon === "string" && (app.icon.startsWith("data:image/") || app.icon.startsWith("http"));

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
            <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 0, margin: 0, listStyle: "none" }}>
              {FEATURES.map((feature, index) => (
                <li key={index} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: t.textSub, lineHeight: 1.45 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.red, flexShrink: 0, marginTop: 4 }} />
                  {feature}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Screenshots</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[1, 2, 3].map((screen) => (
                <div key={screen} style={{ background: t.tag, border: `1px solid ${t.border}`, borderRadius: 12, aspectRatio: "9/16", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 10, color: t.textHint }}>
                  <span style={{ fontSize: 22, opacity: 0.2 }}>📱</span>
                  Screen {screen}
                </div>
              ))}
            </div>
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
