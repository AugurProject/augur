import * as Sync from "./Sync";
import { Subscriptions } from "..//subscriptions";
import { augurEmitter } from "../events";

// this to be as typesafe as possible with self and addEventListener + postMessage
const ctx: Worker = self as any;
const subscriptions = new Subscriptions(augurEmitter);

ctx.addEventListener("message", async (message: any) => {
  if (message.data.subscribe) {
    const subscription: string = subscriptions.subscribe(message.data.subscribe, (data: {}): void => {
      ctx.postMessage(data);
    });

    ctx.postMessage({ subscribed: message.data.subscribe, subscription });

  } else if (message.data.method === "start") {
    await Sync.start(message.data.ethNodeUrl, message.data.account);

  } else {
    subscriptions.unsubscribe(message.data.unsubscribe);
  }
});

// to stop typescript from complaining
export default null as any;
