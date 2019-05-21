import { Connector, Callback } from "./connector";
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

export class WebsocketConnector extends Connector {
  private counter: number = 0;
  private socket: WebSocket;

  constructor(public readonly endpoint: string) {
    super();
  }

  public async connect(params: any): Promise<any> {
    return this.socket = new WebSocket(this.endpoint);
  }

  public async disconnect(): Promise<any> {
    return this.socket.close();
  }

  public bindTo<P>(f: (db: any, augur: any, params: P) => any): (params: P) => Promise<any> {
    return async (params: P): Promise<any> => {
      ++this.counter;
      return await this.socket.send(JSON.stringify({ id: this.counter, method: f.name, params, jsonrpc: "2.0" }));
    };
  }

  public async subscribe(event: string, callback: Callback): Promise<any> {
    this.socket.onmessage = callback;

    ++this.counter;
    return this.socket.send(JSON.stringify({ id: this.counter, method: "subscribe", event, jsonrpc: "2.0" }));
  }

  public async unsubscribe(event: string): Promise<any> {
    ++this.counter;
    return this.socket.send(JSON.stringify({ id: this.counter, method: "unsubscribe", event, jsonrpc: "2.0" }));
  }
}
