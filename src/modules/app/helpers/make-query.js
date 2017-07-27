/**
  * Returns a formatted query string
  * @param {object} query - The array of query params
  * @returns {string}
*/
export default function makeQuery(query) {
  return Object.keys(query).reduce((p, paramKey, i) => `${i === 0 ? '?' : ''}${p}${i === 0 ? '' : '&'}${paramKey}=${query[paramKey]}`, '');
}
