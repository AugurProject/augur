import * as WebSocket from "ws";
import * as Knex from "knex";
import { EventEmitter } from "events";
import { augurEmitter } from "../events";
import { JsonRpcRequest, WebSocketConfigs } from "../types";
import { addressFormatReviver } from "./address-format-reviver";
import { isJsonRpcRequest } from "./is-json-rpc-request";
import { dispatchJsonRpcRequest } from "./dispatch-json-rpc-request";
import { makeJsonRpcResponse } from "./make-json-rpc-response";
import { makeJsonRpcError, JsonRpcErrorCode } from "./make-json-rpc-error";
import { Subscriptions } from "./subscriptions";
import * as fs from "fs";
import * as https from "https";

export function runWebsocketServer(db: Knex, webSocketConfigs: WebSocketConfigs): Array<WebSocket.Server> {

  const websocketServers: Array<WebSocket.Server> = [];

  if ( webSocketConfigs.wss != null ) {
    console.log("Starting websocket secure server on port", webSocketConfigs.wss.port);
    const server = https.createServer({
      cert: fs.readFileSync(webSocketConfigs.wss.certificateFile),
      key: fs.readFileSync(webSocketConfigs.wss.certificateKeyFile),
    });
    server.listen(webSocketConfigs.wss.port);
    websocketServers.push( new WebSocket.Server({  server }) );
  }
  if ( webSocketConfigs.ws != null ) {
    console.log("Starting websocket server on port", webSocketConfigs.ws.port);
    websocketServers.push( new WebSocket.Server({  port: webSocketConfigs.ws.port }) );
  }

  websocketServers.forEach((websocketServer) => {
    websocketServer.on("connection", (websocket: WebSocket): void => {
      const subscriptions = new Subscriptions(augurEmitter);

      websocket.on("message", (data: WebSocket.Data): void => {
        let message: any;
        try {
          message = JSON.parse(data as string, addressFormatReviver);
          if (!isJsonRpcRequest(message)) return console.error("bad json rpc message received:", message);
        } catch (exc) {
          return websocket.send(makeJsonRpcError("-1", JsonRpcErrorCode.ParseError, "Bad JSON RPC Message Received", { originalText: data as string }));
        }

        try {
          if (message.method === "subscribe") {
            const eventName: string = message.params.shift();

            try {
              const subscription: string = subscriptions.subscribe(eventName, message.params, (data: {}): void => {
                websocket.send(makeJsonRpcResponse(null, { subscription, result: data }));
              });
              websocket.send(makeJsonRpcResponse(message.id, { subscription }));
            } catch (exc) {
              websocket.send(makeJsonRpcError(message.id, JsonRpcErrorCode.MethodNotFound, exc.toString(), false));
            }
          } else if (message.method === "unsubscribe") {
            const subscription: string = message.params.shift();
            subscriptions.unsubscribe(subscription);
            websocket.send(makeJsonRpcResponse(message.id, true));
          } else {
            dispatchJsonRpcRequest(db, message as JsonRpcRequest, (err: Error|null, result?: any): void => {
              if (err) {
                console.error("getter error: ", err);
                websocket.send(makeJsonRpcError(message.id, JsonRpcErrorCode.InvalidParams, err.message, false));
              } else {
                websocket.send(makeJsonRpcResponse(message.id, result || null));
              }
            });
          }
        } catch (exc) {
          websocket.send(makeJsonRpcError(message.id, JsonRpcErrorCode.ServerError, exc.toString(), exc));
        }
      });

      websocket.on("close", () => {
        subscriptions.removeAllListeners();
      });
    });

    websocketServer.on("error", (err: Error): void => {
      console.log("websocket error:", err);
      // TODO reconnect
    });
  });
  return websocketServers;
}
