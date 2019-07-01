import * as Sync from "../state/Sync";
import { API } from "../state/getter/API";
import { Connector } from "./connector";
import { SubscriptionEventNames } from "../constants";
import { Subscriptions } from "../subscriptions";
import { Callback, augurEmitter, SubscriptionType } from "../events";

export class SEOConnector extends Connector {
  private api: API;
  private events = new Subscriptions(augurEmitter);

  public async connect(ethNodeUrl: string, account?: string): Promise<any> {
    this.api = await Sync.start(ethNodeUrl, account, { adapter: "memory" });
  }

  public async disconnect(): Promise<any> {
    // this.ethersProvider.polling = false;
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.api.route(f.name, params);
    };
  }

  public async on<T extends SubscriptionType>(eventName: SubscriptionEventNames | string, type: { new(): T; }, callback: Callback): Promise<void> {
    const wrappedCallack = super.callbackWrapper(callback, type);

    const subscription: string = this.events.subscribe(eventName, wrappedCallack);
    this.subscriptions[eventName] = { id: subscription, callback: wrappedCallack };
  }

  public async off(eventName: SubscriptionEventNames | string): Promise<void> {
    const subscription = this.subscriptions[eventName];
    if (subscription) {
      delete this.subscriptions[eventName];
      return this.events.unsubscribe(subscription.id);
    }
  }
}
