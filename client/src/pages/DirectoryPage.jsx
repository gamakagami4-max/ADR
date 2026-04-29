import { useMemo, useState } from "react";
import AppCard from "../components/apps/AppCard";
import { useT } from "../context/ThemeContext";
import { SectionCard, SectionTitle } from "../components/layout/SectionBlocks";

const PLATFORM_OPTIONS = ["Web", "Android", "iOS", "iOS & Android", "Web & Mobile"];

const EMPTY_APP = {
  name: "",
  division: "",
  platform: "",
  category: "",
  tagline: "",
  about: "",
  icon: "",
  iconName: "",
  features: [""],
  screenshots: [],
};

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--label-color)" }}>
        {label} {required && <span style={{ color: "#e24b4a" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function mapAppToForm(app) {
  return {
    name: app?.name || "",
    division: app?.division || "",
    platform: app?.platform || "",
    category: app?.category || "",
    tagline: app?.tagline || "",
    about: app?.about || "",
    icon: app?.icon || "",
    iconName: "",
    features: Array.isArray(app?.features) && app.features.length > 0 ? app.features : [""],
    screenshots: Array.isArray(app?.screenshots) ? app.screenshots : [],
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

async function optimizeImage(file, { maxWidth, maxHeight, quality = 0.82 }) {
  const source = await readFileAsDataUrl(file);

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        resolve(source);
        return;
      }

      context.drawImage(image, 0, 0, width, height);

      const optimized = canvas.toDataURL("image/jpeg", quality);
      resolve(optimized);
    };
    image.onerror = () => reject(new Error(`Failed to process ${file.name}`));
    image.src = source;
  });
}

function AddAppModal({ t, onClose, onSubmit, initialApp }) {
  const [app, setApp] = useState(() => (initialApp ? mapAppToForm(initialApp) : EMPTY_APP));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEditing = Boolean(initialApp);

  const set = (key) => (e) => setApp((prev) => ({ ...prev, [key]: e.target.value }));
  const setFeature = (index) => (e) =>
    setApp((prev) => ({
      ...prev,
      features: prev.features.map((feature, featureIndex) => (featureIndex === index ? e.target.value : feature)),
    }));

  const addFeatureField = () =>
    setApp((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));

  const removeFeatureField = (index) =>
    setApp((prev) => ({
      ...prev,
      features: prev.features.length === 1 ? [""] : prev.features.filter((_, featureIndex) => featureIndex !== index),
    }));

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const icon = await optimizeImage(file, { maxWidth: 512, maxHeight: 512, quality: 0.85 });
      setApp((prev) => ({ ...prev, icon, iconName: file.name }));
    } catch {
      setError("Failed to process the app icon.");
    } finally {
      e.target.value = "";
    }
  };

  const handleScreenshotsUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const settled = await Promise.allSettled(
        files.map((file) => optimizeImage(file, { maxWidth: 1440, maxHeight: 1440, quality: 0.82 }))
      );
      const nextScreenshots = settled
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      if (nextScreenshots.length > 0) {
        // Append to existing screenshots so users can add files in multiple picks.
        setApp((prev) => ({ ...prev, screenshots: [...prev.screenshots, ...nextScreenshots] }));
      }
      if (nextScreenshots.length !== settled.length) {
        setError("Some screenshots could not be processed.");
      }
    } catch {
      setError("Failed to read screenshots.");
    } finally {
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    setError("");
    const { name, division, platform, category, tagline } = app;
    if (!name.trim() || !division.trim() || !platform || !category.trim() || !tagline.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "app"}-${Date.now()}`;
    const features = app.features.map((item) => item.trim()).filter(Boolean);

    try {
      setSaving(true);
      await onSubmit({
        id: initialApp?.id || id,
        icon: app.icon,
        name: name.trim(),
        division: division.trim(),
        version: initialApp?.version || "v1.0.0",
        platform,
        access: initialApp?.access || "Internal",
        rating: initialApp?.rating || "0.0",
        ratingCount: initialApp?.ratingCount || "0",
        stars: initialApp?.stars || 0,
        tags: [division.trim(), category.trim()],
        tagline: tagline.trim(),
        desc: tagline.trim(),
        about: app.about.trim() || `${name.trim()} is a newly added internal app. Please update this description with detailed business context.`,
        category: category.trim(),
        size: initialApp?.size || "TBD",
        updated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        users: initialApp?.users || "0 active",
        features,
        screenshots: app.screenshots,
      });
      onClose();
    } catch (submitError) {
      setError(submitError?.message || "Failed to save app.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: t.input, border: `1px solid ${t.border}`, borderRadius: 8,
    padding: "9px 11px", fontSize: 13, color: t.text, outline: "none",
    width: "100%", boxSizing: "border-box", fontFamily: "inherit",
  };
  const selectStyle = {
    ...inputStyle,
    padding: "9px 11px",
    cursor: "pointer",
  };

  return (
    <>
      <style>{`
        @media (max-width: 599px) {
          .add-modal-overlay {
            align-items: flex-end !important;
            padding: 0 !important;
          }
          .add-modal-dialog {
            max-width: 100% !important;
            border-radius: 16px 16px 0 0 !important;
          }
          .add-modal-body {
            padding: 0 16px 16px !important;
          }
          .add-modal-header {
            padding: 16px 16px 0 !important;
          }
          .add-modal-footer {
            padding: 12px 16px !important;
          }
          .add-modal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div
        className="add-modal-overlay"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20, zIndex: 60,
        }}
      >
        <div
          className="add-modal-dialog"
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", maxWidth: 580 }}
        >
          <SectionCard style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>

            {/* Header */}
            <div className="add-modal-header" style={{ padding: "20px 24px 0", flexShrink: 0 }}>
              <SectionTitle>{isEditing ? "Edit app" : "Add new app"}</SectionTitle>
              <p style={{ margin: "4px 0 18px", fontSize: 12, color: t.textHint, lineHeight: 1.6 }}>
                {isEditing ? "Update the selected app entry." : "Create a new internal app entry."} Fields marked <span style={{ color: "#e24b4a" }}>*</span> are required.
              </p>
            </div>

            {/* Body */}
            <div className="add-modal-body" style={{ padding: "0 24px 20px", overflowY: "auto", flex: 1 }}>
              <div
                className="add-modal-grid"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
              >
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="App name" required>
                    <input style={inputStyle} type="text" placeholder="e.g. ADR Warehouse Pro" value={app.name} onChange={set("name")} />
                  </Field>
                </div>

                <Field label="Division" required>
                  <input style={inputStyle} type="text" placeholder="e.g. Distribution" value={app.division} onChange={set("division")} />
                </Field>

                <Field label="Category" required>
                  <input style={inputStyle} type="text" placeholder="e.g. Logistics" value={app.category} onChange={set("category")} />
                </Field>

                <Field label="Platform" required>
                  <select style={selectStyle} value={app.platform} onChange={set("platform")}>
                    <option value="">Select platform</option>
                    {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Short tagline" required>
                    <input style={inputStyle} type="text" placeholder="One-sentence value proposition" value={app.tagline} onChange={set("tagline")} />
                  </Field>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="About">
                    <textarea
                      style={{ ...inputStyle, resize: "vertical", minHeight: 72, lineHeight: 1.55 }}
                      placeholder="Describe what this app does, who uses it, and why it matters…"
                      value={app.about}
                      onChange={set("about")}
                    />
                  </Field>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Key features">
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {app.features.map((feature, index) => (
                        <div key={index} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            style={inputStyle}
                            type="text"
                            placeholder={index === 0 ? "Example: Real-time stock visibility" : `Feature ${index + 1}`}
                            value={feature}
                            onChange={setFeature(index)}
                          />
                          <button
                            type="button"
                            onClick={() => removeFeatureField(index)}
                            style={{
                              flexShrink: 0,
                              fontSize: 12,
                              fontWeight: 600,
                              padding: "8px 10px",
                              borderRadius: 8,
                              background: t.surface,
                              color: t.textSub,
                              border: `1px solid ${t.border}`,
                              cursor: "pointer",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeatureField}
                        style={{
                          alignSelf: "flex-start",
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "8px 12px",
                          borderRadius: 8,
                          background: t.tag,
                          color: t.text,
                          border: `1px solid ${t.border}`,
                          cursor: "pointer",
                        }}
                      >
                        + Add feature
                      </button>
                    </div>
                  </Field>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="App icon">
                    <label style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px", border: `1px dashed ${t.border}`,
                      borderRadius: 8, background: t.input, cursor: "pointer",
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 9,
                        border: `1px solid ${t.border}`, background: t.tag,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, overflow: "hidden",
                      }}>
                        {app.icon
                          ? <img src={app.icon} alt="Icon preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ fontSize: 16, color: t.textHint }}>+</span>
                        }
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: t.textSub, fontWeight: 600 }}>
                          {app.iconName || "Click to upload icon"}
                        </div>
                        <div style={{ fontSize: 11, color: t.textHint, marginTop: 2 }}>
                          PNG, JPG or WebP — square, min 256×256 px
                        </div>
                      </div>
                      <input type="file" accept="image/*" onChange={handleIconUpload} style={{ display: "none" }} />
                    </label>
                  </Field>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Screenshots">
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 14,
                          padding: "14px 16px",
                          border: `1px solid ${t.border}`,
                          borderRadius: 10,
                          background: t.surface,
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>
                            Add screenshots
                          </div>
                          <div style={{ fontSize: 11, color: t.textHint }}>
                            PNG, JPG or WebP
                          </div>
                        </div>
                        <div
                          style={{
                            flexShrink: 0,
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: t.tag,
                            color: t.text,
                            border: `1px solid ${t.border}`,
                          }}
                        >
                          Choose files
                        </div>
                        <input type="file" accept="image/*" multiple onChange={handleScreenshotsUpload} style={{ display: "none" }} />
                      </label>
                      {app.screenshots.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))", gap: 10 }}>
                          {app.screenshots.map((src, index) => (
                            <div key={`${index}-${src.slice(0, 24)}`} style={{ position: "relative" }}>
                              <img
                                src={src}
                                alt={`Screenshot ${index + 1}`}
                                style={{ width: "100%", aspectRatio: "9 / 16", objectFit: "cover", borderRadius: 10, border: `1px solid ${t.border}` }}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setApp((prev) => ({
                                    ...prev,
                                    screenshots: prev.screenshots.filter((_, screenshotIndex) => screenshotIndex !== index),
                                  }))
                                }
                                style={{
                                  position: "absolute",
                                  top: 6,
                                  right: 6,
                                  width: 24,
                                  height: 24,
                                  borderRadius: 999,
                                  border: "none",
                                  background: "rgba(19, 28, 45, 0.85)",
                                  color: "#fff",
                                  cursor: "pointer",
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                </div>
              </div>

              {error && (
                <div style={{ marginTop: 12, fontSize: 12, color: t.red }}>
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="add-modal-footer"
              style={{ borderTop: `1px solid ${t.divider}`, padding: "14px 24px", display: "flex", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}
            >
              <button
                onClick={onClose}
                style={{ fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 8, background: t.surface, color: t.textSub, border: `1px solid ${t.border}`, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                style={{ fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 8, background: t.red, color: "#fff", border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.85 : 1 }}
              >
                {saving ? "Saving..." : isEditing ? "Save changes" : "Save app"}
              </button>
            </div>

          </SectionCard>
        </div>
      </div>
    </>
  );
}

export default function DirectoryPage({
  apps,
  loading,
  error,
  onViewDetail,
  isAdmin,
  onAddApp,
  onUpdateApp,
  onDeleteApp,
  editingApp,
  onEditApp,
  onCloseEditApp,
}) {
  const { t, tr, locale } = useT();
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [pendingDeleteApp, setPendingDeleteApp] = useState(null);
  const [deletingAppId, setDeletingAppId] = useState("");

  const allDivisions = useMemo(() => ["All", ...Array.from(new Set(apps.map((a) => a.division)))], [apps]);
  const allPlatforms = useMemo(() => ["All", ...Array.from(new Set(apps.map((a) => a.platform)))], [apps]);

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.division.toLowerCase().includes(q) ||
        app.tags.some((tg) => tg.toLowerCase().includes(q)) ||
        app.tagline.toLowerCase().includes(q);
      return matchSearch && (divisionFilter === "All" || app.division === divisionFilter) && (platformFilter === "All" || app.platform === platformFilter);
    });
  }, [search, divisionFilter, platformFilter, apps]);

  const inputStyle = {
    background: t.input,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    padding: "8px 32px",
    fontSize: 13,
    color: t.text,
    outline: "none",
    width: "100%",
  };

  const selectStyle = {
    background: t.input,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    color: t.textSub,
    outline: "none",
    cursor: "pointer",
  };

  const handleOpenAddModal = () => {
    // Close any active edit before opening the add modal
    onCloseEditApp();
    setShowAddModal(true);
  };

  // Open in-app confirmation popup before deleting.
  const handleDeleteAppFromCard = async (app) => {
    setPendingDeleteApp(app);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteApp?.id) return;
    const appId = pendingDeleteApp.id;
    setDeletingAppId(appId);
    setPendingDeleteApp(null);
    try {
      await onDeleteApp(appId);
    } finally {
      setDeletingAppId("");
    }
  };

  // FIX: capture editingApp in a local variable at the time the submit
  // button is clicked, so it can't be cleared by a concurrent state update
  // before the conditional branch runs.
  const handleSubmitApp = (payload) => {
    const currentEditingApp = editingApp;
    console.log("[DirectoryPage] Submitting modal", {
      mode: currentEditingApp ? "edit" : "create",
      editingAppId: currentEditingApp?.id || null,
      payloadId: payload?.id,
      payloadName: payload?.name,
    });
    if (currentEditingApp) {
      return onUpdateApp(currentEditingApp.id, payload);
    }
    return onAddApp(payload);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    onCloseEditApp();
  };

  return (
    <main style={{ maxWidth: 1152, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: "0 0 4px 0" }}>{tr("dirTitle")}</h1>
        <p style={{ fontSize: 13, color: t.textHint, margin: 0 }}>{tr("dirSubtitle")}</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: t.textHint, fontSize: 14, pointerEvents: "none" }}>⌕</span>
          <input type="text" placeholder={locale === "id" ? "Cari nama, divisi, atau tag…" : "Search by name, division, or tag…"} value={search} onChange={(e) => setSearch(e.target.value)} style={inputStyle} />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: t.textHint, fontSize: 12 }}>
              ✕
            </button>
          )}
        </div>
        <select value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)} style={selectStyle}>
          {allDivisions.map((d) => <option key={d} value={d}>{d === "All" ? (locale === "id" ? "Semua Divisi" : "All Divisions") : d}</option>)}
        </select>
        <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} style={selectStyle}>
          {allPlatforms.map((p) => <option key={p} value={p}>{p === "All" ? (locale === "id" ? "Semua Platform" : "All Platforms") : p}</option>)}
        </select>
        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            style={{ fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, background: t.red, color: "#fff", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {locale === "id" ? "+ Tambah Aplikasi" : "+ Add App"}
          </button>
        )}
      </div>

      <p style={{ fontSize: 11, color: t.textHint, marginBottom: 20 }}>
        {filtered.length === apps.length
          ? (locale === "id" ? `Menampilkan semua ${apps.length} aplikasi` : `Showing all ${apps.length} apps`)
          : (locale === "id" ? `${filtered.length} dari ${apps.length} aplikasi` : `${filtered.length} of ${apps.length} apps`)}
        {search && <span> for <strong style={{ color: t.text }}>&ldquo;{search}&rdquo;</strong></span>}
      </p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "70px 0", color: t.textHint, fontSize: 13 }}>
          {locale === "id" ? "Memuat aplikasi..." : "Loading applications..."}
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "70px 0", color: t.red, fontSize: 13 }}>
          {error}
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {filtered.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onViewDetail={onViewDetail}
              isAdmin={isAdmin}
              onEditApp={onEditApp}
              onDeleteApp={handleDeleteAppFromCard}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: 36, opacity: 0.2, marginBottom: 12 }}>⊘</div>
          <div style={{ fontSize: 13, color: t.textSub }}>{locale === "id" ? "Tidak ada aplikasi yang cocok dengan pencarian Anda." : "No apps match your search."}</div>
          <button
            onClick={() => { setSearch(""); setDivisionFilter("All"); setPlatformFilter("All"); }}
            style={{ marginTop: 10, fontSize: 12, color: t.red, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            {locale === "id" ? "Hapus filter" : "Clear filters"}
          </button>
        </div>
      )}

      {isAdmin && (showAddModal || Boolean(editingApp)) && (
        <AddAppModal
          key={editingApp?.id || "new-app"}
          t={t}
          onClose={handleCloseModal}
          onSubmit={handleSubmitApp}
          initialApp={editingApp || null}
        />
      )}

      {isAdmin && pendingDeleteApp && (
        <div
          onClick={() => (deletingAppId ? null : setPendingDeleteApp(null))}
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
                ? `Aplikasi "${pendingDeleteApp.name}" akan dihapus permanen dan tidak bisa dipulihkan.`
                : `The app "${pendingDeleteApp.name}" will be permanently deleted and cannot be restored.`}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => setPendingDeleteApp(null)}
                disabled={Boolean(deletingAppId)}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: `1px solid ${t.border}`,
                  background: t.surface,
                  color: t.textSub,
                  cursor: deletingAppId ? "not-allowed" : "pointer",
                }}
              >
                {locale === "id" ? "Batal" : "Cancel"}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={Boolean(deletingAppId)}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: t.red,
                  color: "#fff",
                  cursor: deletingAppId ? "not-allowed" : "pointer",
                  opacity: deletingAppId ? 0.85 : 1,
                }}
              >
                {deletingAppId
                  ? (locale === "id" ? "Menghapus..." : "Deleting...")
                  : (locale === "id" ? "Ya, Hapus" : "Yes, Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}