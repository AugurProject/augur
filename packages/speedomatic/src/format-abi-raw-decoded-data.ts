let formatEthereumAddress = require("./format-ethereum-address");
let hex = require("./hex");
let prefixHex = require("./prefix-hex");
let formatInt256 = require("./format-int256");

export function formatAbiRawDecodedData(inputType, decodedData) {
  if (inputType === "null") return null;
  if (inputType.slice(-1) === "]") {
    return decodedData.map(function (decodedElement) {
      return formatAbiRawDecodedData(inputType.slice(0, -2), decodedElement);
    });
  }
  if (inputType.startsWith("address")) {
    return formatEthereumAddress(decodedData.toString("hex"));
  } else if (inputType === "bytes") {
    return prefixHex(decodedData.toString("hex"));
  } else if (inputType.startsWith("bytes")) {
    return formatInt256(hex(decodedData));
  } else if (inputType.startsWith("bool")) {
    return decodedData;
  }
  return decodedData.toString();
}


