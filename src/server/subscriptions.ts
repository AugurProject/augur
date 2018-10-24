import {v4 as uuidv4 } from "uuid";
import { EventEmitter } from "events";

export class Subscriptions extends EventEmitter {
  private parentEmitter: EventEmitter;

  constructor(parentEmitter: EventEmitter) {
    super();
    this.parentEmitter = parentEmitter;
    this.setMaxListeners(0); // Subscriptions all need to listen to removeAllListeners for the global teardown
  }

  public subscribe(eventName: string, params: any, publish: (data: {}) => void): string {
    return this.subscribeToEvent(eventName, params, publish);
  }

  public unsubscribe(subscription: string): void {
    this.emit(`unsubscribe:${subscription}`);
  }

  public removeAllListeners(eventName?: string | symbol): this {
    this.emit("removeAllListeners");
    return eventName ? super.removeAllListeners(eventName) : super.removeAllListeners();
  }

  private subscribeToEvent(eventName: string, params: any, publish: (data: {}) => void): string {
    const subscription: string = uuidv4();

    const handler = (data: {}): void => {
      this.emit(eventName, data);
    };
    this.parentEmitter.on(eventName, handler);

    this.on(eventName, publish)
      .once(`unsubscribe:${subscription}`, (): void => {
        this.removeListener(eventName, publish);
        this.parentEmitter.removeListener(eventName, handler);
      })
      .once("removeAllListeners", (): void => {
        this.parentEmitter.removeListener(eventName, handler);
      });

    return subscription;
  }
}
