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
// console.log("In WebWorkerConnector.connect");
    this.worker = new RunWorker();

    this.worker.postMessage({
      id: iterator.next().value,
      method: 'start',
      params: [],
      ethNodeUrl,
      account,
      jsonrpc: '2.0',
    });

    this.worker.onmessage = (event: MessageEvent) => {
console.log("In WebWorkerConnector.onMessage");
console.log(event);
      try {
        const eventData = JSON.parse(event.data);
        if (eventData.result && eventData.result.subscribed) {
console.log("Subscribed to", eventData.result.subscribed);
          this.subscriptions[eventData.result.subscribed].id = eventData.result.subscription;
        } else {
          this.messageReceived(eventData);
        }
      } catch (error) {
        console.error('Bad Web Worker response: ' + error);
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
    if (message.result && message.result.result) {
      if (this.subscriptions[message.result.eventName]) {
console.log("Calling callback");
        this.subscriptions[message.result.eventName].callback(message.result);
      }
    }
console.log(this.subscriptions);
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
    this.subscriptions[eventName] = {
      id: '',
      callback: this.callbackWrapper(callback),
    };
    this.worker.postMessage({
      id: iterator.next().value,
      method: 'subscribe',
      params: [eventName],
      jsonrpc: '2.0',
    });
  }

  async off(eventName: SubscriptionEventName | string): Promise<void> {
    const subscription = this.subscriptions[eventName];

    if (subscription) {
      delete this.subscriptions[eventName];
      this.worker.postMessage({
        id: iterator.next().value,
        method: 'unsubscribe',
        params: [subscription.id],
        jsonrpc: '2.0',
      });
    }
  }
}
