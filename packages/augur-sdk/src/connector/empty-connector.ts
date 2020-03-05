import { SubscriptionEventName } from '../constants';
import { Callback } from '../events';
import { SDKConfiguration } from '@augurproject/artifacts';
import { BaseConnector } from './base-connector';

export class EmptyConnector extends BaseConnector {
  async connect(config: SDKConfiguration, account?: string): Promise<void> {
    return;
  }

  async disconnect(): Promise<void> {
    return;
  }

  bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return '' as any;
    };
  }

  async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
  }

  async off(eventName: SubscriptionEventName): Promise<void> {
  }
}
