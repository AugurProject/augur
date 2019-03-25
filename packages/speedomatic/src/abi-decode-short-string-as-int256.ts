let removeTrailingZeros = require("./remove-trailing-zeros");
let strip0xPrefix = require("./strip-0x-prefix");

export function abiDecodeShortStringAsInt256(int256) {
  return Buffer.from(strip0xPrefix(removeTrailingZeros(int256)), "hex").toString("utf8");
}


