export function asList<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}
