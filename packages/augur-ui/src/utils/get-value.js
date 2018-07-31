// Gets value of a arbitrarily deeply nested value by key path
// @params {Object} obj - parent object
// @params {String} target - string of path `this.is.the.target`
// @returns value - returns null if value is not found, otherwise, returns value
export default function getValue(obj, target) {
  return target.split('.').reduce((o, x) => ((typeof o === 'undefined' || o === null) ? o : o[x]), obj)
}
