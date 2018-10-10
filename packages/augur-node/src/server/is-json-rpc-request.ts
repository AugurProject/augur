export function isJsonRpcRequest(message: any): boolean {
  if (message.jsonrpc !== "2.0") return false;
  if (typeof message.id !== "string" && typeof message.id !== "number" && message.id !== null) return false;
  if (typeof message.method !== "string") return false;
  return typeof message.params === "object";
}
