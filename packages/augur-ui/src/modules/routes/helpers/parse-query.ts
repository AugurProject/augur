/**
 * Parses the raw query string into a formatted array
 * @param {string} searchString - The raw query param string
 * @returns {object}
 */
export default function parseQuery(searchString) {
  let pairSplit;
  return (searchString || "")
    .replace(/^\?/, "")
    .split("&")
    .reduce((p, pair) => {
      pairSplit = pair.split("=");
      if (pairSplit.length >= 1) {
        if (pairSplit[0].length) {
          if (pairSplit.length >= 2 && pairSplit[1]) {
            p[decodeURIComponent(pairSplit[0])] = decodeURIComponent(
              pairSplit[1]
            );
          } else {
            p[decodeURIComponent(pairSplit[0])] = undefined;
          }
        }
      }
      return p;
    }, {});
}

export function parseLocation(href) {
  let query = href;
  if (query.indexOf('?') !== -1) {
    query = query.replace('#!', '&').split('?')[1];
  }
  return parseQuery(query);
}
