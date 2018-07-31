export enum JsonRpcErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  ServerError = -32000,
}

export function makeJsonRpcError(id: string, code: JsonRpcErrorCode, message: string, data: object|boolean): string {
  return JSON.stringify({ id, jsonrpc: "2.0", error: { code, message, data } });
}
