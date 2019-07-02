import { Callback } from "@augurproject/sdk/build/events";
import { Connector } from "@augurproject/sdk/build/connector/connector";
import { SubscriptionEventName } from "@augurproject/sdk/build/constants";
import { FormattedEventLog } from "@augurproject/sdk/build/events";

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

    public async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
    }

    public async off(eventName: SubscriptionEventName | string): Promise<any> {
    }
  }

  return new MockConnector();
}
