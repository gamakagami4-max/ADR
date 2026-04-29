import { useT } from "../../context/ThemeContext";

export default function StatusBadge({ status }) {
  const { t, locale } = useT();

  if (status === "stable") {
    return (
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: 99,
          background: t.stableBg,
          color: t.stableText,
          border: `1px solid ${t.stableBorder}`,
          whiteSpace: "nowrap",
        }}
      >
        {locale === "id" ? "Stabil" : "Stable"}
      </span>
    );
  }

  if (status === "beta") {
    return (
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: 99,
          background: t.betaBg,
          color: t.betaText,
          border: `1px solid ${t.betaBorder}`,
          whiteSpace: "nowrap",
        }}
      >
        Beta
      </span>
    );
  }

  return null;
}
