import { Connector, Callback } from "./connector";
import { SubscriptionEventNames } from "../constants";

export class EmptyConnector extends Connector {
  public async connect(params?: any): Promise<any> {
    return;
  }

  public async disconnect(): Promise<any> {
    return;
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return "" as any;
    };
  }

  public on(eventName: SubscriptionEventNames, callback: Callback): void {
  }

  public off(eventName: SubscriptionEventNames): void {
  }
}
