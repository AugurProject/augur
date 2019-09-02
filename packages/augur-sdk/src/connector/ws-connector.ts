import { Callback, SubscriptionType } from '../events';
import { BaseConnector } from './baseConnector';
import { SubscriptionEventName } from '../constants';
import WebSocket from 'isomorphic-ws';
import WebSocketAsPromised from 'websocket-as-promised';

export class WebsocketConnector extends BaseConnector {
  private socket: WebSocketAsPromised;

  constructor(readonly endpoint: string) {
    super();
  }

  async connect(ethNodeUrl: string, account?: string): Promise<any> {
    this.socket = new WebSocketAsPromised(this.endpoint, {
      packMessage: (data: any) => JSON.stringify(data),
      unpackMessage: (message: string) => JSON.parse(message),
      attachRequestId: (data: any, requestId: number) =>
        Object.assign({ id: requestId }, data),
      extractRequestId: (data: any) => data && data.id,
      createWebSocket: (url: string) => new WebSocket(url),
    } as any);

    this.socket.onMessage.addListener((message: string) => {
      try {
        const response = JSON.parse(message);
        this.messageReceived(response.result);
      } catch (error) {
        console.error('Bad JSON RPC response: ' + message);
      }
    });

    this.socket.onClose.addListener((message: string) => {
      console.log('Websocket closed');
      console.log(message);
    });

    return this.socket.open();
  }

  async syncUserData(account: string): Promise<any> {
    return this.socket.sendRequest({
      method: 'syncUserData',
      params: [account],
      jsonrpc: '2.0',
    });
  }

  messageReceived(message: any) {
    if (message.result) {
      if (this.subscriptions[message.eventName]) {
        this.subscriptions[message.eventName].callback(message.result);
      }
    }
  }

  async disconnect(): Promise<any> {
    return this.socket.close();
  }

  bindTo<R, P>(
    f: (db: any, augur: any, params: P) => Promise<R>
  ): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.socket.sendRequest({
        method: f.name,
        params,
        jsonrpc: '2.0',
      });
    };
  }

  async on<T extends SubscriptionType>(
    eventName: SubscriptionEventName | string,
    callback: Callback
  ): Promise<void> {
    const response: any = await this.socket.sendRequest({
      method: 'subscribe',
      eventName,
      jsonrpc: '2.0',
      params: [eventName],
    });
    this.subscriptions[eventName] = {
      id: response.result.subscription,
      callback: super.callbackWrapper(callback),
    };
  }

  async off(eventName: SubscriptionEventName | string): Promise<void> {
    const subscription = this.subscriptions[eventName];
    if (subscription) {
      await this.socket.sendRequest({
        method: 'unsubscribe',
        subscription: subscription.id,
        jsonrpc: '2.0',
        params: [subscription.id],
      });
      delete this.subscriptions[eventName];
    }
  }
}
