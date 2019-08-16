import { Events, Subscriptions, Sync } from '@augurproject/sdk';
import { API } from '@augurproject/sdk/src/state/getter/API';
// import { AddressFormatReviver } from '@augurproject/sdk/src/state/AddressFormatReviver';
// import { IsJsonRpcRequest } from '@augurproject/sdk/src/state/IsJsonRpcRequest';
// import { JsonRpcRequest } from '@augurproject/sdk/src/state/getter/types';
import { MakeJsonRpcResponse } from '@augurproject/sdk/src/state/MakeJsonRpcResponse';
// import { JsonRpcErrorCode, MakeJsonRpcError } from '@augurproject/sdk/src/state/MakeJsonRpcError';

// this to be as typesafe as possible with self and addEventListener + postMessage
const ctx: Worker = self as any;
let api: API;
const subscriptions = new Subscriptions(Events.augurEmitter);

// @TODO Create equivalent to `safeSend` in WebSocketEndpoint.ts
/*
function MakeJsonRpcResponse(id: string | null, result: object | boolean): string {
  return JSON.stringify({ id, result, jsonrpc: '2.0' });
}
export enum JsonRpcErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  ServerError = -32000,
}
export function MakeJsonRpcError(id: string, code: JsonRpcErrorCode, message: string, data: object | boolean): string {
  return JSON.stringify({ id, jsonrpc: '2.0', error: { code, message, data } });
}
*/
ctx.addEventListener('message', async (message: any) => {
  const messageData = message.data;

  // try {
  //   messageData = JSON.parse(message.data as string, AddressFormatReviver);
  //   if (!IsJsonRpcRequest(message)) {
  //     return console.error('Bad JSON RPC message received:', message);
  //   }
  // } catch (err) {
  //   ctx.postMessage(
  //     MakeJsonRpcError('-1', JsonRpcErrorCode.ParseError, 'Bad JSON RPC message received', { originalText: message.data as string })
  //   );
  // }

  try {
    if (messageData.method === 'subscribe') {
console.log("In Sync.worker.addEventListener (subscribe)");
console.log(messageData);
      const eventName: string = messageData.params.shift();
      try {
        const subscription: string = subscriptions.subscribe(
          eventName,
          (data: {eventName: string}): void => {
            ctx.postMessage(
              MakeJsonRpcResponse(null, { eventName: data.eventName, subscription, result: data })
            );
          }
        );
console.log(subscription);
        ctx.postMessage(
          MakeJsonRpcResponse(messageData.id, { subscribed: messageData.subscribe, subscription })
        );
      } catch (err) {
        ctx.postMessage(
          MakeJsonRpcError(messageData.id, JsonRpcErrorCode.MethodNotFound, err.toString(), false)
        );
      }
    } else if (messageData.method === 'unsubscribe') {
console.log("In Sync.worker.addEventListener (unsubscribe)");
console.log(messageData);
      const subscription: string = messageData.params.shift();
      subscriptions.unsubscribe(subscription);
      ctx.postMessage(
        MakeJsonRpcResponse(messageData.id, true)
      );
    } else if (messageData.method === 'start') {
console.log("In Sync.worker.addEventListener (start)");
console.log(messageData);
      api = await Sync.start(messageData.ethNodeUrl, messageData.account);
      ctx.postMessage(
        MakeJsonRpcResponse(messageData.id, null)
      );
    } else {
console.log("In Sync.worker.addEventListener (else)");
console.log(messageData);
      try {
        const result = await api.route(messageData.method, messageData.params);
        ctx.postMessage(
          MakeJsonRpcResponse(messageData.id, result | null)
        );
      } catch (err) {
        ctx.postMessage(
          MakeJsonRpcError(messageData.id, JsonRpcErrorCode.InvalidParams, err.message, false)
        );
      }
    }
  } catch (err) {
    ctx.postMessage(
      MakeJsonRpcError(messageData.id, JsonRpcErrorCode.ServerError, err.toString(), err)
    );
  }
});

// to stop typescript from complaining
export default null as any;
