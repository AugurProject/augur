"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function makeJsonRpcResponse(id, result) {
    return JSON.stringify({ id, result, jsonrpc: "2.0" });
}
exports.makeJsonRpcResponse = makeJsonRpcResponse;
//# sourceMappingURL=make-json-rpc-response.js.map