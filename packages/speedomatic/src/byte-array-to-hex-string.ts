import { strip0xPrefix } from "./strip-0x-prefix";

export function byteArrayToHexString(b) {
  let hexbyte, h = "";
  for (let i = 0, n = b.length; i < n; ++i) {
    hexbyte = strip0xPrefix(b[i].toString(16));
    if (hexbyte.length === 1) hexbyte = "0" + hexbyte;
    h += hexbyte;
  }
  return h;
}
