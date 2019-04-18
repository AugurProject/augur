import * as Sync from "./sync";

// this to be as typesafe as possible with self and addEventListener + postMessage
const ctx: Worker = self as any;

ctx.addEventListener("message", (_) => {
  // XXX: todo, add routing code here
  ctx.postMessage("Response boo");
});

// send everything to the browser
console.log = (msg: string) => {
  ctx.postMessage(msg);
};

Sync.start();

// to stop typescript from complaining
export default null as any;
