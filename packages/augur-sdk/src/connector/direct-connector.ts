import { Augur } from '../Augur';
import { SDKConfiguration } from '@augurproject/artifacts';
import { SubscriptionEventName } from '../constants';
import { Callback } from '../events';
import { BaseConnector } from './base-connector';
import { DB } from '../state/db/DB';

export class DirectConnector extends BaseConnector {
  db: DB;

  initialize(client: Augur, db: DB): void {
    this.client = client;
    this.db = db;
  }

  async connect(config: SDKConfiguration, account?: string): Promise<void> {
  }

  async disconnect(): Promise<void> {
  }

  // bind API calls
  bindTo<R, P>(
    f: (augur: Augur, db: DB, params: P) => Promise<R>
  ): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return f(this.client, this.db, params);
    };
  }

  async on(
    eventName: SubscriptionEventName | string,
    callback: Callback
  ): Promise<void> {}

  async off(eventName: SubscriptionEventName | string): Promise<void> {}
}
