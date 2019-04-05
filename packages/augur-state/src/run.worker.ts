// have to use require in workers so webpack is happy
const Run = require("./run");

const ctx: Worker = self as any;

ctx.addEventListener('message', event => {
  // XXX: todo, add routing code here
  ctx.postMessage("Response boo");
});

// send everything to the browser
console.log = (msg: string) => {
  ctx.postMessage(msg);
}

Run.start();

// to stop typescript from complaining
export default null as any;
