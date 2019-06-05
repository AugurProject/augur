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

const settings = require("./settings.json");

export async function create(ethNodeUrl:string, account?:string, dbArgs: DatabaseConfiguration= {}):Promise<{ api:API, controller:Controller }> {
  const ethersProvider = new EthersProvider(new JsonRpcProvider(ethNodeUrl), 10, 0, 40);
  const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, account);
  const networkId = await ethersProvider.getNetworkId();

  const augur = await Augur.create(ethersProvider, contractDependencies, Addresses[networkId]);
  const eventLogDBRouter = new EventLogDBRouter(augur.events.parseLogs);
  const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(ethersProvider, eventLogDBRouter, Addresses[networkId].Augur, augur.events.getEventTopics);
  const pouchDBFactory = PouchDBFactory(dbArgs);
  const controller = new Controller(augur, Number(networkId), settings.blockstreamDelay, UploadBlockNumbers[networkId], account ? [account] : [], pouchDBFactory, blockAndLogStreamerListener);

  const api = new API(augur, controller.db);

  return  { api, controller };
};

export async function buildAPI(ethNodeUrl:string, account?:string, dbArgs: DatabaseConfiguration= {}):Promise<API> {
  const { api } = await create(ethNodeUrl, account, dbArgs);
  return api;
}
