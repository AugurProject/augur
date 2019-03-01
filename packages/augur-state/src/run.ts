import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { EthersProvider } from "ethers-provider";
import { BigNumber as EthersBigNumber } from "ethers/utils";
import Web3 from "web3";
import { Augur } from "@augurproject/api";
import { uploadBlockNumbers } from "@augurproject/artifacts";
import settings from "@augurproject/state/src/settings.json";
import { PouchDBFactory } from "./db/AbstractDB";
import { Controller } from "./Controller";
import { Web3Proxy } from "./Web3Proxy";

// TODO Add Ethereum node URL as param
export async function start() {
  const httpProvider = new Web3.providers.HttpProvider(settings.ethNodeURLs[4]);
  const web3Proxy = new Web3Proxy(httpProvider, 5, 100, 20);
  const ethersProvider = new EthersProvider(web3Proxy);
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
