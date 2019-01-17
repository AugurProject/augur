import { Controller } from "./Controller";

export function start() {
  const controller = new Controller(1);
  controller.run(0);
}

if (require.main === module) {
  start();
}
