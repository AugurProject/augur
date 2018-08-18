/**
 *
 * @param {Object} obj - Deeply nested object
 * @param {string[]} keys - Property name to use for values found at that index.
 */

export const ungroupBy = (obj, keys) => {
  const result = [];
  ungroupByStep({}, obj, keys, result);
  return result;
};

const ungroupByStep = (collectedProperties = {}, obj = {}, keys, results) => {
  if (keys.length === 0) {
    return results.push({
      ...collectedProperties,
      ...obj
    });
  }

  const newKey = keys.shift();
  Object.entries(obj).forEach(([key, value]) => {
    const fn = v =>
      ungroupByStep(
        {
          ...collectedProperties,
          [newKey]: key
        },
        v,
        keys.slice(),
        results
      );

    if (Array.isArray(value)) {
      value.forEach(fn);
    } else {
      fn(value);
    }
  });
};
