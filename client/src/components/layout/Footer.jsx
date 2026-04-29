import { useT } from "../../context/ThemeContext";

export default function Footer() {
  const { t, locale } = useT();

  return (
    <footer style={{ borderTop: `1px solid ${t.border}`, marginTop: 64, padding: "20px 24px", textAlign: "center", fontSize: 11, color: t.textHint, background: t.navBg }}>
      <span style={{ fontWeight: 600, color: t.textSub }}>ADR Group of Companies</span>
      {" "}
      {locale === "id"
        ? " · Wisma ADR, Jl. Pluit Raya I No. 1, Jakarta Utara · Hanya untuk penggunaan internal · © 2026"
        : " · Wisma ADR, Jl. Pluit Raya I No. 1, North Jakarta · Internal use only · © 2026"}
    </footer>
  );
}
