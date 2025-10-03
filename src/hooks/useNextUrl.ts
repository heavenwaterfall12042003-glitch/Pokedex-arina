export function getSafeNext(
  raw: string | null | undefined,
  fallback = "/"
): string {
  const v = raw || fallback;
  try {
    const url = new URL(v, window.location.origin);
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}

export default function useNextUrl(defaultPath = "/") {
  const sp = new URLSearchParams(window.location.search);
  const fromQuery = sp.get("next");
  const fromSession = sessionStorage.getItem("intendedRoute");
  return getSafeNext(fromQuery || fromSession, defaultPath);
}
