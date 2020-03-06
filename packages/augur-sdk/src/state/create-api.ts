import { getAddressesForNetwork, getStartingBlockForNetwork, SDKConfiguration } from '@augurproject/artifacts';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { EthersSigner } from 'contract-dependencies-ethers';
import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { SupportedProvider } from 'ethereum-types';
import { JsonRpcProvider } from 'ethers/providers';
import { ContractEvents } from '../api/ContractEvents';
import { ZeroX } from '../api/ZeroX';
import { Augur } from '../Augur';
import { BaseConnector, EmptyConnector } from '../connector';
import { SubscriptionEventName } from '../constants';
import { WarpController } from '../warp/WarpController';
import { Controller } from './Controller';
import { DB } from './db/DB';
import { API } from './getter/API';
import { LogFilterAggregator } from './logs/LogFilterAggregator';
import { BlockAndLogStreamerSyncStrategy } from './sync/BlockAndLogStreamerSyncStrategy';
import { BulkSyncStrategy } from './sync/BulkSyncStrategy';
import { WarpSyncStrategy } from './sync/WarpSyncStrategy';

export function buildSyncStrategies(client:Augur, db:Promise<DB>, provider: EthersProvider, logFilterAggregator: LogFilterAggregator, config: SDKConfiguration) {
  return async () => {
    const uploadBlockNumber = getStartingBlockForNetwork(config.networkId);
    const uploadBlockHeaders = await provider.getBlock(uploadBlockNumber);
    const currentBlockNumber = await provider.getBlockNumber();
    const contractAddresses = client.contractEvents.getAugurContractAddresses();

    const bulkSyncStrategy = new BulkSyncStrategy(provider.getLogs, contractAddresses, logFilterAggregator.onLogsAdded, client.contractEvents.parseLogs);
    const blockAndLogStreamerSyncStrategy = BlockAndLogStreamerSyncStrategy.create(
      provider,
      contractAddresses,
      logFilterAggregator,
      client.contractEvents.parseLogs,
    );

    const warpController = new WarpController((await db), client, provider, uploadBlockHeaders);
    const warpSyncStrategy = new WarpSyncStrategy(warpController, logFilterAggregator.onLogsAdded);

    const endWarpSyncBlockNumber = await warpSyncStrategy.start();
    const staringSyncBlock = Math.max(await (await db).getSyncStartingBlock(), endWarpSyncBlockNumber || uploadBlockNumber);
    const endBulkSyncBlockNumber = await bulkSyncStrategy.start(staringSyncBlock, currentBlockNumber);

    const derivedSyncLabel = 'Syncing rollup and derived DBs';
    console.time(derivedSyncLabel);
    await (await db).sync();
    console.timeEnd(derivedSyncLabel);

    // This will register the event listeners for the various derived/rollup dbs.
    client.events.emit(SubscriptionEventName.BulkSyncComplete, {
      eventName: SubscriptionEventName.BulkSyncComplete,
    });
    client.events.emit(SubscriptionEventName.SDKReady, {
      eventName: SubscriptionEventName.SDKReady,
    });
    console.log('Syncing Complete - SDK Ready');

    blockAndLogStreamerSyncStrategy.listenForBlockRemoved(logFilterAggregator.onBlockRemoved);

    // Check on each new block to see if we need to generate a checkpoint.
    client.events.on(SubscriptionEventName.NewBlock, async (newBlock) => {
      const block = await provider.getBlock(newBlock.lastSyncedBlockNumber);
      await warpController.onNewBlock(block);
    });

    await blockAndLogStreamerSyncStrategy.start(endBulkSyncBlockNumber);
  };
}

export async function createClient(
  config: SDKConfiguration,
  connector: BaseConnector,
  account?: string,
  signer?: EthersSigner,
  provider?: EthersProvider,
  enableFlexSearch = false,
  createBrowserMesh?: (config: SDKConfiguration, web3Provider: SupportedProvider, zeroX: ZeroX) => void
  ): Promise<Augur> {

  let ethersProvider: EthersProvider;
  if (provider) {
    ethersProvider = provider
  } else if (config.ethereum?.http) {
    ethersProvider = new EthersProvider( new JsonRpcProvider(config.ethereum.http), 10, 0, 40);
  } else {
      throw Error('No ethereum http endpoint provided');
  }
  if (!config.addresses) {
    throw Error('Config must include addresses');
  }

  const contractDependencies = ContractDependenciesGnosis.create(
    ethersProvider,
    signer,
    config.addresses.Cash,
    config.gnosis?.http,
  );

  let zeroX: ZeroX = null;
  if (config.zeroX) {
    const rpcEndpoint = (config.zeroX.rpc?.enabled) ? config.zeroX.rpc.ws : undefined;
    zeroX = new ZeroX(rpcEndpoint)
  }

  const client = await Augur.create(
    ethersProvider,
    contractDependencies,
    config,
    connector,
    zeroX,
    enableFlexSearch
  );

  // Delay loading of the browser mesh until we're finished syncing
  client.events.once(SubscriptionEventName.BulkSyncComplete, () => {
    if (config.zeroX?.mesh?.enabled && createBrowserMesh) {
      // This function is passed in and takes care of assigning it to the
      // zeroX instance. This is largely due to the need to have special
      // casing for if the mesh dies and we want to restart it. This is
      // passed in as a function so all we need in this file is an
      // interface instead of actually import @0x/mesh-browser -- since
      // that would attempt to start the wasm client in nodejs and cause
      // everything to die.
      createBrowserMesh(config, ethersProvider, zeroX);
    }
  });

  return client;
}

export async function createServer(config: SDKConfiguration, client?: Augur, account?: string): Promise<{ api: API, controller: Controller, sync: () => Promise<void> }> {
  console.log('Creating Server');
  // Validate the config -- check that the syncing key exists and use defaults if not
  config = {
    syncing: {
      enabled: true,
    },
    ...config
  };

  // On the server side there's no connector layer. Ideally all the server
  // side code would only use the `contracts` interface and not the Augur
  // functionality since that was really originally designed for client connection
  // over a connector TO the server.
  if (!client) {
    const creatingClientLabel = 'Creating a new client';
    console.time(creatingClientLabel);
    client = await createClient(config, new EmptyConnector(), account, undefined, undefined, true);
    console.time(creatingClientLabel);
  }

  const ethersProvider: EthersProvider = client.provider as EthersProvider;
  const contractEvents = new ContractEvents(
    ethersProvider,
    client.config.addresses.Augur,
    client.config.addresses.AugurTrading,
    client.config.addresses.ShareToken,
    client.config.addresses.Exchange
  );

  const logFilterAggregator = LogFilterAggregator.create(
    contractEvents.getEventTopics,
    contractEvents.parseLogs,
  );
  const db = DB.createAndInitializeDB(
    Number(config.networkId),
    logFilterAggregator,
    client,
    config.zeroX?.mesh?.enabled || config.zeroX?.rpc?.enabled
  );

  const sync = buildSyncStrategies(client, db, ethersProvider, logFilterAggregator, config);

  const controller = new Controller(client, db, logFilterAggregator);
  const api = new API(client, db);

  return { api, controller, sync };
}

export async function startServerFromClient(config: SDKConfiguration, client?: Augur ): Promise<API> {
  const { api, sync } = await createServer(config, client);

  // TODO should this await?
  sync();
  /*
  controller.run().catch((err) => {
    // TODO: PG needs to handle what happens if the server side of the connector dies
    console.log('Error starting up Augur syncing services');
  });
  */

  return api;
}

export async function startServer(config: SDKConfiguration, account?: string): Promise<API> {
  const { api, sync } = await createServer(config, undefined, account);

  // TODO should this await?
  sync();

  return api;
}
