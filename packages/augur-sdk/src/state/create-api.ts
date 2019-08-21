import { Augur } from "../Augur";
import { BlockAndLogStreamerListener } from "./db/BlockAndLogStreamerListener";
import { ContractDependenciesGnosis } from "contract-dependencies-gnosis";
import { Controller } from "./Controller";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { JsonRpcProvider } from "ethers/providers";
import { PouchDBFactory } from "./db/AbstractDB";
import { EmptyConnector } from "../connector/empty-connector";
import { Addresses, UploadBlockNumbers } from "@augurproject/artifacts";
import { API } from "./getter/API";
import DatabaseConfiguration = PouchDB.Configuration.DatabaseConfiguration;
import { DB } from "./db/DB";
import { GnosisRelayAPI } from "@augurproject/gnosis-relay-api";

const settings = require("./settings.json");

async function buildDeps(ethNodeUrl: string, account?: string, dbArgs: PouchDB.Configuration.DatabaseConfiguration = {}, enableFlexSearch = false) {
  const ethersProvider = new EthersProvider(new JsonRpcProvider(ethNodeUrl), 10, 0, 40);
  const networkId = await ethersProvider.getNetworkId();
  const gnosisRelay = new GnosisRelayAPI(settings.gnosisRelayURLs[networkId]);
  const contractDependencies = new ContractDependenciesGnosis(ethersProvider, gnosisRelay, undefined, undefined, undefined, undefined, account);

  const augur = await Augur.create(ethersProvider, contractDependencies, Addresses[networkId], new EmptyConnector(), undefined, enableFlexSearch);
  const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(ethersProvider, Addresses[networkId].Augur, augur.events.getEventTopics, augur.events.parseLogs);
  const pouchDBFactory = PouchDBFactory(dbArgs);
  const db = DB.createAndInitializeDB(
    Number(networkId),
    settings.blockstreamDelay,
    UploadBlockNumbers[networkId],
    account ? [account] : [],
    augur,
    pouchDBFactory,
    blockAndLogStreamerListener
  );

  return { augur, blockAndLogStreamerListener, db };
}

export async function create(ethNodeUrl: string, account?: string, dbArgs: DatabaseConfiguration = {}, enableFlexSearch = false): Promise<{ api: API, controller: Controller }> {
  const { augur, blockAndLogStreamerListener, db } = await buildDeps(ethNodeUrl, account, dbArgs, enableFlexSearch);

  const controller = new Controller(augur, db, blockAndLogStreamerListener);
  const api = new API(augur, db);

  return { api, controller };
}

export async function buildAPI(ethNodeUrl: string, account?: string, dbArgs: DatabaseConfiguration = {}, enableFlexSearch = false): Promise<API> {
  const { augur, db } = await buildDeps(ethNodeUrl, account, dbArgs, enableFlexSearch);

  return new API(augur, db);
}
