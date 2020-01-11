import { SDKConfiguration, startServer } from '../state';
import { API } from '../state/getter/API';
import { BaseConnector } from './base-connector';
import { SubscriptionEventName } from '../constants';
import { Subscriptions } from '../subscriptions';
import { Callback, EventNameEmitter } from '../events';
import { BrowserMesh, ZeroX } from "../api/ZeroX";

export class SingleThreadConnector extends BaseConnector {
  private _api: API;
  private _zeroX: ZeroX;
  private get events(): Subscriptions {
    return this._api.augur.events;
  }
  public get mesh(): BrowserMesh {
    return this._zeroX.mesh;
  }
  public set mesh(mesh: BrowserMesh) {
    this._zeroX.mesh = mesh;
  }

  async connect(config: SDKConfiguration, account?: string): Promise<void> {
    this._api = await startServer(config);
    this._zeroX = new ZeroX(this._api.augur, config.zeroX.rpc.ws);
    this._api.augur.zeroX = this._zeroX;
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
