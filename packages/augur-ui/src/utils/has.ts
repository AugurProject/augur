// Checks if a path exists on an object and returns true/false
// @params {Object} src - object to test
// @params {Array of strings or numbers} path - array path. looking for a.b? pass ["a", "b"]
// @returns Boolean - true or false
export default function has(src: object, path: Array<string | number>) {
  if (!src) return false;
  let result: boolean = true;
  let test: object = src;
  path.forEach((key) => {
    if (!test[key]) result = false;
    if (result) test = test[key];
  })
  return result;
}