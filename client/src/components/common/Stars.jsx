export default function Stars({ count, size = "sm" }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: size === "lg" ? 15 : 11, letterSpacing: -0.5 }}>
      {Array.from({ length: 5 }, (_, i) => (i < count ? "★" : "☆")).join("")}
    </span>
  );
}
