import RunWorker from "./Sync.worker";

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
