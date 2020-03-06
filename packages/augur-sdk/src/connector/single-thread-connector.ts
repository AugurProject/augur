import { SDKConfiguration } from '@augurproject/artifacts';
import { API } from '../state/getter/API';
import { startServerFromClient } from '../state/create-api';
import { BaseConnector } from './base-connector';
import { SubscriptionEventName } from '../constants';
import { Subscriptions } from '../subscriptions';
import { Callback } from '../events';

export class SingleThreadConnector extends BaseConnector {
  private get events(): Subscriptions {
    return this.client.events;
  }

  private _api: API;
  get api() {
    return this._api;
  }

  async connect(config: SDKConfiguration, account?: string): Promise<void> {
    this._api = await startServerFromClient(config, this.client);
  }

  async disconnect(): Promise<void> {
    this._api = null;
  }

  bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this._api.route(f.name, params);
    };
  }

  async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
    const wrappedCallack = this.callbackWrapper(eventName, callback);
    const id: string = this.events.subscribe(eventName, wrappedCallack);
    this.subscriptions[eventName] = { id, callback: wrappedCallack };


  }

  async off(eventName: SubscriptionEventName | string): Promise<void> {
    const subscription = this.subscriptions[eventName];
    if (subscription) {
      delete this.subscriptions[eventName];
      return this.events.unsubscribe(subscription.id);
    }
  }
 }
