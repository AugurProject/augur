"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isJsonRpcResponse(message) {
    if (typeof message.jsonrpc !== "string")
        return false;
    if (message.jsonrpc !== "2.0")
        return false;
    if (typeof message.result === "undefined")
        return false;
    return true;
}
exports.isJsonRpcResponse = isJsonRpcResponse;
//# sourceMappingURL=is-json-rpc-response.js.map