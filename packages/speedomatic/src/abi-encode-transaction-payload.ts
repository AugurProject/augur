import { ethereumjsAbi } from "ethereumjs-abi";
import { abiEncodeData } from "./abi-encode-data";
import { prefixHex } from "./prefix-hex";

// ABI-encode the 'data' field in a transaction payload, with method ID prefix
export function abiEncodeTransactionPayload(payload) {
  payload.signature = payload.signature || [];
  return prefixHex(Buffer.concat([ethereumjsAbi.methodID(payload.name, payload.signature), abiEncodeData(payload)]).toString("hex"));
}


