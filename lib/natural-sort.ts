/** Natural sort for filenames (okinawa-2 before okinawa-10). */
export function naturalSort(a: string, b: string): number {
  const re = /(\d+)|(\D+)/g;

  const splitA = a.match(re) ?? [a];
  const splitB = b.match(re) ?? [b];

  const len = Math.max(splitA.length, splitB.length);

  for (let i = 0; i < len; i++) {
    const partA = splitA[i] ?? "";
    const partB = splitB[i] ?? "";

    const numA = /^\d+$/.test(partA) ? Number(partA) : null;
    const numB = /^\d+$/.test(partB) ? Number(partB) : null;

    if (numA !== null && numB !== null) {
      if (numA !== numB) return numA - numB;
      continue;
    }

    const cmp = partA.localeCompare(partB, undefined, { sensitivity: "base" });
    if (cmp !== 0) return cmp;
  }

  return 0;
}
