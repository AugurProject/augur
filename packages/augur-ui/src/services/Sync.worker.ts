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

  try {
    if (!IsJsonRpcRequest(messageData)) {
      return console.error('Bad JSON RPC message received:', messageData);
    }
  } catch (err) {
    ctx.postMessage(
      MakeJsonRpcError('-1', JsonRpcErrorCode.ParseError, 'Bad JSON RPC message received', { originalText: messageData as string })
    );
  }

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
