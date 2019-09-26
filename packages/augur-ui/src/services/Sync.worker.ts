import {
  Events,
  IsJsonRpcRequest,
  JsonRpcErrorCode,
  JsonRpcRequest,
  MakeJsonRpcError,
  MakeJsonRpcResponse,
  Subscriptions,
  Sync,
} from '@augurproject/sdk';
import { API } from '@augurproject/sdk/src/state/getter/API';

const settings = require('@augurproject/sdk/src/state/settings');

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
      try {
        const eventName: string = messageData.params.shift();
        const buildResponse = (eventName:string) => (data): void => {
          ctx.postMessage(
            MakeJsonRpcResponse(null, {
              ...data,
              eventName,
            })
          );
        };
        const subscription: string = subscriptions.subscribe(
          eventName,
          buildResponse(eventName)
        );
        ctx.postMessage(
          MakeJsonRpcResponse(messageData.id, { subscribed: eventName, subscription })
        );
      } catch (err) {
        ctx.postMessage(
          MakeJsonRpcError(messageData.id, JsonRpcErrorCode.MethodNotFound, err.toString(), false)
        );
      }
    } else if (messageData.method === 'unsubscribe') {
      const subscription: string = messageData.params.shift();
      subscriptions.unsubscribe(subscription);
      ctx.postMessage(
        MakeJsonRpcResponse(messageData.id, true)
      );
    } else if (messageData.method === 'start') {
      try {
        const createResult = await Sync.createAPIAndController(messageData.params[0], messageData.params[1], true);
        // Do not call Sync.create here, sinc we must initialize api before calling controller.run.
        // This is to prevent a race condition where getMarkets is called before api is fully
        // initialized during bulk sync, due to SDKReady being emitted before UserDataSynced.
        if (!createResult.api) {
          throw new Error('Unable to create API');
        }
        api = createResult.api;
        await createResult.controller.run();

        ctx.postMessage(
          MakeJsonRpcResponse(messageData.id, true)
        );
      } catch (err) {
        ctx.postMessage(
          MakeJsonRpcError(messageData.id, JsonRpcErrorCode.InvalidParams, err.message, false)
        );
      }
    } else if (messageData.method === 'syncUserData') {
      const account = messageData.params[0];
      try {
        const db = await api.db;
        db.addTrackedUser(account, settings.chunkSize, settings.blockStreamDelay);
        ctx.postMessage(
          MakeJsonRpcResponse(messageData.id, { account })
        );
      } catch (err) {
        ctx.postMessage(
          MakeJsonRpcError(messageData.id, JsonRpcErrorCode.InvalidParams, err.message, { account })
        );
      }
    } else {
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
