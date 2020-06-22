import { chunk } from "./chunk";
import { strip0xPrefix } from "./strip-0x-prefix";
import { prefixHex } from "./hex";

export function padRight(s, chunkLength = 64, hasPrefix = false) {
  s = strip0xPrefix(s);
  let multiple = chunkLength * (chunk(s.length, chunkLength) || 1);
  while (s.length < multiple) {
    s += "0";
  }
  if (hasPrefix) s = prefixHex(s);
  return s;
}


