import * as Sync from "./Sync";

// this to be as typesafe as possible with self and addEventListener + postMessage
const ctx: Worker = self as any;

ctx.addEventListener("message", (_) => {
  ctx.postMessage("pong");
});

// send everything to the browser so it can deal with it
console.log = (msg: string) => {
  ctx.postMessage(msg);
};

// the main reason for the worker, to sync in another thread
Sync.start({});

// to stop typescript from complaining
export default null as any;
