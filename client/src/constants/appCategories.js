export const APP_CATEGORIES = ["main", "sub", "support"];

export function normalizeAppCategory(value) {
  const v = String(value ?? "").trim().toLowerCase();
  return APP_CATEGORIES.includes(v) ? v : "";
}

export function formatCategoryLabel(value, locale) {
  const v = normalizeAppCategory(value);
  if (!v) return String(value ?? "").trim() || "—";
  if (locale === "id") {
    if (v === "main") return "Utama";
    if (v === "sub") return "Sub";
    if (v === "support") return "Dukungan";
  }
  if (v === "main") return "Main";
  if (v === "sub") return "Sub";
  if (v === "support") return "Support";
  return "—";
}

export function categorySelectPlaceholder(locale) {
  return locale === "id" ? "Pilih kategori" : "Select category";
}
