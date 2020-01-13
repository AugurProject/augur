import { ContractAddresses } from '@augurproject/artifacts';
import { NetworkId } from '@augurproject/artifacts/build';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import { WarpSyncStrategy } from '@augurproject/sdk/build/state/sync/WarpSyncStrategy';
import { configureDexieForNode } from '@augurproject/sdk/build/state/utils/DexieIDBShim';
import { WarpController } from '@augurproject/sdk/build/warp/WarpController';
import {
  ACCOUNTS,
  loadSeedFile,
  makeDependencies,
  makeSigner,
} from '@augurproject/tools';
import { ContractAPI, defaultSeedPath } from '@augurproject/tools/build';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import * as IPFS from 'ipfs';
import { makeDbMock, makeProvider } from '../../libs';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { API } from '@augurproject/sdk/build/state/getter/API';

const mock = makeDbMock();

describe('WarpController', () => {
  let addresses: ContractAddresses;
  let db: DB;
  let dependencies: ContractDependenciesEthers;
  let ipfs;
  let john: ContractAPI;
  let newJohn: ContractAPI;
  let networkId: NetworkId;
  let provider: TestEthersProvider;
  let warpController: WarpController;
  let fileHash: string;
  let allMarketIds: string[];

  beforeAll(async () => {
    configureDexieForNode(true);
    ipfs = await IPFS.create();

    const seed = await loadSeedFile(defaultSeedPath, 'WarpSync');

    provider = await makeProvider(seed, ACCOUNTS);
    networkId = await provider.getNetworkId();
    const signer = await makeSigner(ACCOUNTS[0], provider);
    dependencies = makeDependencies(ACCOUNTS[0], provider, signer);
    addresses = seed.addresses;

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
    newJohn = await ContractAPI.userWrapper(
      ACCOUNTS[0],
      provider,
      seed.addresses
    );

    db = await mock.makeDB(john.augur, ACCOUNTS);

    const bulkSyncStrategy = new BulkSyncStrategy(
      provider.getLogs,
      db.logFilters.buildFilter,
      db.logFilters.onLogsAdded,
      john.augur.contractEvents.parseLogs,
      1
    );

    // populate db.
    await bulkSyncStrategy.start(0, (await provider.getBlockNumber()));

    warpController = new WarpController(db, ipfs);
    fileHash = await warpController.createAllCheckpoints();

    allMarketIds = (await db.MarketCreated.toArray()).map(
      market => market.market
    );
  });

  afterAll(async () => {
    await ipfs.stop();
  });

  /*
    # From https://gist.github.com/pgebheim/3f2faae37f29f8e22d4bf4d5a0c6dbab
    - ${warppoint}/                             # ROOT hash for each warp sync there will be a unique hash
      - version                                 # Format Version, clients can use this to determine whether or not they're compatiable with the warp sync format.
      - index                                   # A serialized form of all content suitable for a new client getting all information
      - checkpoints/                            # A directory holding historical checkpoints, this can be capped at N checkpoints.
        - ${checkpoint_blocknumber}             # A directory holding data for a checkpoint as of a blocknumber
          - index                               # All checkpoint data in a serialized form consumable for clients that just need that checkpoint
      - events (Rename to tables)               # A directory containing serialized forms of each table
        - CompleteSetsPurchased
        - CompleteSetsSold
        - DisputeCrowdsourcerCompleted
        - ... MORE
        - TransferBatch
      - market/                               # A directory containing market rollups
        - volume                              # All market volumes
        - oi                                  # All market OIs
        - ${market_id}/
          - orders                            # Orders filtered by a market
      - token/                                # A directory containing token rollups
        - balance                             # Balances for all owner,token
      - share_token/                          # A directory containing share token rollups
        - balance                             # Balances for all [account, marketid, outcome]
      - account/${account_id}                 # Indexed lookups for an account
        - orders
        - pnl
        - market/${market_id}                 # indexed lookups for a market within an account
          - orders
          - pnl
  **/
  describe('structure', () => {
    describe('top-level directory', () => {
      test('should have a version file with the version number', async () => {
        await expect(ipfs.cat(`${fileHash}/VERSION`)).resolves.toEqual(
          Buffer.from('1')
        );
      });

      test('should have the prescribed layout', async () => {
        await expect(ipfs.ls(`${fileHash}`)).resolves.toEqual([
          expect.objectContaining({
            name: 'VERSION',
            type: 'file',
          }),
          expect.objectContaining({
            name: 'accounts',
            type: 'dir',
          }),
          expect.objectContaining({
            name: 'checkpoints',
            type: 'dir',
          }),
          expect.objectContaining({
            name: 'market',
            type: 'dir',
          }),
          expect.objectContaining({
            name: 'index',
            type: 'file',
          }),
          expect.objectContaining({
            name: 'tables',
            type: 'dir',
          }),
        ]);
      });

      describe('market rollup', () => {
        test('should create an item for all the markets', async () => {
          const allMarkets = allMarketIds.map(market => {
            return expect.objectContaining({
              name: market,
              type: 'dir',
            });
          });

          await expect(ipfs.ls(`${fileHash}/market`)).resolves.toEqual(
            expect.arrayContaining(allMarkets)
          );
        });

        test('should create an index file with all the logs for a market', async () => {
          const marketId = allMarketIds[0];
          const item = await ipfs.cat(`${fileHash}/market/${marketId}`);

          console.log('hash', `${fileHash}/market/${marketId}`);
          console.log(item.toString());
        });

        test('should reconstitute what is needed for the market', async () => {});

        test('should have a bunch of stuff for a given market', async () => {
          const marketId = allMarketIds[0];
          await expect(
            ipfs.ls(`${fileHash}/market/${marketId}`)
          ).resolves.toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                type: 'file',
                hash: marketId
              }),
            ])
          );
        });
      });
    });
  });

  describe('non-empty dbs', () => {
    // This is a spot check.
    test('should have some logs', async () => {
      const marketCreated = await ipfs.cat(
        `${fileHash}/tables/MarketCreated/index`
      );
      const splitLogs = marketCreated
        .toString()
        .split('\n')
        .filter(log => log)
        .map(log => {
          try {
            return JSON.parse(log);
          } catch (e) {
            console.error(e, log);
          }
        });

      expect(splitLogs).toEqual(await db.MarketCreated.toArray());
    });
  });

  describe('syncing', () => {
    let johnApi: API;
    let newJohnApi: API;
    let warpSyncStrategy: WarpSyncStrategy;
    let newJohnDB: DB;

    beforeEach(async () => {
      johnApi = new API(john.augur, Promise.resolve(db));

      newJohnDB = await mock.makeDB(newJohn.augur, ACCOUNTS);
      const newJohnWarpController = new WarpController(newJohnDB, ipfs);
      newJohnApi = new API(newJohn.augur, Promise.resolve(newJohnDB));

      warpSyncStrategy = new WarpSyncStrategy(
        newJohnWarpController,
        newJohnDB.logFilters.onLogsAdded
      );
    });

    describe('partial sync', () => {
      test('should load specific market data', async () => {
        const marketId = allMarketIds[3];
        await expect(warpSyncStrategy.syncMarket(fileHash, marketId)).resolves.toBeGreaterThan(0);

        const johnMarketList = await johnApi.route('getMarketsInfo', {
          marketIds: [marketId],
        });

        const newJohnMarketList = await newJohnApi.route('getMarketsInfo', {
          marketIds: [marketId],
        });

        expect(newJohnMarketList).toEqual(johnMarketList);
      });
      test('should load specific user data', async () => {
        const marketId = allMarketIds[3];

        await warpSyncStrategy.syncMarket(fileHash, marketId);
        await warpSyncStrategy.syncAccount(fileHash, newJohn.account.publicKey);

        const johnUserAccountData = await johnApi.route('getUserAccountData', {
          universe: addresses.Universe,
          account: john.account.publicKey,
        });

        const newJohnUserAccountData = await newJohnApi.route(
          'getUserAccountData',
          {
            universe: addresses.Universe,
            account: newJohn.account.publicKey,
          }
        );

        expect(newJohnUserAccountData).toEqual(johnUserAccountData);
      });
    });

    describe('full sync', () => {
      test('should populate market data', async () => {
        console.log('fileHash', fileHash);
        // populate db.
        await warpSyncStrategy.start(fileHash);

        const johnMarketList = await johnApi.route('getMarkets', {
          universe: addresses.Universe,
        });

        const newJohMarketList = await newJohnApi.route('getMarkets', {
          universe: addresses.Universe,
        });

        expect(newJohMarketList).toEqual(johnMarketList);
      });
    });
  });

  describe('warp sync checkpoint', () => {
    test('should ', async () => {});
  });
});
