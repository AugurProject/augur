import RunWorker from "./Sync.worker";

// start the web worker and move console.log over to paint in the browser
console.log = (msg: string) => {
  const c = document.getElementById("console") as HTMLInputElement;
  if (msg && c)
    c.value += msg + "\n";
};

console.log("Starting web worker");

// assumption is this will fail if the browser doesn't support web workers
try {
  const worker = new RunWorker();

  worker.onmessage = (event: MessageEvent) => {
    console.log(event.data);
  };
} catch (error) {
  console.log("Your browser does not support web workers");
}
