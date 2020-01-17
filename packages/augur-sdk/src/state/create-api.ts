import { Augur } from '../Augur';
import { LogFilterAggregator } from './logs/LogFilterAggregator';
import { BlockAndLogStreamerSyncStrategy } from './sync/BlockAndLogStreamerSyncStrategy';
import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { Controller } from './Controller';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { JsonRpcProvider } from 'ethers/providers';
import { EmptyConnector } from '../connector/empty-connector';
import { Addresses, UploadBlockNumbers } from '@augurproject/artifacts';
import { API } from './getter/API';
import { DB } from './db/DB';
import { GnosisRelayAPI } from '@augurproject/gnosis-relay-api';
import { WSClient } from '@0x/mesh-rpc-client';
import { BulkSyncStrategy } from './sync/BulkSyncStrategy';
import { WarpSyncStrategy } from './sync/WarpSyncStrategy';

interface Settings {
  gnosisRelayURLs: {
    [network: number]: string
  },

  meshClientURLs: {
    [network: number]: string
  },

  ethNodeURLs: {
    [network: number]: string
  },

  testAccounts: string[],

  blockstreamDelay: number,

  endpointSettings: {
    pingMs: number,
    ws: {
      port: number;
    };
    wss: {
        startWSS: boolean;
        port: number;
    };
    http: {
        port: number;
    };
    https: {
        startHTTPS: boolean;
        port: number;
    };
    certificateInfo: {
        certificateFile: string;
        certificateKeyFile: string;
    }
  }
};
const settings: Settings = require('./settings.json');

async function buildDeps(ethNodeUrl: string, account?: string, enableFlexSearch = false) {
  try {
    const ethersProvider = new EthersProvider(new JsonRpcProvider(ethNodeUrl), 10, 0, 40);
    const networkId = await ethersProvider.getNetworkId();
    const uploadBlockNumber = UploadBlockNumbers[networkId];

    const gnosisRelayURL = settings.gnosisRelayURLs[networkId];
    if (typeof gnosisRelayURL === "undefined") {
      console.log(`No gnosis relayer url defined for network: ${networkId}, check settings.json -- using defaults`);
    }

    let meshClientURL = settings.meshClientURLs[networkId];
    if (typeof meshClientURL === "undefined") {
     console.log(`No mesh client url defined for network: ${networkId}, check settings.json -- using defaults`);
     meshClientURL = "ws://localhost:60557";
    }

    const gnosisRelay = new GnosisRelayAPI(gnosisRelayURL);

    const contractDependencies = new ContractDependenciesGnosis(ethersProvider, gnosisRelay, undefined, undefined, undefined, undefined, account);

    const augur = await Augur.create(ethersProvider, contractDependencies, Addresses[networkId], new EmptyConnector(), undefined, enableFlexSearch);
    const logFilterAggregator = LogFilterAggregator.create(
    augur.contractEvents.getEventTopics,
    augur.contractEvents.parseLogs,
    augur.contractEvents.getEventContractAddress
  );

    const db = DB.createAndInitializeDB(
      Number(networkId),
      logFilterAggregator,
      augur,
    );

    return { augur, ethersProvider, logFilterAggregator, db };
  }catch(e) {
    console.log('Error initializing api', e)
  }
  return null;
}

export async function create(ethNodeUrl: string, account?: string, enableFlexSearch = false): Promise<{ api: API, controller: Controller, blockAndLogStreamerSyncStrategy:BlockAndLogStreamerSyncStrategy, bulkSyncStrategy: BulkSyncStrategy, logFilterAggregator: LogFilterAggregator }> {
  const { augur, ethersProvider, logFilterAggregator, db } = await buildDeps(ethNodeUrl, account, enableFlexSearch);

  const bulkSyncStrategy = new BulkSyncStrategy(ethersProvider.getLogs, logFilterAggregator.buildFilter, logFilterAggregator.onLogsAdded, augur.contractEvents.parseLogs);

  const blockAndLogStreamerSyncStrategy = BlockAndLogStreamerSyncStrategy.create(
    ethersProvider,
    logFilterAggregator
  );

  const controller = new Controller(augur, db, logFilterAggregator);
  const api = new API(augur, db);

  return { api, controller, blockAndLogStreamerSyncStrategy, bulkSyncStrategy, logFilterAggregator};
}

export async function buildAPI(ethNodeUrl: string, account?: string, enableFlexSearch = false): Promise<API> {
  const { augur, db } = await buildDeps(ethNodeUrl, account, enableFlexSearch);

  return new API(augur, db);
}
