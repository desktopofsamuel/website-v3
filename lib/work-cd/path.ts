export function workCdSlugFromPath(pathname: string): string | null {
  const prefix = "/dev/work-cd/";
  if (!pathname.startsWith(prefix)) return null;
  const first = pathname.slice(prefix.length).split("/")[0];
  if (!first || first === "demo") return null;
  return first;
}
