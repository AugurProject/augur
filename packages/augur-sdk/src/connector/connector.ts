import { ContractEvents } from "@augurproject/types";
import { SubscriptionEventNames } from "../constants";

export type Callback = (...args: Array<any>) => void;

export abstract class Connector {
  public subscriptions: { [event: string]: { id: string, callback: Callback } } = {};

  // Lifecyle of the connector
  public abstract async connect(params?: any): Promise<any>;
  public abstract async disconnect(): Promise<any>;

  // bind API calls
  public abstract bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R>;

  public abstract async on(eventName: SubscriptionEventNames | string, callback: Callback): Promise<void>;
  public abstract async off(eventName: SubscriptionEventNames | string): Promise<void>;
}
