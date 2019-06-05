import * as Sync from "../state/Sync";
import {API} from "../state/getter/API";
import {Callback, Connector} from "./connector";
import {SubscriptionEventNames} from "../constants";
import {Subscriptions} from "../subscriptions";
import {augurEmitter} from "../events";


export class SEOConnector extends Connector {
  private api: API;
  private events = new Subscriptions(augurEmitter);

  public async connect(ethNodeUrl: string, account?: string): Promise<any> {
    this.api = await Sync.start(ethNodeUrl, account, { adapter: "memory" });
  }

  public async disconnect(): Promise<any> {
    return;
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.api.route(f.name, params);
    };
  }

  public on(eventName: SubscriptionEventNames | string, callback: Callback): void {
    const subscription: string = this.events.subscribe(eventName, callback);
    this.subscriptions[eventName] = { id: subscription, callback };
  }

  public off(eventName: SubscriptionEventNames | string): void {
    const subscription = this.subscriptions[eventName].id;
    delete this.subscriptions[eventName];
    return this.events.unsubscribe(subscription);
  }
}
