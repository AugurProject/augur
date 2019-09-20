export const keyBy = (array: Array<any>, key: string): {[key: string]: any} =>
  (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});

export const keyArrayBy = (array: Array<any>, key: string): {[key: string]: any} =>
  (array || [])
    .reduce((p, x) => [...p, x[key]], [])
    .reduce((p, k) => ({ ...p, [k]: array.filter((a) => a[key] === k) }), {});



