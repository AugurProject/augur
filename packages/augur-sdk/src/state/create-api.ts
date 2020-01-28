import { getAddressesForNetwork, getStartingBlockForNetwork, NetworkId } from '@augurproject/artifacts';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { EthersSigner } from 'contract-dependencies-ethers';
import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { JsonRpcProvider } from 'ethers/providers';
import { ContractEvents } from '../api/ContractEvents';
import { ZeroX } from '../api/ZeroX';
import { Augur } from '../Augur';
import { BaseConnector, EmptyConnector } from '../connector';
import { Controller } from './Controller';
import { BlockAndLogStreamerListener } from './db/BlockAndLogStreamerListener';
import { DB } from './db/DB';
import { API } from './getter/API';

export interface SDKConfiguration {
  networkId: NetworkId,
  ethereum?: {
    http: string,
    rpcRetryCount: number,
    rpcRetryInternval: number,
    rpcConcurrency: number
  },
  sdk?: {
    enabled?: boolean,
    ws: string,
  },
  gnosis?: {
    enabled?: boolean,
    http: string
  },
  zeroX?: {
    rpc?: {
      enabled?: boolean,
      ws?: string
    },
    mesh?: {
      verbosity?: 0|1|2|3|4|5,
      enabled?: boolean,
      bootstrapList?: string[]
    }
  },
  syncing?: {
    enabled?: boolean,
    blockstreamDelay?: number,
    chunkSize?: number
  }
};

export async function createClient(
  config: SDKConfiguration,
  connector: BaseConnector,
  account?: string,
  signer?: EthersSigner,
  provider?: EthersProvider,
  enableFlexSearch = false,
  createBrowserMesh?: (config: SDKConfiguration, zeroX: ZeroX) => void
  ): Promise<Augur> {

  const ethersProvider = provider || new EthersProvider( new JsonRpcProvider(config.ethereum.http), 10, 0, 40);
  const addresses = getAddressesForNetwork(config.networkId);
  const contractDependencies = ContractDependenciesGnosis.create(
    ethersProvider,
    signer,
    addresses.Cash,
    config.gnosis.http
  );

  let zeroX: ZeroX | null = null;
  if (config.zeroX) {
    const rpcEndpoint = (config.zeroX.rpc && config.zeroX.rpc.enabled) ? config.zeroX.rpc.ws : undefined;
    zeroX = new ZeroX(rpcEndpoint)

    if (config.zeroX.mesh && config.zeroX.mesh.enabled && createBrowserMesh) {
      // This function is passed in and takes care of assigning it to the
      // zeroX instance. This is largely due to the need to have special
      // casing for if the mesh dies and we want to restart it. This is
      // passed in as a function so all we need in this file is an
      // interface instead of actually import @0x/mesh-browser -- since
      // that would attempt to start the wasm client in nodejs and cause
      // everything to die.
      createBrowserMesh(config, zeroX);
    }
  }

  const client = await Augur.create(
    ethersProvider,
    contractDependencies,
    addresses,
    connector,
    zeroX,
    enableFlexSearch
  );

  return client;
}

export async function createServer(config: SDKConfiguration, client?: Augur, account?: string): Promise<{ api: API, controller: Controller }> {
  console.log('Creating Server');
  // Validate the config -- check that the syncing key exits and use defaults if not
  config = {
    syncing: {
      enabled: true,
      blockstreamDelay: 10,
      chunkSize: 100000
    },
    ...config
  };

  // On the server side there's no connector layer. Ideally all the server
  // side code would only use the `contracts` interface and not the Augur
  // functionality since that was really originally designed for client connection
  // over a connector TO the server.
  if (!client) {
    console.log('Creating a new client');
    const connector = new EmptyConnector();
    client = await createClient(config, connector, account, undefined, undefined, true);
  }

  const ethersProvider = new EthersProvider( new JsonRpcProvider(config.ethereum.http), 10, 0, 40);
  const contractEvents = new ContractEvents(
    ethersProvider,
    client.addresses.Augur,
    client.addresses.AugurTrading,
    client.addresses.ShareToken,
    client.addresses.Exchange
  );
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
    blockAndLogStreamerListener,
    config.zeroX && (config.zeroX.mesh && config.zeroX.mesh.enabled || config.zeroX.rpc && config.zeroX.rpc.enabled)
  );
  const controller = new Controller(client, db, blockAndLogStreamerListener);
  const api = new API(client, db);

  return { api, controller };
}

export async function startServerFromClient(config: SDKConfiguration, client?: Augur ): Promise<API> {
  const { api, controller } = await createServer(config, client);

  await controller.run();

  return api;
}

export async function startServer(config: SDKConfiguration, account?: string): Promise<API> {
  const { api, controller } = await createServer(config, undefined, account);

  await controller.run();

  return api;
}


