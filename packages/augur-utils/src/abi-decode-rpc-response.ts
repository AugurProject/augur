import { abiDecodeData } from "./abi-decode-data";

export function abiDecodeRpcResponse(responseType, abiEncodedRpcResponse) {
  let decodedRpcResponse = abiDecodeData([{type: responseType}], abiEncodedRpcResponse)[0];
  return decodedRpcResponse;
}


