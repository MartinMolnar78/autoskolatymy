// Keep public assets and page links inside the configured deployment directory.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  return path.startsWith(base) ? path : `${base}${path.replace(/^\/+/, '')}`;
}
