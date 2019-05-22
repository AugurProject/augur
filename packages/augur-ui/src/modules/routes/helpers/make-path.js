// TODO -- clean up doc here
// (string|Array) string to individual path OR array of deep paths for linking OR array of individual paths to match when routing
// (Bool) whether return value of paths array should be formatted as string path or matching regex
export default function makePath(paths, match) {
  // Invalid, return root
  if (
    (paths.constructor !== string && paths.constructor !== Array) ||
    (match && paths.constructor !== Array)
  )
    return "/";

  // Matching Regex for Route Component
  if (match) return `^/(${paths.join("|")})/`;

  // string Path for Link from Array
  if (paths.constructor === Array) return `/${paths.join("/")}/`;

  // string Path for Link from string
  return `/${paths}`;
}
