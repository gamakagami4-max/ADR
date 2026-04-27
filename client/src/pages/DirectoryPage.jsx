import { useMemo, useState } from "react";
import AppCard from "../components/apps/AppCard";
import { useT } from "../context/ThemeContext";
import { SectionCard, SectionTitle } from "../components/layout/SectionBlocks";

const PLATFORM_OPTIONS = ["Web", "Android", "iOS", "iOS & Android", "Web & Mobile"];
const STATUS_OPTIONS = ["beta", "live", "internal"];

const EMPTY_APP = {
  name: "",
  division: "",
  platform: "",
  category: "",
  tagline: "",
  about: "",
  status: "beta",
  icon: "",
  iconName: "",
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

function AddAppModal({ t, onClose, onSubmit }) {
  const [app, setApp] = useState(EMPTY_APP);

  const set = (key) => (e) => setApp((prev) => ({ ...prev, [key]: e.target.value }));

  const handleIconUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setApp((prev) => ({ ...prev, icon: String(reader.result), iconName: file.name }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const { name, division, platform, category, tagline, icon } = app;
    if (!name.trim() || !division.trim() || !platform || !category.trim() || !tagline.trim() || !icon) return;
    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "app"}-${Date.now()}`;
    onSubmit({
      id, icon: app.icon, name: name.trim(), division: division.trim(),
      version: "v1.0.0", platform, access: "Internal", status: app.status,
      rating: "0.0", ratingCount: "0", stars: 0,
      tags: [division.trim(), category.trim()],
      tagline: tagline.trim(), desc: tagline.trim(),
      about: app.about.trim() || `${name.trim()} is a newly added internal app. Please update this description with detailed business context.`,
      category: category.trim(), size: "TBD",
      updated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      users: "0 active",
    });
  };

  const inputStyle = {
    background: t.input, border: `1px solid ${t.border}`, borderRadius: 8,
    padding: "9px 11px", fontSize: 13, color: t.text, outline: "none",
    width: "100%", boxSizing: "border-box", fontFamily: "inherit",
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
              <SectionTitle>Add new app</SectionTitle>
              <p style={{ margin: "4px 0 18px", fontSize: 12, color: t.textHint, lineHeight: 1.6 }}>
                Create a new internal app entry. Fields marked <span style={{ color: "#e24b4a" }}>*</span> are required.
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
                  <select style={inputStyle} value={app.platform} onChange={set("platform")}>
                    <option value="">Select platform</option>
                    {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>

                <Field label="Status">
                  <select style={inputStyle} value={app.status} onChange={set("status")}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
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
                  <Field label="App icon" required>
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
              </div>
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
                style={{ fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 8, background: t.red, color: "#fff", border: "none", cursor: "pointer" }}
              >
                Save app
              </button>
            </div>

          </SectionCard>
        </div>
      </div>
    </>
  );
}

export default function DirectoryPage({ apps, onViewDetail, isAdmin, onAddApp }) {
  const { t } = useT();
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

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

  const handleAddApp = (payload) => {
    onAddApp(payload);
    setShowAddModal(false);
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
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: t.textHint, fontSize: 12 }}>
              ✕
            </button>
          )}
        </div>
        <select value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)} style={selectStyle}>
          {allDivisions.map((d) => <option key={d} value={d}>{d === "All" ? "All Divisions" : d}</option>)}
        </select>
        <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} style={selectStyle}>
          {allPlatforms.map((p) => <option key={p} value={p}>{p === "All" ? "All Platforms" : p}</option>)}
        </select>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            style={{ fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, background: t.red, color: "#fff", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            + Add App
          </button>
        )}
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
          <button
            onClick={() => { setSearch(""); setDivisionFilter("All"); setPlatformFilter("All"); }}
            style={{ marginTop: 10, fontSize: 12, color: t.red, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            Clear filters
          </button>
        </div>
      )}

      {isAdmin && showAddModal && (
        <AddAppModal t={t} onClose={() => setShowAddModal(false)} onSubmit={handleAddApp} />
      )}
    </main>
  );
}