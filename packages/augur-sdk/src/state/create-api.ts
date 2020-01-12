import { getAddressesForNetwork, getStartingBlockForNetwork, NetworkId } from '@augurproject/artifacts';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { EthersSigner } from 'contract-dependencies-ethers';
import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { JsonRpcProvider } from 'ethers/providers';
import { ContractEvents } from "../api/ContractEvents";
import { Augur } from '../Augur';
import { BaseConnector, EmptyConnector } from '../connector';
import { Controller } from './Controller';
import { BlockAndLogStreamerListener } from './db/BlockAndLogStreamerListener';
import { DB } from './db/DB';
import { API } from './getter/API';

export interface SDKConfiguration {
  networkId: NetworkId,
  sdk?: {
    ws: string,
  },
  ethereum?: {
    http: string
  },
  gnosis?: {
    http: string
  }
  zeroX?: {
    verbosity?: 0|1|2|3|4|5,
    rpc?: {
      ws: string
    },
    mesh?: {
      bootstrapList?: string[]
    }
  },
  syncing?: {
    blockstreamDelay?: number,
    chunkSize?: number
  }
};

export async function createClient(config: SDKConfiguration, connector: BaseConnector, account?: string, signer?: EthersSigner, provider?: JsonRpcProvider, enableFlexSearch: boolean = false) {
  const ethersProvider = new EthersProvider( provider || new JsonRpcProvider(config.ethereum.http), 10, 0, 40);
  const addresses = getAddressesForNetwork(config.networkId);
  const contractDependencies = ContractDependenciesGnosis.create(
    ethersProvider,
    signer,
    addresses.Cash,
    config.gnosis.http
  );

  return await Augur.create(
    ethersProvider,
    contractDependencies,
    addresses,
    connector,
    enableFlexSearch
  );
}

export async function createServer(config: SDKConfiguration, account?: string): Promise<{ api: API, controller: Controller }> {
  // Validate the config -- check that the syncing key exits and use defaults if not
  config = {
    syncing: {
      blockstreamDelay: 10,
      chunkSize: 100000
    },
    ...config
  };

  // On the server side there's no connector layer. Ideally all the server
  // side code would only use the `contracts` interface and not the Augur
  // functionality since that was really originally designed for client connection
  // over a connector TO the server.

  const connector = new EmptyConnector();
  const client = await createClient(config, connector, account, undefined, undefined, true);

  const ethersProvider = new EthersProvider( new JsonRpcProvider(config.ethereum.http), 10, 0, 40)
  const contractEvents = new ContractEvents(ethersProvider, client.addresses.Augur, client.addresses.AugurTrading, client.addresses.ShareToken, client.addresses.Exchange);
  const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(
    ethersProvider,
    contractEvents.getEventTopics,
    contractEvents.parseLogs,
    contractEvents.getEventContractAddress
  );
  const db = DB.createAndInitializeDB(
    Number(config.networkId),
    config.syncing.blockstreamDelay,
    getStartingBlockForNetwork(config.networkId),
    client,
    blockAndLogStreamerListener
  );
  const controller = new Controller(client, db, blockAndLogStreamerListener);
  const api = new API(client, db);

  return { api, controller };
}

export async function startServer(config: SDKConfiguration, account?: string): Promise<API> {
  const { api, controller } = await createServer(config, account);

  await controller.run();

  return api;
}


