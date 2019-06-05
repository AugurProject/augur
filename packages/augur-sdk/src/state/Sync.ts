import {Augur} from "../Augur";
import {BlockAndLogStreamerListener} from "./db/BlockAndLogStreamerListener";
import {ContractDependenciesEthers} from "contract-dependencies-ethers";
import {Controller} from "./Controller";
import {EthersProvider} from "@augurproject/ethersjs-provider";
import {EventLogDBRouter} from "./db/EventLogDBRouter";
import {JsonRpcProvider} from "ethers/providers";
import {PouchDBFactory} from "./db/AbstractDB";
import {Addresses, UploadBlockNumbers} from "@augurproject/artifacts";
import {API} from "./getter/API";
import DatabaseConfiguration = PouchDB.Configuration.DatabaseConfiguration;

const settings = require("@augurproject/sdk/src/state/settings.json");

// TODO Add Ethereum node URL as param
export async function start(ethNodeUrl:string, account?:string, dbArgs: DatabaseConfiguration= {}):Promise<API> {
  const ethersProvider = new EthersProvider(new JsonRpcProvider(settings.ethNodeURLs[4]), 10, 0, 40);
  const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, settings.testAccounts[0]);
  const augur = await Augur.create(ethersProvider, contractDependencies, Addresses[4]);

  const eventLogDBRouter = new EventLogDBRouter(augur.events.parseLogs);
  const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(ethersProvider, eventLogDBRouter, Addresses.Augur, augur.events.getEventTopics);
  const pouchDBFactory = PouchDBFactory(dbArgs);
  const networkId = Number(augur.networkId);
  const controller = new Controller(augur, networkId, settings.blockstreamDelay, UploadBlockNumbers[networkId], [settings.testAccounts[0]], pouchDBFactory, blockAndLogStreamerListener);

  console.log("Starting controller");

  await controller.run();

  return  new API(augur, controller.db);
}
