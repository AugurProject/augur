import { Connectors } from "@augurproject/sdk";
import { SubscriptionEventName } from "@augurproject/sdk";
import { Events } from "@augurproject/sdk";

export function makeConnectorMock(json: object): Connectors.BaseConnector {
  class MockConnector extends Connectors.BaseConnector {
    private callback: Events.Callback;

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

    public async on(eventName: SubscriptionEventName | string, callback: Events.Callback): Promise<void> {
    }

    public async off(eventName: SubscriptionEventName | string): Promise<any> {
    }
  }

  return new MockConnector();
}
