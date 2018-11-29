import Augur from "augur.js";
import { AugurNodeController } from "./controller";
import { ConnectOptions } from "./types";
import { logger } from "./utils/logger";

export function start(retries: number, config: ConnectOptions, databaseDir?: string) {
  const augur = new Augur();
  const augurNodeController = new AugurNodeController(augur, config, databaseDir);

  augur.rpc.setDebugOptions({ broadcast: false });
  augur.events.nodes.ethereum.on("disconnect", (event: any) => {
    logger.warn("Disconnected from Ethereum node", (event || {}).reason);
  });

  augur.events.nodes.ethereum.on("reconnect", () => {
    logger.warn("Reconnect to Ethereum node");
  });

  function errorCatch(err: Error) {
    if (retries > 0) {
      logger.warn(err.message);
      retries--;
      augurNodeController.shutdown();
      setTimeout(() => start(retries, config, databaseDir), 1000);
    } else {
      logger.error("Fatal Error:", err);
      process.exit(1);
    }
  }

  augurNodeController.start(errorCatch).catch(errorCatch);
}

if (require.main == module) {
  const retries: number = parseInt(process.env.MAX_SYSTEM_RETRIES || "1", 10);
  const databaseDir = process.env.AUGUR_DATABASE_DIR;
  const config = ConnectOptions.createFromEnvironment();

  start(retries, config, databaseDir);
}
