export function logError(err?: Error|null): void {
  if (err != null) console.error(err);
}
