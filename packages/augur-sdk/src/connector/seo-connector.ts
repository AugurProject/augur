import * as Sync from '../state/Sync';
import { SingleThreadConnector } from './single-thread-connector';
import { SubscriptionEventName } from '../constants';
import { Callback, SubscriptionType } from '../events';

export class SEOConnector extends SingleThreadConnector {
  connect = async (ethNodeUrl: string, account?: string): Promise<any> => {
    this.api = Sync.start(ethNodeUrl, account, true);
    this.events = this.api.then(api => api.augur.getAugurEventEmitter());

    return this.api;
  };

  async disconnect(): Promise<any> {
    this.api = null;
    return true;
  }

  async on(
    eventName: SubscriptionEventName | string,
    callback: Callback
  ): Promise<void> {
    const newCallback = this.newCallbackWrapper(callback, eventName);
    const id = this.events.then(event => event.subscribe(eventName, newCallback));
    this.subscriptions[eventName] = {id, callback: newCallback};

    // controller.run() is called before the SEOConnector is subscribed to SDKReady, so SDKReady is never triggered,
    // that's why we need to re-emit it here.
    if (eventName === SubscriptionEventName.SDKReady) {
      await this.events.then(event => event.emit(SubscriptionEventName.SDKReady, {
        eventName: SubscriptionEventName.SDKReady,
      }));
    }
  }

  async off(eventName: SubscriptionEventName | string): Promise<void> {
    const subscription = this.subscriptions[eventName];
    if (subscription) {
      delete this.subscriptions[eventName];
      return this.events.then(event => event.unsubscribe(subscription.id));
    }
  }

  bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.api.then(api => api.route(f.name, params));
    };
  }

  newCallbackWrapper = (callback, eventName) => {
    return (...args) => {
      args.map((arg: object, index) => {
        const t = {eventName} as SubscriptionType;
        Object.assign(t, arg);
        callback(t);
      });
    };
  }
}
