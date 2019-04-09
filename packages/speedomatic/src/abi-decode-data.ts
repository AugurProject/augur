let rawDecode = require("ethereumjs-abi").rawDecode;
import { formatAbiRawDecodedDataArray } from "./format-abi-raw-decoded-data-array";
import { strip0xPrefix } from "./strip-0x-prefix";

export function abiDecodeData(inputs, abiEncodedData) {
  let dataInputTypes = inputs.filter(function (input) {
    return !input.indexed;
  }).map(function (input) {
    return input.type;
  });
  let abiRawDecodedDataArray = rawDecode(dataInputTypes, Buffer.from(strip0xPrefix(abiEncodedData), "hex"));
  return formatAbiRawDecodedDataArray(dataInputTypes, abiRawDecodedDataArray);
}


