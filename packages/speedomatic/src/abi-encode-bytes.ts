let rawEncode = require("ethereumjs-abi").rawEncode;
import { removeTrailingZeros } from "./remove-trailing-zeros";

// convert bytes to ABI format
export function abiEncodeBytes(bytesToEncode, isPadded = false) {
  let abiEncodedBytes = rawEncode(["bytes"], [bytesToEncode]).toString("hex");
  if (isPadded) return abiEncodedBytes;
  return removeTrailingZeros(abiEncodedBytes).slice(128);
}


