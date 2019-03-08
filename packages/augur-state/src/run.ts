import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { EthersProvider, Web3AsyncSendable } from "ethers-provider";
import { BigNumber as EthersBigNumber } from "ethers/utils";
import { Augur } from "@augurproject/api";
import { uploadBlockNumbers } from "@augurproject/artifacts";
import settings from "@augurproject/state/src/settings.json";
import { Controller } from "./Controller";
import { PouchDBFactory } from "./db/AbstractDB";
import { BlockAndLogStreamerListener } from "./db/BlockAndLogStreamerListener";
import { EventLogDBRouter } from "./db/EventLogDBRouter";

// TODO Add Ethereum node URL as param
export async function start() {
  const web3AsyncSendable = new Web3AsyncSendable(settings.ethNodeURLs[4], 5, 0, 40);
  const ethersProvider = new EthersProvider(web3AsyncSendable);
  const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, settings.testAccounts[0]);
  const augur = await Augur.create(ethersProvider, contractDependencies);

  const eventLogDBRouter = new EventLogDBRouter();
  const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(ethersProvider, augur.events.parseLogs);

  const pouchDBFactory = PouchDBFactory({});
  const networkId = Number(augur.networkId);
  const controller = new Controller<EthersBigNumber>(
    augur,
    networkId,
    settings.blockstreamDelay,
    uploadBlockNumbers[networkId],
    [settings.testAccounts[0]],
    pouchDBFactory,
    blockAndLogStreamerListener);
  controller.run();
}

if (require.main === module) {
  start();
}
