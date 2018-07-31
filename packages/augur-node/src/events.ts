import { EventEmitter} from "events";

export const augurEmitter: EventEmitter = new EventEmitter();

// Purposefully setting this to 0 because we need one per websocket client
augurEmitter.setMaxListeners(0);
