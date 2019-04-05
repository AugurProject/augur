import {ContractDependenciesEthers} from "contract-dependencies-ethers";
import {EthersProvider} from "@augurproject/ethersjs-provider";
import {BigNumber as EthersBigNumber} from "ethers/utils";
import {Augur} from "@augurproject/api";
import {uploadBlockNumbers, addresses} from "@augurproject/artifacts";
import {PouchDBFactory} from "./db/AbstractDB";
import {Controller} from "./Controller";
import { BlockAndLogStreamerListener } from "./db/BlockAndLogStreamerListener";
import { EventLogDBRouter } from "./db/EventLogDBRouter";
import { JsonRpcProvider } from "ethers/providers";

const settings = require("@augurproject/state/src/settings.json");

// TODO Add Ethereum node URL as param
export async function start() {
  const ethersProvider = new EthersProvider(new JsonRpcProvider(settings.ethNodeURLs[4]), 10, 0, 40);
  const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, settings.testAccounts[0]);
  const augur = await Augur.create(ethersProvider, contractDependencies, addresses[4]);

  const eventLogDBRouter = new EventLogDBRouter(augur.events.parseLogs);
  const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(ethersProvider, eventLogDBRouter, augur.addresses.Augur, augur.events.getEventTopics);
  const pouchDBFactory = PouchDBFactory({});
  const networkId = Number(augur.networkId);
  const controller = new Controller<EthersBigNumber>(augur, networkId, settings.blockstreamDelay, uploadBlockNumbers[networkId], [settings.testAccounts[0]], pouchDBFactory, blockAndLogStreamerListener);
  return controller.run();
}

const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

// Use this to see if you're running within a webworker
/* eslint-disable no-restricted-globals */
// const isWebWorker =
//   typeof self === 'object' &&
//   self.constructor &&
//   self.constructor.name === 'DedicatedWorkerGlobalScope';
/* eslint-enable no-restricted-globals */

// if being run start as a server
if (isNode) {
  // XXX: TODO - open a WS and JSON-RPC port
  start();
}

