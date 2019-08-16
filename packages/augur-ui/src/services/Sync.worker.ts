import {
  Events,
  IsJsonRpcRequest,
  JsonRpcErrorCode,
  JsonRpcRequest,
  MakeJsonRpcError,
  MakeJsonRpcResponse,
  Subscriptions,
  Sync
} from '@augurproject/sdk';
import { API } from '@augurproject/sdk/src/state/getter/API';

// this to be as typesafe as possible with self and addEventListener + postMessage
const ctx: Worker = self as any;
let api: API;
const subscriptions = new Subscriptions(Events.augurEmitter);

ctx.addEventListener('message', async (message: any) => {
  const messageData = message.data;

console.log("MessageData");
console.log(messageData);
  try {
    if (messageData.subscribe) {
console.log("In Sync.worker.addEventListener (subscribe)");

      try {
        const subscription: string = subscriptions.subscribe(
          messageData.subscribe,
          (data: {eventName: string}): void => {
            ctx.postMessage(
              MakeJsonRpcResponse(null, { eventName: data.eventName, result: data })
            );
          }
        );
        ctx.postMessage(
          MakeJsonRpcResponse(messageData.id, { subscribed: messageData.subscribe, subscription })
        );
      } catch (err) {
        ctx.postMessage(
          MakeJsonRpcError(messageData.id, JsonRpcErrorCode.MethodNotFound, err.toString(), false)
        );
      }
    } else if (messageData.unsubscribe) {
console.log("In Sync.worker.addEventListener (unsubscribe)");
console.log(messageData);
      subscriptions.unsubscribe(messageData.unsubscribe);
      ctx.postMessage(
        MakeJsonRpcResponse(messageData.id, true)
      );
    } else if (messageData.method === 'start') {
console.log("In Sync.worker.addEventListener (start)");
      api = await Sync.start(messageData.ethNodeUrl, messageData.account);
      ctx.postMessage(
        MakeJsonRpcResponse(messageData.id, null)
      );
    } else {
console.log("In Sync.worker.addEventListener (else)");
      try {
        const request = messageData as JsonRpcRequest;
        const result = await api.route(request.method, request.params);
        ctx.postMessage(
          MakeJsonRpcResponse(messageData.id, result || null)
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
