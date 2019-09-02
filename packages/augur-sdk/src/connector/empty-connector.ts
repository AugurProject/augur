import { Callback, SubscriptionType } from "../events";
import { BaseConnector } from "./baseConnector";
import { SubscriptionEventName } from "../constants";

export class EmptyConnector extends BaseConnector {
  async connect(ethNodeUrl: string, account?: string): Promise<any> {
    return;
  }

  async syncUserData(account: string): Promise<any> {
    return;
  }

  async disconnect(): Promise<any> {
    return;
  }

  bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return "" as any;
    };
  }

  async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
  }

  async off(eventName: SubscriptionEventName): Promise<void> {
  }
}
