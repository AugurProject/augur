import { ContractEvents } from "@augurproject/types";
import { SubscriptionEventNames } from "../constants";

export type Callback = (data: any) => void;

export abstract class Connector {

  // Lifecyle of the connector
  public abstract async connect(params?: any): Promise<any>;
  public abstract async disconnect(): Promise<any>;

  // bind API calls
  public abstract bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R>;

  public abstract async subscribe(event: SubscriptionEventNames, callback: Callback): Promise<any>;
  public abstract async unsubscribe(subscription: string): Promise<any>;
}
