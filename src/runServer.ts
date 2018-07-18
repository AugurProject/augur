import Augur from "augur.js";
import { NetworkConfiguration } from "augur-core";
import { AugurNodeController } from "./controller";
import { logger } from "./utils/logger";

const networkName = process.argv[2] || "environment";
const databaseDir = process.env.AUGUR_DATABASE_DIR;
const networkConfig = NetworkConfiguration.create(networkName);

const augur: Augur = new Augur();

const augurNodeController = new AugurNodeController(augur, networkConfig, databaseDir);

augur.rpc.setDebugOptions({ broadcast: false });
augur.events.nodes.ethereum.on("disconnect", (event) => {
  logger.warn("Disconnected from Ethereum node", event);
  augurNodeController.shutdown();
  throw new Error("Disconnected from Ethereum node");
});

const errorCallback = (err: any) => {
  logger.error("Fatal Error:", err);
  process.exit(1);
};

augurNodeController.start(errorCallback).catch(errorCallback);
