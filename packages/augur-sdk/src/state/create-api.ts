import { Augur } from "../Augur";
import { BlockAndLogStreamerListener } from "./db/BlockAndLogStreamerListener";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Controller } from "./Controller";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { EventLogDBRouter } from "./db/EventLogDBRouter";
import { JsonRpcProvider } from "ethers/providers";
import { PouchDBFactory } from "./db/AbstractDB";
import { Addresses, UploadBlockNumbers } from "@augurproject/artifacts";
import { API } from "./getter/API";
import DatabaseConfiguration = PouchDB.Configuration.DatabaseConfiguration;
import { DB } from "./db/DB";

const settings = require("./settings.json");

async function buildDeps(ethNodeUrl: string, account?: string, dbArgs: PouchDB.Configuration.DatabaseConfiguration = {}) {
  console.log("EEEEEEEEEEEE");
  const ethersProvider = new EthersProvider(new JsonRpcProvider(ethNodeUrl), 10, 0, 40);
  const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, account);
  const networkId = await ethersProvider.getNetworkId();

  console.log("FFFFFFFFFFF1111111111")
  const augur = await Augur.create(ethersProvider, contractDependencies, Addresses[networkId]);
  const eventLogDBRouter = new EventLogDBRouter(augur.events.parseLogs);
  const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(ethersProvider, eventLogDBRouter, Addresses[networkId].Augur, augur.events.getEventTopics);
  const pouchDBFactory = PouchDBFactory(dbArgs);
  const db = DB.createAndInitializeDB(
    Number(networkId),
    settings.blockstreamDelay,
    UploadBlockNumbers[networkId],
    account ? [account] : [],
    augur,
    pouchDBFactory,
    blockAndLogStreamerListener,
  );

  return { augur, blockAndLogStreamerListener, db };
}

export async function create(ethNodeUrl: string, account?: string, dbArgs: DatabaseConfiguration = {}): Promise<{ api: API, controller: Controller }> {
  console.log("BLAKABL HALBHALHBA")
  const { augur, blockAndLogStreamerListener, db } = await buildDeps(ethNodeUrl, account, dbArgs);

  const controller = new Controller(augur, db, blockAndLogStreamerListener);
  const api = new API(augur, db);

  return { api, controller };
};

export async function buildAPI(ethNodeUrl: string, account?: string, dbArgs: DatabaseConfiguration = {}): Promise<API> {
  const { augur, blockAndLogStreamerListener, db } = await buildDeps(ethNodeUrl, account, dbArgs);

  return new API(augur, db);
}
