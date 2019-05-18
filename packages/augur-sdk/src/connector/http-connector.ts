import { Connector, Callback } from "./connector";
// TODO: use cross-fetch?
import fetch from "node-fetch";

export class HTTPConnector extends Connector {

  constructor(public readonly endpoint: string) {
    super();
  }

  public async connect(params: any): Promise<any> {

  }

  public async disconnect(): Promise<any> {

  }

  public async invoke<R, P>(f: (db: any, augur: any, params: P) => R, params: P): Promise<R> {
    console.log(params);
    return <R> (await (await fetch(this.endpoint, {
      method: 'POST',
      body: JSON.stringify({id: 42, method: f.name, params, jsonrpc: "2.0"}),
      headers: { 'Content-Type': 'application/json' },
    })).json());
  }

  public async subscribe(event: string, callback: Callback): Promise<any> {

  }

  public async unsubscribe(event: string): Promise<any> {

  }
}
