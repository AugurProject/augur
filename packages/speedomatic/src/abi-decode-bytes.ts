let byteArrayToUtf8String = require("./byte-array-to-utf8-string");
let removeTrailingZeros = require("./remove-trailing-zeros");

export function abiDecodeBytes(abiEncodedBytes, strip:boolean) {
  let hex = abiEncodedBytes.toString();
  if (hex.slice(0, 2) === "0x") hex = hex.slice(2);
  // first 32 bytes = offset
  // second 32 bytes = string length
  if (strip) {
    hex = hex.slice(128);
    hex = removeTrailingZeros(hex);
  }
  return byteArrayToUtf8String(hex);
}
