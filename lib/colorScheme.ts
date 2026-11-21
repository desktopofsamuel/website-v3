export type ColorScheme = "light" | "dark";

export function applyColorScheme(scheme: ColorScheme) {
  document.documentElement.classList.toggle("dark", scheme === "dark");
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.setAttribute("content", scheme);
}

export function schemeFromStoredTheme(stored: string | null): ColorScheme {
  return stored === "light" ? "light" : "dark";
}
