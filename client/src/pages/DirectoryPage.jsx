import { useMemo, useState } from "react";
import AppCard from "../components/apps/AppCard";
import { useT } from "../context/ThemeContext";
import { ALL_DIVISIONS, ALL_PLATFORMS, apps } from "../data/apps";

export default function DirectoryPage({ onViewDetail }) {
  const { t } = useT();
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.division.toLowerCase().includes(q) ||
        app.tags.some((tg) => tg.toLowerCase().includes(q)) ||
        app.tagline.toLowerCase().includes(q);

      return (
        matchSearch &&
        (divisionFilter === "All" || app.division === divisionFilter) &&
        (platformFilter === "All" || app.platform === platformFilter)
      );
    });
  }, [search, divisionFilter, platformFilter]);

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
          {ALL_DIVISIONS.map((division) => (
            <option key={division} value={division}>
              {division === "All" ? "All Divisions" : division}
            </option>
          ))}
        </select>
        <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} style={selectStyle}>
          {ALL_PLATFORMS.map((platform) => (
            <option key={platform} value={platform}>
              {platform === "All" ? "All Platforms" : platform}
            </option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: 11, color: t.textHint, marginBottom: 20 }}>
        {filtered.length === apps.length ? `Showing all ${apps.length} apps` : `${filtered.length} of ${apps.length} apps`}
        {search && (
          <span>
            {" "}
            for <strong style={{ color: t.text }}>&ldquo;{search}&rdquo;</strong>
          </span>
        )}
      </p>

      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {filtered.map((app) => (
            <AppCard key={app.id} app={app} onViewDetail={onViewDetail} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: 36, opacity: 0.2, marginBottom: 12 }}>⊘</div>
          <div style={{ fontSize: 13, color: t.textSub }}>No apps match your search.</div>
          <button
            onClick={() => {
              setSearch("");
              setDivisionFilter("All");
              setPlatformFilter("All");
            }}
            style={{ marginTop: 10, fontSize: 12, color: t.red, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
