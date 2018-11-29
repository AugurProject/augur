import Augur from "augur.js";
import { AugurNodeController } from "./controller";
import { ConnectOptions } from "./types";
import { logger } from "./utils/logger";

const networkName = process.argv[2] || "environment";
const databaseDir = process.env.AUGUR_DATABASE_DIR;

// maxRetries is the maximum number of retries for retryable Ethereum
// RPC requests. maxRetries is passed to augur.js's augur.connect() and
// then to ethrpc library.connect(), and is used internally by ethrpc
// for both HTTP and WS transports. When an ethrpc request errors, a
// subset of errors are statically configured as retryable, in which case
// ethrpc will opaquely re-insert the RPC request at its internal queue
// head, such that augur.js (and augur-node) are ignorant of requests
// that eventually succeed after N retries (where N < maxRetries).
const maxRetries = process.env.MAX_REQUEST_RETRIES || 3; // default maxRetries to 3, because certain Ethereum RPC servers may frequently return transient errors and require non-zero ethrpc maxRetries to function sanely. Eg.  `geth --syncmode=light` frequently returns result "0x", signifying no data, for requests which should have data. Note that augur-app bypasses this entrypoint and has its own default for MAX_REQUEST_RETRIES.

const maxSystemRetries = process.env.MAX_SYSTEM_RETRIES || "3";
const propagationDelayWaitMillis = process.env.DELAY_WAIT_MILLIS;
const networkConfig = NetworkConfiguration.create(networkName, false);

let config = networkConfig;
if (maxRetries) config = Object.assign({}, config, { maxRetries });
if (propagationDelayWaitMillis) config = Object.assign({}, config, { propagationDelayWaitMillis });
const retries: number = parseInt(maxSystemRetries || "1", 10);

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
