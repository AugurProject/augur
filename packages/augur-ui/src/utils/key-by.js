export const keyBy = (array, key) =>
  (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});

export const keyArrayBy = (array, key) =>
  (array || [])
    .reduce((p, x) => [...p, x[key]], [])
    .reduce((p, k) => ({ ...p, [k]: array.filter(a => a[key] === k) }), {});
