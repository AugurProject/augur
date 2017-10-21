export function makeJsonRpcResponse(id: string, result: object|boolean): string {
  return JSON.stringify({ id, result, jsonrpc: "2.0" });
}
