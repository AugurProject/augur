import * as Sync from '../state/Sync';
import { API } from '../state/getter/API';
import { BaseConnector } from './baseConnector';
import { SubscriptionEventName } from '../constants';
import { Subscriptions } from '../subscriptions';
import { Callback, EventNameEmitter } from '../events';

export class SingleThreadConnector extends BaseConnector {
  protected api: API;
  protected events: Subscriptions;
  subscriptions: { [event: string]: { id: string; callback: Callback } } = {};

  connect = async (ethNodeUrl: string, account?: string): Promise<any> => {
    this.api = await Sync.start(ethNodeUrl, account, true);
    this.events = this.api.augur.events;

    return this.api;
  }

  async disconnect(): Promise<any> {
    this.api = null;
    return true;
  }

  bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.api.route(f.name, params);
    };
  }

  async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
    const wrappedCallack = this.callbackWrapper(eventName, callback);
    const id: string = this.events.subscribe(eventName, wrappedCallack);
    this.subscriptions[eventName] = { id, callback: wrappedCallack };

    // NB: This is a hack and I wanna remove it
    // controller.run() is called before the SEOConnector is subscribed to SDKReady, so SDKReady is never triggered,
    // that's why we need to re-emit it here.
    if (eventName === SubscriptionEventName.SDKReady) {
      await this.events.emit(SubscriptionEventName.SDKReady, {
        eventName: SubscriptionEventName.SDKReady,
      });
    }
  }

  async off(eventName: SubscriptionEventName | string): Promise<void> {
    const subscription = this.subscriptions[eventName];
    if (subscription) {
      delete this.subscriptions[eventName];
      return this.events.unsubscribe(subscription.id);
    }
  }
}
