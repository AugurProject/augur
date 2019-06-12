// Checks if passed in value is empty (replaces lodash)
// @params {Any} value - passed in value
// @returns boolean - returns true if value isEmpty, otherwise, returns false
export const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
// Checks if passed in value is populated
// @params {Any} value - passed in value
// @returns boolean - returns true if value is populated, otherwise, returns false
export function isPopulated(value: any): boolean {
  if (typeof value === "boolean") return value;
  return value !== "" && !isEmpty(value);
}
