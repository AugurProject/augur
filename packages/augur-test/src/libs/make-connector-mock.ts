import { Connector, Callback } from "@augurproject/sdk/build/connector/connector";
import { SubscriptionEventNames } from "@augurproject/sdk/build/constants";

export function makeConnectorMock(json: object): Connector {
  class MockConnector extends Connector {
    private callback: Callback;

    public async connect(params?: any): Promise<any> {
      return true;
    }

    public async disconnect(): Promise<any> {
      return true;
    }

    // bind API calls
    public bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
      return async (params: P): Promise<R> => {

        return <R>(json as unknown);
      };
    }

    public async on(event: SubscriptionEventNames | string, callback: Callback): Promise<void> {
      return;
    }

    public async off(eventName: SubscriptionEventNames | string): Promise<void> {
      return;
    }
  }

  return new MockConnector();
}
