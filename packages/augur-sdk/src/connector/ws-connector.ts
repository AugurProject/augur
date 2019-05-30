import { Connector, Callback } from "./connector";
import { SubscriptionEventNames } from "../constants";
import WebSocket from "isomorphic-ws";
import WebSocketAsPromised from "websocket-as-promised";

export class WebsocketConnector extends Connector {
  private socket: WebSocketAsPromised;
  private callback: Callback;

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

  public async subscribe(event: SubscriptionEventNames, callback: Callback): Promise<any> {
    this.callback = callback;

    const response = await this.socket.sendRequest({ method: "subscribe", event, jsonrpc: "2.0" });
    callback({ subscribed: event, subscription: response.subscription });
    return response.subscription;
  }

  public async unsubscribe(subscription: string): Promise<any> {
    return this.socket.sendRequest({ method: "unsubscribe", subscription, jsonrpc: "2.0" });
  }
}
