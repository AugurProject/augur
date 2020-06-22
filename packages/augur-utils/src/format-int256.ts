import { padLeft } from "./pad-left";
import { prefixHex } from "./hex";
import { strip0xPrefix } from "./strip-0x-prefix";
import { unfork } from "./unfork";

export function formatInt256(s) {
  if (s === undefined || s === null || s === "0x") return s;
  if (Array.isArray(s)) return s.map(formatInt256);
  if (Buffer.isBuffer(s)) s = s.toString("hex");
  if (s.constructor !== String) s = s.toString(16);
  if (s.slice(0, 1) === "-") s = unfork(s);
  s = strip0xPrefix(s);
  if (s.length > 64) s = s.slice(0, 64);
  return prefixHex(padLeft(s));
}


