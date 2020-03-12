import { Augur } from '../Augur';
import { SDKConfiguration } from '@augurproject/artifacts';
import { SubscriptionEventName } from '../constants';
import { Callback, SubscriptionType } from '../events';

export abstract class BaseConnector {
  private _client: Augur;
  get client(): Augur {
    return this._client;
  }
  set client(client: Augur) {
    this._client = client;
  }

  subscriptions: { [event: string]: { id: string, callback: Callback } } = {};

  // Lifecyle of the connector
  abstract async connect(config: SDKConfiguration, account?: string): Promise<void>;
  abstract async disconnect(): Promise<void>;

  // bind API calls
  abstract bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R>;

  abstract async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void>;
  abstract async off(eventName: SubscriptionEventName | string): Promise<void>;

  protected callbackWrapper<T extends SubscriptionType>(eventName: string, callback: Callback): (...args: SubscriptionType[]) => void {
    return (...args: T[]): void => {
      args.map((arg: object) => {
        const t = {eventName} as SubscriptionType;
        Object.assign(t, arg);
        callback(t);
      });
    };
  }
}
