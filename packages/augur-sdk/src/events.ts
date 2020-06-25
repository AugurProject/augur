import {
  SubscriptionEventName,
  SubscriptionType,
  TXStatus,
} from '@augurproject/sdk-lite';
import { EventEmitter } from 'events';

// Some events, like MarketState, are not always sourced from logs and do not have an "eventName"
// Always make sure it is present without having to specify in every .emit call
export class EventNameEmitter extends EventEmitter {
  emit(eventName: SubscriptionEventName | string, ...args: any[]): boolean {
    return super.emit(eventName, ...args);
  }
}

export type Callback = (...args: SubscriptionType[]) => void;
export type TXStatusCallback = (...args: TXStatus[]) => void;
