import Augur from "augur.js";
import { NetworkConfiguration } from "augur-core";
import { AugurNodeController } from "./controller";
import { logger } from "./utils/logger";

const networkName = process.argv[2] || "environment";
const databaseDir = process.env.AUGUR_DATABASE_DIR;
const maxRetries = process.env.MAX_REQUEST_RETRIES;
const maxSystemRetries = process.env.MAX_SYSTEM_RETRIES;
const propagationDelayWaitMillis = process.env.DELAY_WAIT_MILLIS;
const networkConfig = NetworkConfiguration.create(networkName, false);

let config = networkConfig;
if (maxRetries) config = Object.assign({}, config, { maxRetries });
if (propagationDelayWaitMillis) config = Object.assign({}, config, { propagationDelayWaitMillis });
const retries: number = parseInt(maxSystemRetries || "1", 10);

function start(retries: number, config: any, databaseDir: any) {
  const augur = new Augur();
  const augurNodeController = new AugurNodeController(augur, config, databaseDir);

  augur.rpc.setDebugOptions({ broadcast: false });
  augur.events.nodes.ethereum.on("disconnect", (event) => {
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

start(retries, config, databaseDir);
