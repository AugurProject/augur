import * as WebSocket from "ws";
import { Database } from "sqlite3";
import { JsonRpcRequest } from "./types";
import { isJsonRpcRequest } from "./is-json-rpc-request";
import { dispatchJsonRpcRequest } from "./dispatch-json-rpc-request";
import { makeJsonRpcResponse } from "./make-json-rpc-response";

export function runWebsocketServer(db: Database, port: number) {
  const websocketServer: WebSocket.Server = new WebSocket.Server({ port });
  websocketServer.on("connection", (websocket: WebSocket) => {
    console.log("websocket connected");
    websocket.on("message", (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(<string>data);
        console.log("received message:", message);
        if (isJsonRpcRequest(message)) {
          dispatchJsonRpcRequest(db, <JsonRpcRequest>message, (err?: Error|null, result?: any) => {
            if (err) return console.error("dispatch error:", err);
            websocket.send(makeJsonRpcResponse(message.id, result));
          });
        } else {
          console.error("bad json rpc message received:", message);
        }
       } catch (exc) {
         console.error("bad json rpc message received:", exc, data);
       }
    });
  });
  websocketServer.on("error", (err: Error) => {
    console.log("websocket error:", err);
    // TODO close/reconnect
  });
}
