import {SubscriptionEventNames} from "../constants";

export type Callback = (data: any) => void;

export abstract class Connector {
  protected subscriptions: { [event: string]: { id: string, callback: Callback } } = {};

  // Lifecyle of the connector
  public abstract async connect(ethNodeUrl: string, account?: string): Promise<any>;
  public abstract async disconnect(): Promise<any>;

  // bind API calls
  public abstract bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R>;

  public abstract on(eventName: SubscriptionEventNames | string, callback: Callback): void;
  public abstract off(eventName: SubscriptionEventNames | string): void;
}
