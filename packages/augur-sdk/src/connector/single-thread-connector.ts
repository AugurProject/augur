import * as Sync from '../state/Sync';
import { API } from '../state/getter/API';
import { BaseConnector } from './baseConnector';
import { SubscriptionEventName } from '../constants';
import { Subscriptions } from '../subscriptions';
import { Callback } from '../events';

export class SingleThreadConnector extends BaseConnector {
  protected api: Promise<API>;
  protected events;

  connect = async (ethNodeUrl: string, account?: string): Promise<any> => {
    this.api = Sync.start(ethNodeUrl, account, true, {});
    const api = (await this.api)
    this.events = new Subscriptions(api.augur.getAugurEventEmitter())
    return this.api;
  }

  async syncUserData(account: string): Promise<any> {
    const api = (await this.api);
    const db = await api.db;
    return db.addTrackedUser(account, 100000, 10);
  }

  async disconnect(): Promise<any> {
    this.api = null;
    return true;
  }

  bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return (await this.api).route(f.name, params);
    };
  }

  async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
    const wrappedCallack = super.callbackWrapper(callback);

    const subscription: string = this.events.subscribe(eventName, wrappedCallack);
    this.subscriptions[eventName] = { id: subscription, callback: wrappedCallack };
  }

  async off(eventName: SubscriptionEventName | string): Promise<void> {
    const subscription = this.subscriptions[eventName];
    if (subscription) {
      delete this.subscriptions[eventName];
      return this.events.unsubscribe(subscription.id);
    }
  }
}
