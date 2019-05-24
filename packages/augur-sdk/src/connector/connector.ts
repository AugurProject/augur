import { ContractEvents } from "@augurproject/types";

export type Callback = (data: any) => Promise<unknown>;

export abstract class Connector {
  private callbacks: { [key in ContractEvents]?: Callback } = {};

  // Lifecyle of the connector
  public abstract async connect(params?: any): Promise<any>;
  public abstract async disconnect(): Promise<any>;

  // bind API calls
  public abstract bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R>;

  // Events XXX: TODO - sort out how we want to use this stuff
  public abstract async subscribe(event: string, callback: Callback): Promise<any>;
  public abstract async unsubscribe(event: string): Promise<any>;

  public async unsubscribeAll(): Promise<Array<Promise<void>>> {
    return Object.keys(this.callbacks).map((event) => this.unsubscribe(event));
  }
}
