export function singleFlight<T>(run: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | null = null;
  return () => {
    if (pending === null) {
      pending = run().finally(() => {
        pending = null;
      });
    }
    return pending;
  };
}
