import { SubscriptionEventName } from "../constants";
import { Callback, SubscriptionType } from "../events";

export abstract class BaseConnector {
  subscriptions: { [event: string]: { id: string, callback: Callback } } = {};

  // Lifecyle of the connector
  abstract async connect(ethNodeUrl: string, account?: string): Promise<any>;
  abstract async syncUserData(account: string): Promise<any>;
  abstract async disconnect(): Promise<any>;

  // bind API calls
  abstract bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R>;

  abstract async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void>;
  abstract async off(eventName: SubscriptionEventName | string): Promise<void>;

  protected callbackWrapper<T extends SubscriptionType>(callback: Callback): (...args: SubscriptionType[]) => void {
    return (...args: T[]): void => {
      args.map((arg: object) => {
        const t = {} as SubscriptionType;
        Object.assign(t, arg);
        callback(t);
      });
    };
  }
}
