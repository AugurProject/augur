import { Controller } from "./Controller";
import { logger } from "./utils/logger";

export function start() {
  const controller = new Controller(1);
  controller.doThing(1);
}

if (require.main === module) {
  start();
}
