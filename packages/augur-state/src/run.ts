import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { EthersProvider, Web3AsyncSendable } from "ethers-provider";
import { BigNumber as EthersBigNumber } from "ethers/utils";
import { Augur } from "@augurproject/api";
import { uploadBlockNumbers } from "@augurproject/artifacts";
import settings from "@augurproject/state/src/settings.json";
import { PouchDBFactory } from "./db/AbstractDB";
import { Controller } from "./Controller";

// TODO Add Ethereum node URL as param
export async function start() {
  const web3AsyncSendable = new Web3AsyncSendable(settings.ethNodeURLs[4], 5, 0, 40);
  const ethersProvider = new EthersProvider(web3AsyncSendable);
  const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, settings.testAccounts[0]);
  const augur = await Augur.create(ethersProvider, contractDependencies);
  const pouchDBFactory = PouchDBFactory({});
  const networkId = Number(augur.networkId);
  const controller = new Controller<EthersBigNumber>(augur, networkId, settings.blockstreamDelay, uploadBlockNumbers[networkId], [settings.testAccounts[0]], pouchDBFactory);
  controller.run();
}

if (require.main === module) {
  start();
}
