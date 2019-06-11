import { Connector, Callback } from "./connector";
import { SubscriptionEventNames } from "../constants";
import WebSocket from "isomorphic-ws";
import WebSocketAsPromised from "websocket-as-promised";

export class WebsocketConnector extends Connector {
  private socket: WebSocketAsPromised;

  constructor(public readonly endpoint: string) {
    super();
  }

  public async connect(params?: any): Promise<any> {
    this.socket = new WebSocketAsPromised(this.endpoint, {
      packMessage: (data: any) => JSON.stringify(data),
      unpackMessage: (message: string) => JSON.parse(message),
      attachRequestId: (data: any, requestId: number) => Object.assign({ id: requestId }, data),
      extractRequestId: (data: any) => data && data.id,
      createWebSocket: (url: string) => new WebSocket(url),
    } as any);

    this.socket.onMessage.addListener((message: string) => {
      try {
        const response = JSON.parse(message);

        this.messageReceived(response.result);
      } catch (error) {
        console.error("Bad JSON RPC response: " + message);
      }
    });

    this.socket.onClose.addListener((message: string) => {
      console.log("Websocket closed");
      console.log(message);
    });

    return this.socket.open();
  }

  public messageReceived(message: any) {
    if (message.result) {
      if (this.subscriptions[message.eventName]) {
        this.subscriptions[message.eventName].callback(...(message.result));
      }
    }
  }

  public async disconnect(): Promise<any> {
    return this.socket.close();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.socket.sendRequest({ method: f.name, params, jsonrpc: "2.0" });
    };
  }

  public on(eventName: SubscriptionEventNames | string, callback: Callback): void {
    this.socket.sendRequest({ method: "subscribe", eventName, jsonrpc: "2.0", params: [eventName] }).then((response: any) => {
      this.subscriptions[eventName] = { id: response.result.subscription, callback };
    });
  }

  public off(eventName: SubscriptionEventNames | string): void {
    const subscription = this.subscriptions[eventName];
    if (subscription) {
      this.socket.sendRequest({ method: "unsubscribe", subscription: subscription.id, jsonrpc: "2.0", params: [subscription.id] }).then(() => {
        delete this.subscriptions[eventName];
      });
    }
  }
}
