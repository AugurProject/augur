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
      console.log("have a message in the ws connector");
      console.log(message);
      console.log("done");
    });

    return this.socket.open();

  }

  public async disconnect(): Promise<any> {
    return this.socket.close();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.socket.sendRequest({ method: f.name, params, jsonrpc: "2.0" });
    };
  }

  public on(eventName: SubscriptionEventNames, callback: Callback): void {
    console.log("sending subscribe request");
    this.socket.sendRequest({ method: "subscribe", event, jsonrpc: "2.0", params: [eventName] }).then((response: any) => {
      console.log("subscrivbed");
      console.log(response);
      this.subscriptions[eventName] = { id: response.subscription, callback };
    });
  }

  public off(eventName: SubscriptionEventNames): void {
    const subscription = this.subscriptions[eventName];
    this.socket.sendRequest({ method: "unsubscribe", subscription, jsonrpc: "2.0", params: [subscription] }).then(() => {
      delete this.subscriptions[eventName];
    });
  }
}
