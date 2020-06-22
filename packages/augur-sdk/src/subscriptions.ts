import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';

export interface EventData {
  eventName: string;
  eventArgs: any[];
}

export interface WaitingOn {
  [eventName: string]: EventData[];
}

export class Subscriptions extends EventEmitter {
  private parentEmitter: EventEmitter;
  private waitingOn: WaitingOn;

  constructor(parentEmitter: EventEmitter) {
    super();
    this.parentEmitter = parentEmitter;
    this.waitingOn = {};
    this.setMaxListeners(0); // Subscriptions all need to listen to removeAllListeners for the global teardown
  }

  subscribe(eventName: string, publish: (...args: any[]) => void): string {
    return this.subscribeToEvent(eventName, publish);
  }

  unsubscribe(subscription: string): void {
    this.emit(`unsubscribe:${subscription}`);
  }

  emitAfter(after: string, eventName: string, ...eventArgs: any[]): void {
    if (!this.waitingOn[after]) this.waitingOn[after] = [];
    this.waitingOn[after].push({
      eventName,
      eventArgs,
    })
  }

  emit(event: string, ...args: any[]): boolean {
    const result = super.emit(event, ...args);
    if (this.waitingOn[event]) {
      for (const eventData of this.waitingOn[event]) {
        this.emit(eventData.eventName, ...eventData.eventArgs);
      }
      this.waitingOn[event] = [];
    }
    return result;
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    this.parentEmitter.on(event, listener);
    super.on(event, listener);
    return this;
  }

  off(event: string | symbol, listener: (...args: any[]) => void): this {
    this.parentEmitter.off(event, listener);
    super.off(event, listener);
    return this;
  }

  removeAllListeners(eventName?: string | symbol): this {
    this.emit('removeAllListeners');
    return eventName ? super.removeAllListeners(eventName) : super.removeAllListeners();
  }

  private subscribeToEvent(eventName: string, publish: (...args: any[]) => void): string {
    const subscription: string = uuidv4();

    const handler = (...args: any[]): void => {
      this.emit(eventName, ...args);
    };

    this.parentEmitter.on(eventName, handler);

    this.on(eventName, publish)
      .once(`unsubscribe:${subscription}`, (): void => {
        this.removeListener(eventName, publish);
        this.parentEmitter.removeListener(eventName, handler);
      })
      .once('removeAllListeners', (): void => {
        this.parentEmitter.removeListener(eventName, handler);
      });

    return subscription;
  }
}
