import * as Sync from '../state/Sync';
import { API } from '../state/getter/API';
import { BaseConnector } from './baseConnector';
import { SubscriptionEventName } from '../constants';
import { Subscriptions } from '../subscriptions';
import { Callback, augurEmitter } from '../events';

export class SingleThreadConnector extends BaseConnector {
  protected api: Promise<API>;
  protected events = new Subscriptions(augurEmitter);

  connect = (ethNodeUrl: string, account?: string): Promise<any> => {
    this.api = Sync.start(ethNodeUrl, account, true, {});
    return this.api;
  }

  async syncUserData(account: string): Promise<any> {
    return (await this.api).route('syncUserData', [account]);
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
