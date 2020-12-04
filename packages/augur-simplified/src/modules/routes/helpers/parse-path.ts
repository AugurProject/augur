const parsePath = stringPath => {
  let sanitizedPaths = [];

  if (stringPath == null) return sanitizedPaths;

  sanitizedPaths = stringPath
    .split("/")
    .reduce((p, path) => (path.length === 0 ? p : [...p, path]), []);

  return sanitizedPaths;
};

export default parsePath;
