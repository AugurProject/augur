export function makeJsonRpcResponse(id: string, result: Object): string {
  return JSON.stringify({ id, result, jsonrpc: "2.0" });
}
