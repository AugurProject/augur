import express from 'express';
import http from 'http';
import https from 'https';
import WebSocket from 'ws';

import { augurEmitter } from '../events';
import { API } from './getter/API';
import { AddressFormatReviver } from './AddressFormatReviver';
import { IsJsonRpcRequest } from './IsJsonRpcRequest';
import { JsonRpcRequest } from './getter/types';
import { MakeJsonRpcError, JsonRpcErrorCode } from './MakeJsonRpcError';
import { MakeJsonRpcResponse } from './MakeJsonRpcResponse';
import { Subscriptions } from '../subscriptions';
import { SubscriptionEventName } from '../constants';
import { SDKConfiguration } from '@augurproject/artifacts';

export function runWsServer(api: API, app: express.Application, config: SDKConfiguration): WebSocket.Server {
  const { wsPort: port } = config.server;
  const server = http.createServer(app).listen(port, () => {
    console.log(`WS listening on ${port}`);
  });
  const wsServer = new WebSocket.Server({ server });
  setupServer(wsServer, api);
  return wsServer;
}

export function runWssServer(api: API, app: express.Application, config: SDKConfiguration): WebSocket.Server {
  const { wssPort: port } = config.server;
  const server = https.createServer(app).listen(port, () => {
    console.log(`WS listening on ${port}`);
  });

  const wssServer = new WebSocket.Server({ server });
  setupServer(wssServer, api);
  return wssServer
}

function setupServer(server: WebSocket.Server, api: API) {
  server.on('connection', (websocket: WebSocket): void => {
    const subscriptions = new Subscriptions(augurEmitter);
    const pingInterval = setInterval(() => safePing(websocket), 12000);

    websocket.on('message', (data: WebSocket.Data): void => {
      let message;

      try {
        message = JSON.parse(data as string, AddressFormatReviver);
        if (!IsJsonRpcRequest(message)) {
          return console.error('bad json rpc message received:', message);
        }
      } catch (exc) {
        return safeSend(websocket, MakeJsonRpcError('-1', JsonRpcErrorCode.ParseError, 'Bad JSON RPC Message Received', { originalText: data as string }));
      }

      try {
        if (message.method === 'subscribe') {
          const eventName: string = message.params.shift();

          try {
            const subscription: string = subscriptions.subscribe(eventName, (data: {}): void => {
              safeSend(websocket, MakeJsonRpcResponse(null, { subscription, result: data }));
            });
            safeSend(websocket, MakeJsonRpcResponse(message.id, { subscription }));
          } catch (exc) {
            safeSend(websocket, MakeJsonRpcError(message.id, JsonRpcErrorCode.MethodNotFound, exc.toString(), false));
          }

          if (eventName === SubscriptionEventName.SDKReady && api.augur.sdkReady) {
            console.log('immediately sending SDKReady event to new connection');
            safeSend(websocket, JSON.stringify({
              eventName: SubscriptionEventName.SDKReady,
              result: [ 'ignoreme' ],
            }));
          }

        } else if (message.method === 'unsubscribe') {
          const subscription: string = message.params.shift();
          subscriptions.unsubscribe(subscription);
          safeSend(websocket, MakeJsonRpcResponse(message.id, true));
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

    websocket.on('close', () => {
      clearInterval(pingInterval);
      subscriptions.removeAllListeners();
    });

    websocket.on('error', (err) => {
      console.error(err);
    });
  });

  server.on('error', (err: Error): void => {
    console.error('websocket error:', err);
  });
}

function isSafe(websocket: WebSocket) {
  if (websocket.readyState !== WebSocket.OPEN) {
    console.warn('Client disconnected during request, ignoring response');
    websocket.terminate();
    return false;
  }
  return true;
}

function safeSend(websocket: WebSocket, payload: string) {
  if (isSafe(websocket)) {
    websocket.send(payload);
  }
}

function safePing(websocket: WebSocket) {
  if (isSafe(websocket)) {
    websocket.ping();
  }
}
