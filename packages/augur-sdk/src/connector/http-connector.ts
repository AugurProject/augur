import { Connector, Callback } from "./connector";
import fetch from "cross-fetch";

export class HTTPConnector extends Connector {

  constructor(public readonly endpoint: string) {
    super();
  }

  public async connect(params: any): Promise<any> {
return Promise.resolve();
  }

  public async disconnect(): Promise<any> {
return Promise.resolve();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R) {
    return async (params: P): Promise<R> => {
      console.log(params);
      return <R> (await (await fetch(this.endpoint, {
        method: 'POST',
        body: JSON.stringify({id: 42, method: f.name, params, jsonrpc: "2.0"}),
        headers: { 'Content-Type': 'application/json' },
      })).json());
    }
  }

  public async subscribe(event: string, callback: Callback): Promise<any> {

  }

  public async unsubscribe(event: string): Promise<any> {

  }
}
