export type PageTitle = `${string} | ${string}`;

export function formatTitle(page: string, site: string): PageTitle {
  return `${page} | ${site}`;
}
