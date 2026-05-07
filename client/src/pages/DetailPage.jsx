import { useState } from "react";
import Tag from "../components/common/Tag";
import { InfoRow, SectionCard, SectionTitle } from "../components/layout/SectionBlocks";
import { formatCategoryLabel } from "../constants/appCategories";
import { normalizeWebUrl, platformUsesWebUrl } from "../constants/platforms";
import { useT } from "../context/ThemeContext";

function getWebOpenHref(app) {
  if (!platformUsesWebUrl(app.platform)) return null;
  const raw = String(app.webUrl || "").trim();
  if (!raw) return null;
  return normalizeWebUrl(raw);
}

/** Long strings without spaces must still wrap inside flex/grid layouts. */
const wrapProse = {
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  maxWidth: "100%",
};

export default function DetailPage({ app, onBack, isAdmin, onDeleteApp, onEditApp }) {
  const { t, tr, locale } = useT();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const hasImageIcon = typeof app.icon === "string" && (app.icon.startsWith("data:image/") || app.icon.startsWith("http"));
  const features = Array.isArray(app.features) ? app.features : [];
  const screenshots = Array.isArray(app.screenshots) ? app.screenshots : [];
  const webOpenHref = getWebOpenHref(app);
  const attachments = Array.isArray(app.attachments)
    ? app.attachments.filter((item) => item && typeof item.data === "string" && item.data.startsWith("data:application/pdf"))
    : [];
  const attachmentList = attachments.length > 0
    ? attachments
    : (typeof app.attachmentData === "string" && app.attachmentData.startsWith("data:application/pdf")
        ? [{ name: app.attachmentName || "attachment.pdf", data: app.attachmentData }]
        : []);

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
        /* Grid/flex children default to min-width:auto; unbreakable text then overflows. */
        .detail-layout > * {
          min-width: 0;
        }
        @media (max-width: 768px) {
          .detail-layout {
            grid-template-columns: 1fr !important;
            gap: var(--layout-detail-stack-gap) !important;
          }
          .detail-features {
            grid-template-columns: 1fr !important;
          }
          .detail-screenshots {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <main className="detail-main" style={{ maxWidth: 960, margin: "0 auto", padding: "var(--layout-page-py) var(--layout-page-px)" }}>
      <button
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: t.textHint, background: "none", border: "none", cursor: "pointer", marginBottom: "var(--layout-detail-back-mb)", padding: 0 }}
      >
        ← {tr("detailBack")}
      </button>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden", marginBottom: "var(--layout-detail-hero-card-mb)" }}>
        <div style={{ height: 3, background: t.red }} />
        <div className="detail-hero" style={{ padding: "var(--layout-detail-hero-pad)" }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap", minWidth: 0 }}>
            <div style={{ width: 68, height: 68, borderRadius: 16, background: t.redLight, border: `1px solid ${t.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
              {hasImageIcon ? <img src={app.icon} alt={`${app.name} icon`} style={{ width: "100%", height: "100%", borderRadius: 16, objectFit: "cover" }} /> : app.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: 0, ...wrapProse }}>{app.name}</h1>
              </div>
              <p style={{ fontSize: 13, color: t.textSub, lineHeight: 1.6, marginBottom: webOpenHref ? 12 : 16, marginTop: 0, ...wrapProse }}>{app.desc}</p>
              {webOpenHref && (
                <a
                  href={webOpenHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    background: t.red,
                    padding: "10px 16px",
                    borderRadius: 8,
                    textDecoration: "none",
                    marginBottom: 16,
                  }}
                >
                  {locale === "id" ? "Buka aplikasi" : "Open app"}
                  <span aria-hidden="true" style={{ fontSize: 12 }}>↗</span>
                </a>
              )}
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
                  {deleteError && <span style={{ fontSize: 12, color: t.red, ...wrapProse }}>{deleteError}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-layout" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "var(--layout-detail-stack-gap)", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard>
            <SectionTitle>{locale === "id" ? "Tentang aplikasi ini" : "About this app"}</SectionTitle>
            <p style={{ fontSize: 13, color: t.textSub, lineHeight: 1.65, margin: 0, ...wrapProse }}>{app.about}</p>
          </SectionCard>

          <SectionCard>
            <SectionTitle>{locale === "id" ? "Fitur utama" : "Key features"}</SectionTitle>
            {features.length > 0 ? (
              <ul className="detail-features" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 0, margin: 0, listStyle: "none" }}>
                {features.map((feature, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: t.textSub, lineHeight: 1.45, minWidth: 0 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.red, flexShrink: 0, marginTop: 5 }} />
                    <span style={{ ...wrapProse }}>{feature}</span>
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
              <div style={{ background: t.tag, border: `1px solid ${t.border}`, borderRadius: 12, padding: "var(--layout-section-pad)", fontSize: 12, color: t.textHint }}>
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
              [locale === "id" ? "Kategori" : "Category", formatCategoryLabel(app.category, locale)],
              [locale === "id" ? "Platform" : "Platform", app.platform],
              [locale === "id" ? "PIC System" : "PIC System", app.picSystem || "-"],
              [locale === "id" ? "System Owner" : "System Owner", app.systemOwner || "-"],
              ...(platformUsesWebUrl(app.platform) && String(app.webUrl || "").trim()
                ? [
                    [
                      locale === "id" ? "Tautan" : "Link",
                      webOpenHref ? (
                        <a
                          href={webOpenHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: t.red, fontWeight: 600, wordBreak: "break-all", textDecoration: "underline" }}
                        >
                          {webOpenHref}
                        </a>
                      ) : (
                        String(app.webUrl).trim()
                      ),
                    ],
                  ]
                : []),
              ...(attachmentList.length > 0
                ? [
                    [
                      locale === "id" ? "Lampiran" : "Attachments",
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {attachmentList.map((item, index) => (
                          <a
                            key={`${item.name}-${index}`}
                            href={item.data}
                            download={item.name || `${app.name}-attachment-${index + 1}.pdf`}
                            style={{ color: t.red, fontWeight: 600, textDecoration: "underline" }}
                          >
                            {item.name || `${locale === "id" ? "Unduh PDF" : "Download PDF"} ${index + 1}`}
                          </a>
                        ))}
                      </div>,
                    ],
                  ]
                : []),
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
            padding: "var(--layout-modal-overlay-pad)",
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
              padding: "var(--layout-section-pad)",
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: 16, color: t.text }}>
              {locale === "id" ? "Hapus aplikasi?" : "Delete app?"}
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: t.textSub, lineHeight: 1.5, ...wrapProse }}>
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
