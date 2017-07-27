/**
  * Returns a formatted query string
  * @param {array} query - The array of query params
  * @returns {string}
*/
export default function makeQuery(query) {
  return query.reduce((p, param, i) => `${p}${i === 0 ? '' : '&'}${Object.keys(param)[0]}=${param[Object.keys(param)[0]]}`, '');
}
