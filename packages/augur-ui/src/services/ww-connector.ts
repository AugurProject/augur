import RunWorker from "./Sync.worker";
import { API } from "@augurproject/sdk/build/state/getter/API";
import { Callback } from "@augurproject/sdk/build/events";
import { Connector } from "@augurproject/sdk/build/connector/connector";
import { SubscriptionEventNames } from "@augurproject/sdk/build/constants";
import { buildAPI } from "@augurproject/sdk";

export class WebWorkerConnector extends Connector {
  private api: Promise<API>;
  private worker: any;

  public async connect(ethNodeUrl: string, account?: string): Promise<any> {
    this.worker = new RunWorker();
    this.worker.postMessage({
      method: "start",
      ethNodeUrl,
      account
    });

    this.api = buildAPI(ethNodeUrl, account);

    this.worker.onmessage = (event: MessageEvent) => {
      try {
        if (event.data.subscribed) {
          this.subscriptions[event.data.subscribed].id = event.data.subscription;
          console.log(this.subscriptions[event.data.subscribed]);
        } else {
          this.messageReceived(event.data);
        }
      } catch (error) {
        console.error("Bad Web Worker response: " + event);
      }
    };
  }

  public messageReceived(data: any) {
    if (this.subscriptions[data.eventName]) {
      this.subscriptions[data.eventName].callback(data.result);
    }
  }

  public async disconnect(): Promise<any> {
    this.worker.terminate();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>) {
    return async (params: P): Promise<R> => {
      return (await this.api).route(f.name, params);
    };
  }
  public async on(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
    this.subscriptions[eventName] = { id: "", callback: this.callbackWrapper(callback) };
    this.worker.postMessage({ subscribe: eventName });
  }

  public async off(eventName: SubscriptionEventNames | string): Promise<void> {
    const subscription = this.subscriptions[eventName];

    if (subscription) {
      delete this.subscriptions[eventName];
      this.worker.postMessage({ unsubscribe: subscription.id });
    }
  }
}
