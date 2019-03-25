let rawEncode = require("ethereumjs-abi").rawEncode;
let removeTrailingZeros = require("./remove-trailing-zeros");

// convert bytes to ABI format
export function abiEncodeBytes(bytesToEncode, isPadded) {
  let abiEncodedBytes = rawEncode(["bytes"], [bytesToEncode]).toString("hex");
  if (isPadded) return abiEncodedBytes;
  return removeTrailingZeros(abiEncodedBytes).slice(128);
}


