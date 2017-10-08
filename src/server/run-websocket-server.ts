import * as WebSocket from "ws";
import * as Knex from "knex";
import { JsonRpcRequest } from "../types";
import { isJsonRpcRequest } from "./is-json-rpc-request";
import { dispatchJsonRpcRequest } from "./dispatch-json-rpc-request";
import { makeJsonRpcResponse } from "./make-json-rpc-response";

export function runWebsocketServer(db: Knex, port: number): void {
  const websocketServer: WebSocket.Server = new WebSocket.Server({ port });
  websocketServer.on("connection", (websocket: WebSocket) => {
    websocket.on("message", (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(<string>data);
        if (isJsonRpcRequest(message)) {
          dispatchJsonRpcRequest(db, <JsonRpcRequest>message, (err?: Error|null, result?: any) => {
            if (err) return console.error("dispatch error:", err);
            websocket.send(makeJsonRpcResponse(message.id, result || null));
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
    // TODO reconnect
  });
}
