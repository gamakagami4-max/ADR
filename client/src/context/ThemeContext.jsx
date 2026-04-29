import { createContext, useContext } from "react";

export const LIGHT = {
  bg: "#f9fafb",
  surface: "#ffffff",
  border: "#e5e7eb",
  text: "#111827",
  textSub: "#6b7280",
  textHint: "#9ca3af",
  tag: "#f3f4f6",
  tagText: "#374151",
  tagBorder: "#e5e7eb",
  divider: "#f3f4f6",
  input: "#ffffff",
  navBg: "#ffffff",
  red: "#dc2626",
  redLight: "#fef2f2",
  redBorder: "#fecaca",
  stableText: "#065f46",
  stableBg: "#ecfdf5",
  stableBorder: "#a7f3d0",
  betaText: "#92400e",
  betaBg: "#fffbeb",
  betaBorder: "#fcd34d",
};

export const DARK = {
  bg: "#0f172a",
  surface: "#1e293b",
  border: "#334155",
  text: "#f1f5f9",
  textSub: "#94a3b8",
  textHint: "#64748b",
  tag: "#1e293b",
  tagText: "#cbd5e1",
  tagBorder: "#334155",
  divider: "#1e293b",
  input: "#1e293b",
  navBg: "#0f172a",
  red: "#ef4444",
  redLight: "#1c1010",
  redBorder: "#3b1515",
  stableText: "#6ee7b7",
  stableBg: "#022c22",
  stableBorder: "#065f46",
  betaText: "#fbbf24",
  betaBg: "#2d1a00",
  betaBorder: "#78350f",
};

export const ThemeContext = createContext({
  t: LIGHT,
  dark: false,
  toggle: () => {},
  locale: "en",
  toggleLocale: () => {},
  tr: (key) => key,
});

export const useT = () => useContext(ThemeContext);
