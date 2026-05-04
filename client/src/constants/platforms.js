/** Platforms for which a public / internal web URL can be stored. */
export const WEB_URL_PLATFORMS = ["Web", "Web & Mobile"];

export function platformUsesWebUrl(platform) {
  return WEB_URL_PLATFORMS.includes(platform);
}

/** Trim, ensure http(s), return empty string if input empty, or null if invalid. */
export function normalizeWebUrl(raw) {
  const t = String(raw ?? "").trim();
  if (!t) return "";
  let candidate = t;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.href;
  } catch {
    return null;
  }
}
