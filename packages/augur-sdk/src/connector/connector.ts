import { ContractEvents } from "@augurproject/artifacts";

export type Callback = (data: any) => Promise<unknown>;

export abstract class Connector {
  private subscribedEvents: { [key in ContractEvents]?: Callback } = {};

  public abstract async connect(params: any): Promise<any>;
  public abstract async disconnect(): Promise<any>;
  public abstract async send(data: any, callbak: Callback): Promise<any>;

  public subscribe(event: ContractEvents, callback: Callback): void {
    this.subscribedEvents[event] = callback;
  }

  public unsubscribe(event: ContractEvents): void {
    delete this.subscribedEvents[event];
  }

  // is ts-io being used with this connector?
  public decode?(): boolean {
    return false;
  }

  public unsubscribeAll(): void {
    this.subscribedEvents = {};
  }

  protected dispatch(data: any): any {

  }
}
