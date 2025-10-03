export type ThemeMode = "system" | "light" | "dark";

const KEY = "pokedex:theme";

export function getStoredTheme(): ThemeMode | null {
  const raw = localStorage.getItem(KEY);
  return raw === "light" || raw === "dark" || raw === "system" ? raw : null;
}

export function setStoredTheme(t: ThemeMode) {
  localStorage.setItem(KEY, t);
}

function prefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  const dark = mode === "dark" || (mode === "system" && prefersDark());
  root.classList.toggle("dark", dark);
}
