export function makeJsonRpcResponse(id: string, result: object): string {
  return JSON.stringify({ id, result, jsonrpc: "2.0" });
}
