import * as express from "express";
import * as WebSocket from "ws";
import * as Knex from "knex";
import Augur from "augur.js";
import { clearInterval, setInterval } from "timers";
import { augurEmitter } from "../events";
import { JsonRpcRequest, WebSocketConfigs, ServersData } from "../types";
import { addressFormatReviver } from "./address-format-reviver";
import { isJsonRpcRequest } from "./is-json-rpc-request";
import { dispatchJsonRpcRequest } from "./dispatch-json-rpc-request";
import { makeJsonRpcResponse } from "./make-json-rpc-response";
import { makeJsonRpcError, JsonRpcErrorCode } from "./make-json-rpc-error";
import { Subscriptions } from "./subscriptions";
import * as fs from "fs";
import * as https from "https";
import * as http from "http";
import * as path from "path";
import { EventEmitter } from "events";
import { ControlMessageType } from "../constants";
import { logger } from "../utils/logger";

function isSafe(websocket: WebSocket) {
  if (websocket.readyState !== WebSocket.OPEN) {
    logger.warn("Client disconnected during request, ignoring response");
    return false;
  }
  return true;
}

function safeSend(websocket: WebSocket, payload: string) {
  if (isSafe(websocket)) websocket.send(payload);
}

function safePing(websocket: WebSocket) {
  if (isSafe(websocket)) websocket.ping();
}

export function runWebsocketServer(db: Knex, app: express.Application, augur: Augur, webSocketConfigs: WebSocketConfigs, controlEmitter: EventEmitter = new EventEmitter()): ServersData {
  const servers: Array<WebSocket.Server> = [];
  const httpServers: Array<http.Server | https.Server> = [];

  if ( webSocketConfigs.wss != null ) {
    logger.info("Starting websocket secure server on port", webSocketConfigs.wss.port);
    const httpsOptions: https.ServerOptions = {
      cert: fs.readFileSync(path.join(__dirname, "..", "..", webSocketConfigs.wss.certificateFile)),
      key: fs.readFileSync(path.join(__dirname, "..", "..", webSocketConfigs.wss.certificateKeyFile)),
    };
    const server = https.createServer(httpsOptions, app);
    httpServers.push(server);
    server.listen(webSocketConfigs.wss.port);
    servers.push( new WebSocket.Server({ server }) );
  }

  if ( webSocketConfigs.ws != null ) {
    logger.info("Starting websocket server on port", webSocketConfigs.ws.port);
    const server = http.createServer(app);
    httpServers.push(server);
    server.listen(webSocketConfigs.ws.port);
    servers.push( new WebSocket.Server({ server }) );
  }
  controlEmitter.emit("serverStart");

  servers.forEach((server) => {
    server.on("connection", (websocket: WebSocket): void => {
      const subscriptions = new Subscriptions(augurEmitter);
      const pingInterval = setInterval(() => safePing(websocket), webSocketConfigs.pingMs || 12000);

      websocket.on("message", (data: WebSocket.Data): void => {
        let message: any;
        try {
          message = JSON.parse(data as string, addressFormatReviver);
          if (!isJsonRpcRequest(message)) return logger.error("bad json rpc message received:", message);
        } catch (exc) {
          return safeSend(websocket, makeJsonRpcError("-1", JsonRpcErrorCode.ParseError, "Bad JSON RPC Message Received", { originalText: data as string }));
        }

        try {
          if (message.method === "subscribe") {
            const eventName: string = message.params.shift();

            try {
              const subscription: string = subscriptions.subscribe(eventName, message.params, (data: {}): void => {
                safeSend(websocket, makeJsonRpcResponse(null, { subscription, result: data }));
              });
              safeSend(websocket, makeJsonRpcResponse(message.id, { subscription }));
            } catch (exc) {
              safeSend(websocket, makeJsonRpcError(message.id, JsonRpcErrorCode.MethodNotFound, exc.toString(), false));
            }
          } else if (message.method === "unsubscribe") {
            const subscription: string = message.params.shift();
            subscriptions.unsubscribe(subscription);
            safeSend(websocket, makeJsonRpcResponse(message.id, true));
          } else {
            dispatchJsonRpcRequest(db, message as JsonRpcRequest, augur, (err: Error|null, result?: any): void => {
              if (err) {
                logger.error("getter error: ", err);
                safeSend(websocket, makeJsonRpcError(message.id, JsonRpcErrorCode.InvalidParams, err.message, false));
              } else {
                safeSend(websocket, makeJsonRpcResponse(message.id, result || null));
              }
            });
          }
        } catch (exc) {
          safeSend(websocket, makeJsonRpcError(message.id, JsonRpcErrorCode.ServerError, exc.toString(), exc));
        }
      });

      websocket.on("close", () => {
        clearInterval(pingInterval);
        subscriptions.removeAllListeners();
        controlEmitter.emit(ControlMessageType.WebsocketClose);
      });

      websocket.on("error", (err) => {
        logger.error(err);
        controlEmitter.emit(ControlMessageType.WebsocketError, err);
      });
    });

    server.on("error", (err: Error): void => {
      logger.error("websocket error:", err);
      controlEmitter.emit(ControlMessageType.ServerError, err);
      // TODO reconnect
    });
  });

  return { servers, httpServers, controlEmitter };
}
