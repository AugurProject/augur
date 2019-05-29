import { Connector, Callback } from "./connector";
import WebSocket from "isomorphic-ws";
import WebSocketAsPromised from "websocket-as-promised";

export class WebsocketConnector extends Connector {
  public socket: WebSocketAsPromised;
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

  public async subscribe(event: string, callback: Callback): Promise<any> {
    this.callback = callback;

    return this.socket.sendRequest({ method: "subscribe", event, jsonrpc: "2.0" });
  }

  public async unsubscribe(event: string): Promise<any> {
    return this.socket.sendRequest({ method: "unsubscribe", event, jsonrpc: "2.0" });
  }
}
