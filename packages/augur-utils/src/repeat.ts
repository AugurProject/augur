export function repeat<T>(thing: T, times: number): T[] {
  const things: T[] = [];
  for (let i = 0; i < times; i++) {
    things.push(thing);
  }
  return things;
}
