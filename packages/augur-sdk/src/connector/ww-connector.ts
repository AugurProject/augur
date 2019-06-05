import RunWorker from "../state//Sync.worker";

import {API} from "../state/getter/API";
import {Callback, Connector} from "./connector";
import {SubscriptionEventNames} from "../constants";

export class WebWorkerConnector extends Connector {
  private api: API;
  private worker: any;

  public async connect(ethNodeUrl: string, account?: string): Promise<any> {
    this.worker = new RunWorker();

    this.worker.onmessage = (event: MessageEvent) => {
      try {
        if (event.data.subscribed) {
          this.subscriptions[event.data.subscribed].id = event.data.subscription;
          console.log(this.subscriptions[event.data.subscribed]);
        } else {
          event.data.map((data: any) => {
            if (this.subscriptions[data.eventName]) {
              this.subscriptions[data.eventName].callback(data);
            }
          });
        }
      } catch (error) {
        console.error("Bad Web Worker response: " + event);
      }
    };
  }

  public async disconnect(): Promise<any> {
    this.worker.terminate();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.api.route(f.name, params);
    };
  }

  public on(eventName: SubscriptionEventNames | string, callback: Callback): void {
    this.subscriptions[eventName] = { id: "", callback };
    this.worker.postMessage({ subscribe: eventName });
  }

  public off(eventName: SubscriptionEventNames | string): void {
    const subscription = this.subscriptions[eventName].id;
    delete this.subscriptions[eventName];

    this.worker.postMessage({ unsubscribe: subscription });
  }
}
