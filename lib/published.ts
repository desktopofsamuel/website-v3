export function published<T extends { draft?: boolean }>(docs: T[]): T[] {
  return docs.filter((doc) => doc.draft !== true);
}
