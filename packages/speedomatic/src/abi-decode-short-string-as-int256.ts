import { removeTrailingZeros } from "./remove-trailing-zeros";
import { strip0xPrefix } from "./strip-0x-prefix";

export function abiDecodeShortStringAsInt256(int256) {
  return Buffer.from(strip0xPrefix(removeTrailingZeros(int256)), "hex").toString("utf8");
}


