import { SubscriptionEventNames } from "../constants";
import { Callback, SubscriptionType } from "../events";

export abstract class Connector {
  public subscriptions: { [event: string]: { id: string, callback: Callback } } = {};

  // Lifecyle of the connector
  public abstract async connect(ethNodeUrl: string, account?: string): Promise<any>;
  public abstract async disconnect(): Promise<any>;

  // bind API calls
  public abstract bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R>;

  public abstract async on<T extends SubscriptionType>(eventName: SubscriptionEventNames | string, type: { new(): T; }, callback: Callback): Promise<void>;
  public abstract async off(eventName: SubscriptionEventNames | string): Promise<void>;

  protected callbackWrapper<T extends SubscriptionType>(callback: Callback, type: { new(): T; }): (...args: SubscriptionType[]) => void {
    console.log("TYPE is", type);

    return (...args: SubscriptionType[]): void => {
      console.log("Args are", args);
      console.log("FOO FOO ARGS: ", this.create(args, type));
      //callback(this.create(args, type));
      callback(args.map((arg: object) => this.create(arg, type)));
    };
  }

  private create<T extends SubscriptionType>(arg: object, type: { new(): T; }): SubscriptionType {
    console.log("Testing type creation");
    const t = new type();
    console.log("Type created", t);

    Object.assign(t, arg);
    console.log("Assigned data to", t);

    return t;
  }
}
