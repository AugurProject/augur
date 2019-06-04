import { Connector, Callback } from "./connector";
import { SubscriptionEventNames } from "../constants";
import fetch from "cross-fetch";
import {MarketGetterParamTypes, MarketGetterReturnTypes} from "../state/api";

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

  public async submitRequest<K extends keyof MarketGetterParamTypes>(name: K, params: MarketGetterParamTypes[K]): Promise<MarketGetterReturnTypes[K]> {
    return <MarketGetterReturnTypes[K]>(await (await fetch(this.endpoint, {
      method: "POST",
      body: JSON.stringify({ id: 42, method: name, params, jsonrpc: "2.0" }),
      headers: { "Content-Type": "application/json" },
    })).json());

  }


  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R) {
    return async (params: P): Promise<R> => {
      return <R>(await (await fetch(this.endpoint, {
        method: "POST",
        body: JSON.stringify({ id: 42, method: f.name, params, jsonrpc: "2.0" }),
        headers: { "Content-Type": "application/json" },
      })).json());
    };
  }

  public on(eventName: SubscriptionEventNames | string, callback: Callback): void { }
  public off(eventName: SubscriptionEventNames | string): void { }
}
