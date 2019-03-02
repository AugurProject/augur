import { Controller } from "./Controller";
import { Augur } from "@augurproject/api";
import { uploadBlockNumbers } from "@augurproject/artifacts";
import settings from "@augurproject/state/src/settings.json";
import { ethers } from "ethers";
import { EthersJsonRpcProvider as EthersProvider } from "@augurproject/ethers-provider";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { PouchDBFactory } from "./db/AbstractDB";

const TEST_NETWORK_ID = 4;

export async function start() {
  const provider = new EthersProvider(settings.ethNodeURLs[TEST_NETWORK_ID]);
  const contractDependencies = new ContractDependenciesEthers(provider, undefined, settings.testAccounts[0]);
  const augur = await Augur.create(provider, contractDependencies);
  const pouchDBFactory = PouchDBFactory({});
  const controller = new Controller<ethers.utils.BigNumber>(augur, TEST_NETWORK_ID, settings.blockstreamDelay, uploadBlockNumbers[TEST_NETWORK_ID], [settings.testAccounts[0]], pouchDBFactory);
  controller.run();
}

if (require.main === module) {
  start();
}
