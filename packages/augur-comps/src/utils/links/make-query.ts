/**
 * Returns a formatted query string
 * @param {object} query - Object with query param key:value pairs
 * @returns {string}
 */
export default function makeQuery(query: any): string {
  return Object.keys(query).reduce(
    (p, paramKey, i) =>
      `${i === 0 ? "?" : ""}${p}${
        i === 0 ? "" : "&"
      }${paramKey}=${encodeURIComponent(query[paramKey])}`,
    "",
  );
}
