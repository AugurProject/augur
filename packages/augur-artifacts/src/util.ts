export function bool(s: string): boolean {
  if (s.toLowerCase() === 'true') {
    return true;
  } else if (s.toLowerCase() === 'false') {
    return false;
  } else {
    // TODO should this instead throw an error?
    return undefined;
  }
}

export function deepCopy<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends Array<infer U> ? Array<RecursivePartial<U>> :
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};
