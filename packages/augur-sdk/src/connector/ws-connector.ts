import { Connector, Callback } from "./connector";

export class WebsocketConnector extends Connector {
  public async connect(params: any): Promise<any> {

  }

  public async disconnect(): Promise<any> {

  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return {} as R;
    };
  }

  public async subscribe(event: string, callback: Callback): Promise<any> {

  }

  public async unsubscribe(event: string): Promise<any> {

  }
}
