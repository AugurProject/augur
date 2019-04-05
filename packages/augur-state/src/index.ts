export {API} from "./api/API";
export {ServerController} from "./server/ServerController";
export {Controller} from "./Controller";

import RunWorker from "./run.worker.ts";

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// start the webworker and move console.log over to paint in the browser
if (isBrowser) {
  console.log = (msg: string) => {
    let c = <HTMLInputElement>document.getElementById("console");
    if (msg && c)
      c.value += msg + '\n';
  }

  console.log("Starting web worker");

  const worker = new RunWorker();

  worker.onmessage = (event: MessageEvent) => {
    console.log(event.data);
  }
}
else {
  console.log("Your browser does not support web workers");
}
