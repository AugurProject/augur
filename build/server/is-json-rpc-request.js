"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isJsonRpcRequest(message) {
    if (typeof message.jsonrpc !== "string")
        return false;
    if (message.jsonrpc !== "2.0")
        return false;
    if (typeof message.id !== "string" && typeof message.id !== "number" && message.id !== null)
        return false;
    if (typeof message.method !== "string")
        return false;
    if (typeof message.params !== "object")
        return false;
    return true;
}
exports.isJsonRpcRequest = isJsonRpcRequest;
//# sourceMappingURL=is-json-rpc-request.js.map