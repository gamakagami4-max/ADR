import { useT } from "../../context/ThemeContext";

export default function Tag({ children }) {
  const { t } = useT();

  return (
    <span
      style={{
        fontSize: 10,
        padding: "2px 7px",
        borderRadius: 6,
        background: t.tag,
        color: t.tagText,
        border: `1px solid ${t.tagBorder}`,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}
