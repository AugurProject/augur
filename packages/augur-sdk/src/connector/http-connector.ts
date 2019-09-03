import { Callback, SubscriptionType } from "../events";
import { BaseConnector } from "./baseConnector";
import { SubscriptionEventName } from "../constants";
import fetch from "cross-fetch";

export class HTTPConnector extends BaseConnector {

  constructor(readonly endpoint: string) {
    super();
  }

  async connect(params?: any): Promise<any> {
    return Promise.resolve();
  }

  async syncUserData(account: string): Promise<any> {
    return fetch(this.endpoint, {
      method: "POST",
      body: JSON.stringify({ id: 42, method: 'syncUserData', params: [account], jsonrpc: "2.0" }),
      headers: { "Content-Type": "application/json" },
    });
  }

  async disconnect(): Promise<any> {
    return Promise.resolve();
  }

  bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return (await (await fetch(this.endpoint, {
        method: "POST",
        body: JSON.stringify({ id: 42, method: f.name, params, jsonrpc: "2.0" }),
        headers: { "Content-Type": "application/json" },
      })).json()) as R;
    };
  }

  async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> { }
  async off(eventName: SubscriptionEventName | string): Promise<void> { }
}
