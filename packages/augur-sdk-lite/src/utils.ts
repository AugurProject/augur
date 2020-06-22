export function compareObjects(key: string, order: string) {
  return function(a: any, b: any) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  };
}

export function logError(
  err: Error | string | object | null,
  result?: any
): void {
  if (err != null) {
    console.error(err);
    if (result != null) console.log(result);
  }
}

export function countNonZeroes(numbers: string[]): number {
  let count = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (Number(numbers[i]) !== 0) {
      count++;
    }
  }
  return count;
}

