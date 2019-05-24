import { Connector, Callback } from "./connector";
import WebSocket from 'ws';

export class WebsocketConnector extends Connector {
  private counter: number = 0;
  private socket: WebSocket;
  private promises: { [index: number]: { promise: Promise<any> } } = {};
  private callback: Callback;

  constructor(public readonly endpoint: string) {
    super();
  }

  public async connect(params?: any): Promise<any> {
    this.socket = new WebSocket(this.endpoint);
    return new Promise((resolve, reject) => {
      this.socket.on("open", () => resolve(true));
      this.socket.on("error", () => reject("Connection failed"));
    });
  }

  public async disconnect(): Promise<any> {
    return this.socket.close();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return async (params: P): Promise<any> => {
      ++this.counter;
      this.socket.send(JSON.stringify({ id: this.counter, method: f.name, params, jsonrpc: "2.0" }));
      return new Promise<R>((resolve, reject) => {
        this.socket.on("message", (data) => resolve(JSON.parse(data as string)));
        this.socket.on("error", () => reject("Error sending over web socket"));
      });
    };
  }

  public async subscribe(event: string, callback: Callback): Promise<any> {
    this.callback = callback;

    ++this.counter;
    return this.socket.send(JSON.stringify({ id: this.counter, method: "subscribe", event, jsonrpc: "2.0" }));
  }

  public async unsubscribe(event: string): Promise<any> {
    ++this.counter;
    return this.socket.send(JSON.stringify({ id: this.counter, method: "unsubscribe", event, jsonrpc: "2.0" }));
  }
}
