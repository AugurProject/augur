export function isJsonRpcResponse(message: any): boolean {
  if (typeof message.jsonrpc !== "string") return false;
  if (message.jsonrpc !== "2.0") return false;
  if (typeof message.result === "undefined") return false;
  return true;
}
