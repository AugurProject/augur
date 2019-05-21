import { BigNumber } from "./types";
import { AugurNodeController } from "./controller";
import { logger } from "./utils/logger";
import { ConnectOptions } from "./setup/connectOptions";
import { Augur } from "@augurproject/sdk";

import { EthersProvider } from "@augurproject/ethersjs-provider";
import { JsonRpcProvider } from "ethers/providers/json-rpc-provider";

import { Addresses } from "@augurproject/artifacts";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";


export async function start(retries: number, config: ConnectOptions, databaseDir: string, isWarpSync: boolean) {
  const ethersProvider = new EthersProvider(new JsonRpcProvider(config.http), 5, 0, 40);

  const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined);
  const networkId = await ethersProvider.getNetworkId();
  const augur = new Augur<EthersProvider>(ethersProvider, contractDependencies, networkId, Addresses[networkId]);

  const augurNodeController = new AugurNodeController(augur, config, databaseDir, isWarpSync);

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
