import * as ethereumjsAbi from "ethereumjs-abi";

// ABI-encode the 'data' field in a transaction payload
export function abiEncodeData(payload, format = "") {
  let abiEncodedData = ethereumjsAbi.rawEncode(payload.signature || [], payload.params);
  if (format === "hex") return "0x" + abiEncodedData.toString("hex");
  return abiEncodedData;
}


