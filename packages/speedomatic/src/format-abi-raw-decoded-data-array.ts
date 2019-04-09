import { formatAbiRawDecodedData } from "./format-abi-raw-decoded-data";

export function formatAbiRawDecodedDataArray(dataInputTypes, decodedDataArray) {
  return decodedDataArray.map(function (decodedData, i) {
    return formatAbiRawDecodedData(dataInputTypes[i], decodedData);
  });
}


