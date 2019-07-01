import { SubscriptionEventName } from "../constants";
import { Callback, SubscriptionType } from "../events";

export abstract class Connector {
  public subscriptions: { [event: string]: { id: string, callback: Callback } } = {};

  // Lifecyle of the connector
  public abstract async connect(ethNodeUrl: string, account?: string): Promise<any>;
  public abstract async disconnect(): Promise<any>;

  // bind API calls
  public abstract bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R>;

  public abstract async on<T extends SubscriptionType>(eventName: SubscriptionEventName | string, type: { new(): T; }, callback: Callback): Promise<void>;
  public abstract async off(eventName: SubscriptionEventName | string): Promise<void>;

  protected callbackWrapper<T extends SubscriptionType>(callback: Callback, type: { new(): T; }): (...args: SubscriptionType[]) => void {
    return (...args: T[]): void => {
      args.map((arg: object) => {
        const t = new type();

        console.log("Type created", t);
        console.log(Object.keys(t));

        Object.keys(t).forEach((key) => {
          t[key] = arg[key];
        });

        console.log("It turned into this", t);
        callback(t);
      });
    };
  }
}
