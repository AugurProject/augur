import { chunk } from "./chunk";
import { prefixHex } from "./hex";
import { strip0xPrefix } from "./strip-0x-prefix";

export function padLeft(s, chunkLength = 64, hasPrefix = false) {
  s = strip0xPrefix(s);
  let multiple = chunkLength * (chunk(s.length, chunkLength) || 1);
  while (s.length < multiple) {
    s = "0" + s;
  }
  if (hasPrefix) s = prefixHex(s);
  return s;
}


