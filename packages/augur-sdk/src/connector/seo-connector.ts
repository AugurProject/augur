import * as Sync from "../state/Sync";
import { API } from "../state/getter/API";
import { BaseConnector } from "./baseConnector";
import { SubscriptionEventName } from "../constants";
import { Subscriptions } from "../subscriptions";
import { Callback, augurEmitter, SubscriptionType } from "../events";

export class SEOConnector extends BaseConnector {
  private api: API;
  private events = new Subscriptions(augurEmitter);

  async connect(ethNodeUrl: string, account?: string): Promise<any> {
this.api = await Sync.start(ethNodeUrl, account, { adapter: "memory" }, true);
  }

  async syncUserData(account: string): Promise<any> {
    return;
  }

  async disconnect(): Promise<any> {
  }

  bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.api.route(f.name, params);
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
