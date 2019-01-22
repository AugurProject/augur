import Augur from "augur.js";
import { AugurNodeController } from "./controller";
import { logger } from "./utils/logger";
import { ConnectOptions } from "./setup/connectOptions";

export function start(retries: number, config: ConnectOptions, databaseDir: string, isWarpSync: boolean) {
  const augur = new Augur();
  const augurNodeController = new AugurNodeController(augur, config, databaseDir, isWarpSync);

  augur.rpc.setDebugOptions({ broadcast: false });
  augur.events.nodes.ethereum.on("disconnect", (event: any) => {
    logger.warn("Disconnected from Ethereum node", (event || {}).reason);
  });

  augur.events.nodes.ethereum.on("reconnect", () => {
    logger.warn("Reconnect to Ethereum node");
  });

  function errorCatch(err: Error) {
    function fatalError(e: Error) {
      logger.error("Fatal Error:", e);
      process.exit(1);
    }
    if (retries > 0) {
      logger.warn(err.message);
      retries--;
      augurNodeController.shutdown().catch(fatalError);
      setTimeout(() => start(retries, config, databaseDir, isWarpSync), 1000);
    } else {
      fatalError(err);
    }
  }

  augurNodeController.start(errorCatch).catch(errorCatch);
}

if (require.main === module) {
  const retries: number = parseInt(process.env.MAX_SYSTEM_RETRIES || "1", 10);
  const isWarpSync = process.env.IS_WARP_SYNC  === "true";
  const databaseDir = process.env.AUGUR_DATABASE_DIR || ".";
  const config = ConnectOptions.createFromEnvironment();

  start(retries, config, databaseDir, isWarpSync);
}
