import { EventEmitter } from "events";
import { SubscriptionEventName } from "./constants";
import { SubscriptionType } from "./event-handlers";

export * from "./event-handlers";


// Some events, like MarketState, are not always sourced from logs and do not have an "eventName"
// Always make sure it is present without having to specify in every .emit call
class EventNameEmitter extends EventEmitter {
  public emit(eventName: SubscriptionEventName | string, ...args: Array<any>): boolean {
    return super.emit(eventName, ...args);
  }
}

export const augurEmitter: EventNameEmitter = new EventNameEmitter();

// 0 because we need one per websocket client
augurEmitter.setMaxListeners(0);
export type Callback = (...args: SubscriptionType[]) => void;
