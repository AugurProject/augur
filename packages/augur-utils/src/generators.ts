export function* chunkRange(start, end, chunk) {
   for (;start <= end;start+=chunk) {
      yield [start, Math.min(end, start+chunk-1)];
   }
}
