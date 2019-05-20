import { Connector, Callback } from "./connector";
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

export class WebsocketConnector extends Connector {
  private counter: number = 0;
  private socket: WebSocketSubject<string>;

  constructor(public readonly endpoint: string) {
    super();
  }

  public async connect(params: any): Promise<any> {
    return this.socket = WebSocketSubject.create(params as string);
  }

  public async disconnect(): Promise<any> {
    return this.socket.complete();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return <R>()this.socket.subscribe(() => this.socket.next("msg to the server")));

      //return <R>(this.socket.subscribe(() => this.socket.next("foo"));
      //JSON.stringify({ id: 42, method: f.name, params, jsonrpc: "2.0" });
    };
  }

  public async subscribe(event: string, callback: Callback): Promise<any> {

  }

  public async unsubscribe(event: string): Promise<any> {

  }
}
