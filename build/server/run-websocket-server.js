"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const is_json_rpc_request_1 = require("./is-json-rpc-request");
const dispatch_json_rpc_request_1 = require("./dispatch-json-rpc-request");
const make_json_rpc_response_1 = require("./make-json-rpc-response");
function runWebsocketServer(db, port) {
    const websocketServer = new WebSocket.Server({ port });
    websocketServer.on("connection", (websocket) => {
        websocket.on("message", (data) => {
            try {
                const message = JSON.parse(data);
                if (is_json_rpc_request_1.isJsonRpcRequest(message)) {
                    dispatch_json_rpc_request_1.dispatchJsonRpcRequest(db, message, (err, result) => {
                        if (err)
                            return console.error("dispatch error:", err);
                        websocket.send(make_json_rpc_response_1.makeJsonRpcResponse(message.id, result || null));
                    });
                }
                else {
                    console.error("bad json rpc message received:", message);
                }
            }
            catch (exc) {
                console.error("bad json rpc message received:", exc, data);
            }
        });
    });
    websocketServer.on("error", (err) => {
        console.log("websocket error:", err);
        // TODO reconnect
    });
}
exports.runWebsocketServer = runWebsocketServer;
//# sourceMappingURL=run-websocket-server.js.map