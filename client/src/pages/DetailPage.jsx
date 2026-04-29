import { useState } from "react";
import Tag from "../components/common/Tag";
import { InfoRow, SectionCard, SectionTitle } from "../components/layout/SectionBlocks";
import { useT } from "../context/ThemeContext";

export default function DetailPage({ app, onBack, isAdmin, onDeleteApp, onEditApp }) {
  const { t, tr, locale } = useT();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const hasImageIcon = typeof app.icon === "string" && (app.icon.startsWith("data:image/") || app.icon.startsWith("http"));
  const features = Array.isArray(app.features) ? app.features : [];
  const screenshots = Array.isArray(app.screenshots) ? app.screenshots : [];

  const handleDelete = async () => {
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
    <>
      <style>{`
        @media (max-width: 768px) {
          .detail-main {
            padding: 20px 16px !important;
          }
          .detail-hero {
            padding: 18px !important;
          }
          .detail-layout {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .detail-features {
            grid-template-columns: 1fr !important;
          }
          .detail-screenshots {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <main className="detail-main" style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
      <button
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: t.textHint, background: "none", border: "none", cursor: "pointer", marginBottom: 24, padding: 0 }}
      >
        ← {tr("detailBack")}
      </button>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ height: 3, background: t.red }} />
        <div className="detail-hero" style={{ padding: 28 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 68, height: 68, borderRadius: 16, background: t.redLight, border: `1px solid ${t.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
              {hasImageIcon ? <img src={app.icon} alt={`${app.name} icon`} style={{ width: "100%", height: "100%", borderRadius: 16, objectFit: "cover" }} /> : app.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: 0 }}>{app.name}</h1>
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
                    {locale === "id" ? "Edit Aplikasi" : "Edit App"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
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
                    {deleting ? (locale === "id" ? "Menghapus..." : "Deleting...") : (locale === "id" ? "Hapus Aplikasi" : "Delete App")}
                  </button>
                  {deleteError && <span style={{ fontSize: 12, color: t.red }}>{deleteError}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-layout" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard>
            <SectionTitle>{locale === "id" ? "Tentang aplikasi ini" : "About this app"}</SectionTitle>
            <p style={{ fontSize: 13, color: t.textSub, lineHeight: 1.65, margin: 0 }}>{app.about}</p>
          </SectionCard>

          <SectionCard>
            <SectionTitle>{locale === "id" ? "Fitur utama" : "Key features"}</SectionTitle>
            {features.length > 0 ? (
              <ul className="detail-features" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 0, margin: 0, listStyle: "none" }}>
                {features.map((feature, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: t.textSub, lineHeight: 1.45 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.red, flexShrink: 0 }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: 12, color: t.textHint }}>{locale === "id" ? "Belum ada fitur utama untuk aplikasi ini." : "No key features have been added for this app yet."}</p>
            )}
          </SectionCard>

          <SectionCard>
            <SectionTitle>{locale === "id" ? "Tangkapan layar" : "Screenshots"}</SectionTitle>
            {screenshots.length > 0 ? (
              <div className="detail-screenshots" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
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
                {locale === "id" ? "Belum ada tangkapan layar yang diunggah untuk aplikasi ini." : "No screenshots have been uploaded for this app yet."}
              </div>
            )}
          </SectionCard>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionCard>
            <SectionTitle>{locale === "id" ? "Info aplikasi" : "App info"}</SectionTitle>
            {[
              [locale === "id" ? "Divisi" : "Division", app.division],
              [locale === "id" ? "Kategori" : "Category", app.category],
              [locale === "id" ? "Platform" : "Platform", app.platform],
              [locale === "id" ? "Akses" : "Access", app.access],
              [locale === "id" ? "Diperbarui" : "Updated", app.updated],
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

        </div>
      </div>
      </main>

      {showDeleteConfirm && (
        <div
          onClick={() => (deleting ? null : setShowDeleteConfirm(false))}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 80,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 420,
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 12,
              padding: 18,
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: 16, color: t.text }}>
              {locale === "id" ? "Hapus aplikasi?" : "Delete app?"}
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: t.textSub, lineHeight: 1.5 }}>
              {locale === "id"
                ? `Aplikasi "${app.name}" akan dihapus permanen dan tidak bisa dipulihkan.`
                : `The app "${app.name}" will be permanently deleted and cannot be restored.`}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: `1px solid ${t.border}`,
                  background: t.surface,
                  color: t.textSub,
                  cursor: deleting ? "not-allowed" : "pointer",
                }}
              >
                {locale === "id" ? "Batal" : "Cancel"}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: t.red,
                  color: "#fff",
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.85 : 1,
                }}
              >
                {deleting
                  ? (locale === "id" ? "Menghapus..." : "Deleting...")
                  : (locale === "id" ? "Ya, Hapus" : "Yes, Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
