import { Connector, Callback } from "./connector";
import { SubscriptionEventNames } from "../constants";
import fetch from "cross-fetch";

export class HTTPConnector extends Connector {

  constructor(public readonly endpoint: string) {
    super();
  }

  public async connect(params?: any): Promise<any> {
    return Promise.resolve();
  }

  public async disconnect(): Promise<any> {
    return Promise.resolve();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return <R>(await (await fetch(this.endpoint, {
        method: "POST",
        body: JSON.stringify({ id: 42, method: f.name, params, jsonrpc: "2.0" }),
        headers: { "Content-Type": "application/json" },
      })).json());
    };
  }

  public async on(eventName: SubscriptionEventNames | string, callback: Callback): Promise<void> { }
  public async off(eventName: SubscriptionEventNames | string): Promise<void> { }
}
