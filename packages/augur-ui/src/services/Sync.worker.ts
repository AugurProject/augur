import { Events, Subscriptions, Sync } from "@augurproject/sdk";

// this to be as typesafe as possible with self and addEventListener + postMessage
const ctx: Worker = self as any;
const subscriptions = new Subscriptions(Events.augurEmitter);

ctx.addEventListener("message", async (message: any) => {
  if (message.data.subscribe) {
    const subscription: string = subscriptions.subscribe(message.data.subscribe, (data: {eventName: string}): void => {
      ctx.postMessage({
        eventName: data.eventName,
        result: data,
      });
    });

    ctx.postMessage({ subscribed: message.data.subscribe, subscription });

  } else if(message.data.method === "start") {
    await Sync.start(message.data.ethNodeUrl, message.data.account);

  } else {
    subscriptions.unsubscribe(message.data.unsubscribe);
  }
});

// to stop typescript from complaining
export default null as any;
