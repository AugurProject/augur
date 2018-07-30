import { EventEmitter } from "events";

// Some events, like MarketState, are not always sourced from logs and do not have an "eventName"
// Always make sure it is present without having to specify in every .emit call
class EventNameEmitter extends EventEmitter {
  emit(type: string|symbol, ...args: any[]): boolean {
    const eventsWithName = args.map((event) => {
      return Object.assign(
        { eventName: type },
        event,
      );
    });
    console.log(eventsWithName);
    return super.emit(type, eventsWithName);
  }
}

export const augurEmitter: EventNameEmitter = new EventNameEmitter();

// 0 because we need one per websocket client
augurEmitter.setMaxListeners(0);
