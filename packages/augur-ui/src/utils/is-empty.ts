// Checks if passed in value is empty (replaces lodash)
// @params {Any} value - passed in value
// @returns boolean - returns true if value isEmpty, otherwise, returns false
export const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;

