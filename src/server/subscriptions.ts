import * as uuidv4 from "uuid/v4";
import { EventEmitter } from "events";
import { ErrorCallback } from "../types";

export class Subscriptions extends EventEmitter {
  private parentEmitter: EventEmitter;

  constructor(parentEmitter: EventEmitter) {
    super();
    this.parentEmitter = parentEmitter;
  }

  public subscribe(eventName: string, params: any, publish: (data: {}) => void): string {
    switch (eventName) {
      case "MarketCreated":
        return this.subscribeToEvent(eventName, params, publish);
      default:
        throw new Error(`Event ${eventName} not available for subscription`);
    }
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
