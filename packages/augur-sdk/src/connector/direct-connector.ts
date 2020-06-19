import { SDKConfiguration } from '@augurproject/utils';
import { SubscriptionEventName } from '@augurproject/sdk-lite';
import { Augur } from '../Augur';
import { Callback } from '../events';
import { DB } from '../state/db/DB';
import { BaseConnector } from './base-connector';

export class DirectConnector extends BaseConnector {
  db: DB;

  initialize(client: Augur, db: DB): void {
    this.client = client;
    this.db = db;
  }

  async connect(config: SDKConfiguration, account?: string): Promise<void> {}

  async disconnect(): Promise<void> {}

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
