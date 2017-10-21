import * as WebSocket from "ws";
import * as Knex from "knex";
import { JsonRpcRequest } from "../types";
import { isJsonRpcRequest } from "./is-json-rpc-request";
import { dispatchJsonRpcRequest } from "./dispatch-json-rpc-request";
import { makeJsonRpcResponse } from "./make-json-rpc-response";

export function runWebsocketServer(db: Knex, port: number): void {
  console.log("Starting websocket server on port", port);
  const websocketServer: WebSocket.Server = new WebSocket.Server({ port });
  websocketServer.on("connection", (websocket: WebSocket): void => {
    websocket.on("message", (data: WebSocket.Data): void => {
      try {
        const message = JSON.parse(data as string);
        if (isJsonRpcRequest(message)) {
          dispatchJsonRpcRequest(db, message as JsonRpcRequest, (err?: Error|null, result?: any): void => {
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
  websocketServer.on("error", (err: Error): void => {
    console.log("websocket error:", err);
    // TODO reconnect
  });
}
