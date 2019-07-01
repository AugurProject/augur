import { SubscriptionEventNames } from "../constants";
import { Callback, SubscriptionTypes } from "../events";

export abstract class Connector {
  public subscriptions: { [event: string]: { id: string, callback: Callback } } = {};

  // Lifecyle of the connector
  public abstract async connect(ethNodeUrl: string, account?: string): Promise<any>;
  public abstract async disconnect(): Promise<any>;

  // bind API calls
  public abstract bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R>;

  public abstract async on<T extends SubscriptionTypes>(eventName: SubscriptionEventNames | string, type: { new(): T; }, callback: Callback): Promise<void>;
  public abstract async off(eventName: SubscriptionEventNames | string): Promise<void>;

  public callbackWrapper<T extends SubscriptionTypes>(callback: Callback, type: { new(): T; }): (...args: SubscriptionTypes[]) => void {
    console.log("TYPE is", type);
    return (...args: SubscriptionTypes[]): void => {
      console.log("FOO FOO ARGS: ", this.create(args, type));
      //callback(args.map((arg: object) => this.create(arg, type)));
    };
  }

  private create<T extends SubscriptionTypes>(arg: object, type: { new(): T; }): T {
    console.log("new type is", type);
    const t = new type();

    t.ingestEvent(arg);
    return t;
  }
}
