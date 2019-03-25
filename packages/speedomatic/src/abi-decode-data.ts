let rawDecode = require("ethereumjs-abi").rawDecode;
let formatAbiRawDecodedDataArray = require("./format-abi-raw-decoded-data-array");
let strip0xPrefix = require("./strip-0x-prefix");

export function abiDecodeData(inputs, abiEncodedData) {
  let dataInputTypes = inputs.filter(function (input) {
    return !input.indexed;
  }).map(function (input) {
    return input.type;
  });
  let abiRawDecodedDataArray = rawDecode(dataInputTypes, Buffer.from(strip0xPrefix(abiEncodedData), "hex"));
  return formatAbiRawDecodedDataArray(dataInputTypes, abiRawDecodedDataArray);
}


