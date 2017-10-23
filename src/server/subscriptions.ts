import * as uuidv4 from "uuid/v4";
import { EventEmitter } from "events";
import { augurEmitter } from "../events";
import { ErrorCallback } from "../types";

export class Subscriptions extends EventEmitter {
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

  public removeAllListeners(eventName?: string | symbol | undefined): this {
    this.emit("removeAllListeners");
    return super.removeAllListeners(eventName);
  }

  private subscribeToEvent(eventName: string, params: any, publish: (data: {}) => void): string {
    const subscription: string = uuidv4();

    const handler = (data: {}): void => { this.emit(eventName, data) };
    augurEmitter.on(eventName, handler);

    this.on(eventName, publish);

    // Unsubscribe from one subscription
    this.once(`unsubscribe:${subscription}`, (): void => {
      this.removeListener(eventName, publish);
      augurEmitter.removeListener(eventName, handler);
    });

    // Cleanup augurEmitter when we're clearing this one
    this.once("removeAllListeners", (): void => {
      augurEmitter.removeListener(eventName, handler);
    });

    return subscription;
  }
}
