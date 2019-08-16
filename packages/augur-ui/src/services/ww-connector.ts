import RunWorker from './Sync.worker';
import {
  Connectors,
  Events,
  SubscriptionEventName,
} from '@augurproject/sdk';
import { Callback } from '@augurproject/sdk/src/events';

// Generator function for creating request IDs
function* infiniteSequence() {
    let i = 0;
    while(true) {
        yield i++;
    }
}
const iterator = infiniteSequence();

export class WebWorkerConnector extends Connectors.BaseConnector {
  private worker: any;
  subscriptions: { [event: string]: { id: string, callback: Callback } } = {};

  async connect(ethNodeUrl: string, account?: string): Promise<any> {
    this.worker = new RunWorker();


    await this.worker.postMessage({
      id: iterator.next().value,
      method: 'start',
      ethNodeUrl,
      account,
      jsonrpc: '2.0',
    });
console.log("In WebWorkerConnector.connect");

    this.worker.onMessage = (event: MessageEvent) => {
console.log("In WebWorkerConnector.onMessage");
console.log(event);
      try {
        if (event.data.subscribed) {
          this.subscriptions[event.data.subscribed].id =
            event.data.subscription;
        } else {
          this.messageReceived(event.data);
        }
      } catch (error) {
        console.error('Bad Web Worker response: ' + event);
      }
    };

    this.worker.onClose = (message: string) => {
      console.log('Web worker closed');
      console.log(message);
    };

    return this.worker;
  }

  messageReceived(message: any) {
console.log("In WebWorkerConnector.messageReceived");
console.log(message);
    if (message.result) {
      if (this.subscriptions[message.eventName]) {
        this.subscriptions[message.eventName].callback(message.result);
      }
    }
  }

  async disconnect(): Promise<any> {
    this.worker.terminate();
  }

  bindTo<R, P>(
    f: (db: any, augur: any, params: P) => Promise<R>
  ): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.worker.postMessage({
        id: iterator.next().value,
        method: f.name,
        params,
        jsonrpc: '2.0',
      });
    };
  }

  async on(
    eventName: SubscriptionEventName | string,
    callback: Events.Callback
  ): Promise<void> {
    const response = await this.worker.postMessage({
      id: iterator.next().value,
      method: 'subscribe',
      eventName,
      jsonrpc: '2.0',
      params: [eventName],
    });
console.log("In WebWorkerConnector.on");
console.log(eventName);
console.log(response);
    if (response) {
      this.subscriptions[eventName] = {
        id: response.result.subscription,
        callback: this.callbackWrapper(callback),
      };
    }
  }

  async off(eventName: SubscriptionEventName | string): Promise<void> {
    const subscription = this.subscriptions[eventName];
console.log("In WebWorkerConnector.off");
    if (subscription) {
      const response = await this.worker.postMessage({
        id: iterator.next().value,
        method: 'unsubscribe',
        subscription: subscription.id,
        jsonrpc: '2.0',
        params: [subscription.id],
      });
      console.log(response);
      delete this.subscriptions[eventName];
    }
  }
}
