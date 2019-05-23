import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import WebSocket from "ws";

import { API } from "./api/API";
import { AddressFormatReviver } from "./AddressFormatReviver";
import { JsonRpcRequest, EndpointSettings } from "./api/types";
import { IsJsonRpcRequest } from "./IsJsonRpcRequest";
import { MakeJsonRpcError, JsonRpcErrorCode } from "./MakeJsonRpcError";
import { MakeJsonRpcResponse } from "./MakeJsonRpcResponse";

function isSafe(websocket: WebSocket) {
  if (websocket.readyState !== WebSocket.OPEN) {
    console.warn("Client disconnected during request, ignoring response");
    websocket.terminate();
    return false;
  }
  return true;
}

function safeSend(websocket: WebSocket, payload: string) {
  if (isSafe(websocket))
    websocket.send(payload, (_) => {
      websocket.terminate();
    });
}

function safePing(websocket: WebSocket) {
  if (isSafe(websocket))
    websocket.ping();
}

export async function run(api: API, endpointSettings: EndpointSettings): Promise<void> {
  const servers: Array<WebSocket.Server> = [];
  const app = express();

  if (endpointSettings.startWSS) {
    const server = https.createServer({
      cert: fs.readFileSync(endpointSettings.certificateFile as string),
      key: fs.readFileSync(endpointSettings.certificateKeyFile as string),
    }, app).listen(endpointSettings.wssPort, () => {
      console.log("WSS listening on " + endpointSettings.wssPort);
    });

    servers.push(new WebSocket.Server({ server }));
  }

  const server = http.createServer(app).listen(endpointSettings.wsPort, () => {
    console.log("WS listening on " + endpointSettings.wsPort);
  });

  servers.push(new WebSocket.Server({ server }));

  servers.forEach((server) => {
    server.on("connection", (websocket: WebSocket): void => {
      const pingInterval = setInterval(() => safePing(websocket), 12000);

      websocket.on("message", (data: WebSocket.Data): void => {
        let message: any;
        try {
          message = JSON.parse(data as string, AddressFormatReviver);
          if (!IsJsonRpcRequest(message))
            return console.error("bad json rpc message received:", message);
        } catch (exc) {
          return safeSend(websocket, MakeJsonRpcError("-1", JsonRpcErrorCode.ParseError, "Bad JSON RPC Message Received", { originalText: data as string }));
        }

        try {
          if (message.method === "subscribe") {
            // XXX: TODO - sort out what to do with async websocket messaging
            // const eventName: string = message.params.shift();

            // try {
            //   const subscription: string = subscriptions.subscribe(eventName, message.params, (data: {}): void => {
            //     safeSend(websocket, MakeJsonRpcResponse(null, { subscription, result: data }));
            //   });
            //   safeSend(websocket, MakeJsonRpcResponse(message.id, { subscription }));
            // } catch (exc) {
            //   safeSend(websocket, MakeJsonRpcError(message.id, JsonRpcErrorCode.MethodNotFound, exc.toString(), false));
            // }
          } else if (message.method === "unsubscribe") {
            // XXX: TODO - sort out what to do with async websocket messaging
            // const subscription: string = message.params.shift();
            // subscriptions.unsubscribe(subscription);
            // safeSend(websocket, MakeJsonRpcResponse(message.id, true));
          } else {
            const request = message as JsonRpcRequest;
            api.route(request.method, request.params).then((result: any) => {
              safeSend(websocket, MakeJsonRpcResponse(message.id, result || null));
            }).catch((err) => {
              safeSend(websocket, MakeJsonRpcError(message.id, JsonRpcErrorCode.InvalidParams, err.message, false));
            });
          }
        } catch (err) {
          safeSend(websocket, MakeJsonRpcError(message.id, JsonRpcErrorCode.ServerError, err.toString(), err));
        }
      });

      websocket.on("close", () => {
        clearInterval(pingInterval);
        // subscriptions.removeAllListeners();
      });

      websocket.on("error", (err) => {
        console.error(err);
      });
    });

    server.on("error", (err: Error): void => {
      console.error("websocket error:", err);
    });
  });
}
