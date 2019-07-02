import { Callback, SubscriptionType } from "../events";
import { Connector } from "./connector";
import { SubscriptionEventName } from "../constants";

export class EmptyConnector extends Connector {
  public async connect(ethNodeUrl: string, account?: string): Promise<any> {
    return;
  }

  public async disconnect(): Promise<any> {
    return;
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return "" as any;
    };
  }

  public async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
  }

  public async off(eventName: SubscriptionEventName): Promise<void> {
  }
}
