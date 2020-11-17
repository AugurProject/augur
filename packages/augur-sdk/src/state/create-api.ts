import { EthersSigner, ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { SubscriptionEventName } from '@augurproject/sdk-lite';
import { logger, LoggerLevels, SDKConfiguration } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import { SupportedProvider } from 'ethereum-types';
import { JsonRpcProvider } from 'ethers/providers';
import { ContractEvents } from '../api/ContractEvents';
import { ZeroX } from '../api/ZeroX';
import { Augur } from '../Augur';
import { BaseConnector, EmptyConnector } from '../connector';
import { WarpController } from '../warp/WarpController';
import { Controller } from './Controller';
import { DB } from './db/DB';
import { API } from './getter/API';
import { LogFilterAggregator } from './logs/LogFilterAggregator';
import { BlockAndLogStreamerSyncStrategy } from './sync/BlockAndLogStreamerSyncStrategy';
import { BulkSyncStrategy } from './sync/BulkSyncStrategy';
import { GraphQLLogProvider } from '../graph/GraphQLLogProvider';

export async function buildSyncStrategies(client:Augur, db:Promise<DB>, provider: EthersProvider, logFilterAggregator: LogFilterAggregator, config: SDKConfiguration) {
  const warpController = new WarpController((await db), client, provider,
    config.uploadBlockNumber, config.warpSync.ipfsEndpoint);

  client.warpController = warpController;
  return async () => {
    const contractAddresses = client.contractEvents.getAugurContractAddresses();
    const uploadBlockNumber = config.uploadBlockNumber;
    let currentBlockNumber = await provider.getBlockNumber();

    let bulkSyncStrategy = null;

    if (config.graph && config.graph.logSubgraphURL) {
      const logProvider = new GraphQLLogProvider(config.graph.logSubgraphURL);
      const status = await logProvider.getSyncStatus();
      if(status.health === "healthy") {
        currentBlockNumber = status.latestBlockNumber;
        bulkSyncStrategy = new BulkSyncStrategy(logProvider.getLogs.bind(logProvider),
          contractAddresses, logFilterAggregator.onLogsAdded,
          (logs: any[]) => { return logs; }
        );
      }
    }

    if (bulkSyncStrategy === null) {
      bulkSyncStrategy = new BulkSyncStrategy(provider.getLogs,
        contractAddresses, logFilterAggregator.onLogsAdded,
        client.contractEvents.parseLogs);
    }

    const blockAndLogStreamerSyncStrategy = BlockAndLogStreamerSyncStrategy.create(
      provider,
      contractAddresses,
      logFilterAggregator,
      client.contractEvents.parseLogs,
    );

    const marketCreatedCB = async (blockNumber, logs) => {
      client.events.emit(SubscriptionEventName.MarketsUpdated, logs);
    };

    logFilterAggregator.listenForEvent('MarketCreated', marketCreatedCB);

    client.warpController = warpController;

    if (config.warpSync && config.warpSync.createCheckpoints) {
      client.events.once(SubscriptionEventName.SDKReady, () => {
        // Check on each new block to see if we need to generate a checkpoint.
        client.events.on(SubscriptionEventName.NewBlock, async (newBlock) => {
          const block = await provider.getBlock(newBlock.lastSyncedBlockNumber);
          await warpController.onNewBlock(block);
        });
      });
    }

    const staringSyncBlockNumber =  await (await db).getSyncStartingBlock() || uploadBlockNumber;
    const endBulkSyncBlockNumber = await bulkSyncStrategy.start(staringSyncBlockNumber, currentBlockNumber);

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
    logFilterAggregator.unlistenForEvent('MarketCreated', marketCreatedCB);

    logger.info('Syncing Complete - SDK Ready');

    blockAndLogStreamerSyncStrategy.listenForBlockRemoved(logFilterAggregator.onBlockRemoved);

    await blockAndLogStreamerSyncStrategy.start(endBulkSyncBlockNumber);
  };
}

export async function createClient(
  config: SDKConfiguration,
  connector: BaseConnector,
  signer?: EthersSigner,
  provider?: EthersProvider,
  enableFlexSearch = false,
  createBrowserMesh?: (config: SDKConfiguration, web3Provider: SupportedProvider, zeroX: ZeroX) => void
  ): Promise<Augur> {

  let ethersProvider: EthersProvider;
  if (provider) {
    ethersProvider = provider
  } else if (config.ethereum?.http) {
    ethersProvider = new EthersProvider( new JsonRpcProvider(config.ethereum.http), 5, 50, 10);
  } else {
    throw Error('No ethereum http endpoint provided');
  }
  if (!config.addresses) {
    throw Error('Config must include addresses');
  }

  const contractDependencies = new ContractDependenciesEthers(ethersProvider, signer);

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

  if (!config?.sdk?.enabled && config.zeroX?.mesh?.enabled && createBrowserMesh) {
    // This function is passed in and takes care of assigning it to the
    // zeroX instance. This is largely due to the need to have special
    // casing for if the mesh dies and we want to restart it. This is
    // passed in as a function so all we need in this file is an
    // interface instead of actually import @0x/mesh-browser -- since
    // that would attempt to start the wasm client in nodejs and cause
    // everything to die.
    if (config.zeroX?.delayTillSDKReady) {
      client.events.once(SubscriptionEventName.SDKReady, () => {
        console.log(`DELAYED 0x CREATION`);
        createBrowserMesh(config, ethersProvider, zeroX);
      });
    } else {
      createBrowserMesh(config, ethersProvider, zeroX);
    }
  }

  return client;
}

export async function createServer(config: SDKConfiguration, client?: Augur): Promise<{ api: API, controller: Controller, sync: () => Promise<void> }> {
  logger.logLevel = config.logLevel;
  logger.info('Creating Server');

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
    logger.time(LoggerLevels.debug, creatingClientLabel);
    client = await createClient(config, new EmptyConnector(), undefined, undefined, true);
    logger.timeEnd(LoggerLevels.debug, creatingClientLabel);
  }

  const ethersProvider: EthersProvider = client.provider as EthersProvider;
  const contractEvents = new ContractEvents(
    ethersProvider,
    client.config.addresses.Augur,
    client.config.addresses.AugurTrading,
    client.config.addresses.ShareToken,
  );

  const logFilterAggregator = LogFilterAggregator.create(
    contractEvents.getEventTopics,
    contractEvents.parseLogs,
  );
  const db = DB.createAndInitializeDB(
    Number(config.networkId),
    config.uploadBlockNumber,
    logFilterAggregator,
    client,
    config.zeroX?.mesh?.enabled || config.zeroX?.rpc?.enabled
  );

  if(config.warpSync?.createCheckpoints && config.warpSync?.autoReport) {
    client.events.on(SubscriptionEventName.WarpSyncHashUpdated,
      async ({ hash }) => {
        const result  = await client.getAccountEthBalance();
        const balance = new BigNumber(result);

        if (balance.eq(0)) {
          console.log(`Please deposit eth to account ${await client.getAccount()} to autoreport`);
          return;
        }

        if (hash) {
          const market = await client.warpSync.getWarpSyncMarket(
            config.addresses.Universe);
          const payoutNumerators = await client.warpSync.getPayoutFromWarpSyncHash(
            hash);

          await market.doInitialReport(payoutNumerators, '', new BigNumber(0));
        }
      });
  }

  const sync = await buildSyncStrategies(client, db, ethersProvider, logFilterAggregator, config);

  const controller = new Controller(client, db, logFilterAggregator);
  const api = new API(client, db);

  return { api, controller, sync };
}

export async function startServerFromClient(config: SDKConfiguration, client?: Augur ): Promise<API> {
  const { api, sync } = await createServer(config, client);

  sync().catch((error) => api.augur.events.emit("error", error))

  return api;
}

export async function startServer(config: SDKConfiguration): Promise<API> {
  const { api, sync } = await createServer(config, undefined);

  sync().catch((error) => api.augur.events.emit("error", error))

  return api;
}
