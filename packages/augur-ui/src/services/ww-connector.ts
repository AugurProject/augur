import RunWorker from './Sync.worker';
import {
  Connectors,
  Events,
  JsonRpcResponse,
  SubscriptionEventName,
} from '@augurproject/sdk';
import { Callback } from '@augurproject/sdk/src/events';

interface OutstandingRequest {
  id: number;
  resolve: (value) => void;
  reject: (reason) => void;
}

// Generator function for creating request IDs
function* infiniteSequence() {
    let i = 0;
    while(true) {
        yield i++;
    }
}
const iterator = infiniteSequence();

export class WebWorkerConnector extends Connectors.BaseConnector {
  private outstandingRequests: OutstandingRequest[] = [];
  private worker: any;
  subscriptions: { [event: string]: { id: string, callback: Callback } } = {};

  async connect(ethNodeUrl: string, account?: string): Promise<any> {
    this.worker = new RunWorker();

    this.worker.postMessage({
      id: iterator.next().value,
      method: 'start',
      params: [ethNodeUrl, account],
      jsonrpc: '2.0',
    });

    this.worker.onmessage = (event: MessageEvent) => {
      try {
        const eventData: JsonRpcResponse = JSON.parse(event.data);

        // Handle response for outstanding request
        this.outstandingRequests.filter((r) => r.id === eventData.id).forEach((r) => {
          if (eventData.error) {
            r.reject(new Error(eventData.error.message));
          } else {
            r.resolve(eventData.result);
          }
        });
        _.remove(this.outstandingRequests, function(r) {
          return r.id === eventData.id;
        });

        if (eventData.result && eventData.result.subscribed) {
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

  async syncUserData(account: string): Promise<any> {
    return this.worker.postMessage({
      id: iterator.next().value,
      method: 'syncUserData',
      params: [account],
      jsonrpc: '2.0',
    });
  }

  messageReceived(message: any): void {
    if (message.result) {
      if (this.subscriptions[message.result.eventName]) {
        this.subscriptions[message.result.eventName].callback(message.result);
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
      return new Promise<R>((resolve, reject)=>{
        const id = iterator.next().value;
        this.outstandingRequests.push({
          id,
          resolve,
          reject,
        });
        this.worker.postMessage({
          id,
          method: f.name,
          params,
          jsonrpc: '2.0',
        });
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
