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

export interface ClientConfiguration {
  networkId: NetworkId,
  sdk?: {
    ws: string,
  },
  ethereum: {
    http: string
  },
  gnosis?: {
    http: string
  }
  zeroX?: {
    rpc?: {
      ws: string
    },
    mesh?: {
      bootStrapList?: string[]
    }
  }
};

export async function createClient(config: ClientConfiguration, connector: BaseConnector, account?: string, signer?: EthersSigner, provider?: JsonRpcProvider, enableFlexSearch: boolean = false) {
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

export interface ServerConfiguration extends ClientConfiguration {
  syncing: {
    blockstreamDelay?: number,
    chunkSize?: number
  }
}

export async function createServer(config: ServerConfiguration): Promise<{ api: API, controller: Controller }> {
  // On the server side there's no connector layer. Ideally all the server
  // side code would only use the `contracts` interface and not the Augur
  // functionality since that was really originally designed for client connection
  // over a connector TO the server.
  const connector = new EmptyConnector();
  const client = await createClient(config, connector, undefined, undefined, undefined, true);

  const ethersProvider = new EthersProvider( new JsonRpcProvider(config.ethereum.http), 10, 0, 40)
  const contractEvents = new ContractEvents(ethersProvider, client.addresses.Augur, client.addresses.AugurTrading, client.addresses.ShareToken);
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

export async function startServer(config: ServerConfiguration): Promise<API> {
  const { api, controller } = await createServer(config);

  await controller.run();

  return api;
}


