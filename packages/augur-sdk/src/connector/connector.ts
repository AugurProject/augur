import { ContractEvents } from "@augurproject/types";

export type Callback = (data: any) => Promise<unknown>;

export abstract class Connector {
  private callbacks: { [key in ContractEvents]?: Callback } = {};

  public abstract async connect(params: any): Promise<any>;
  public abstract async disconnect(): Promise<any>;
  public abstract async send(data: any): Promise<any>;
  public abstract async subscribe(event: string, callback: Callback): Promise<any>;
  public abstract async unsubscribe(event: string): Promise<any>;

  // is ts-io being used with this connector?
  public decode?(): boolean {
    return false;
  }

  public async unsubscribeAll(): Promise<Array<Promise<void>>> {
    return Object.keys(this.callbacks).map((event) => this.unsubscribe(event));
  }
}
